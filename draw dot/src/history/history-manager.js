// History Manager — Snapshot-based Undo / Redo Stack for Fabric Canvas

export class HistoryManager {
  constructor(canvasManager) {
    this.cm = canvasManager;
    this.canvas = canvasManager.canvas;

    this.undoStack = [];
    this.redoStack = [];
    this.maxDepth = 50;

    this.isLocked = false; // Prevents snapshot while applying undo/redo
    this.saveTimeout = null;

    this.onHistoryChange = null;

    this.initListeners();
    // Record initial empty state
    this.saveStateImmediate();
  }

  initListeners() {
    const canvas = this.canvas;

    canvas.on('object:added', (e) => {
      if (e.target?.isTemporary) return;
      this.debounceSave();
    });

    canvas.on('object:modified', () => {
      this.debounceSave();
    });

    canvas.on('object:removed', (e) => {
      if (e.target?.isTemporary) return;
      this.debounceSave();
    });

    // Keyboard Shortcuts: Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z
    window.addEventListener('keydown', (e) => {
      if (
        document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA' ||
        canvas.getActiveObject()?.isEditing
      ) {
        return; // Don't intercept when user is typing text
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          this.redo();
        } else {
          this.undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        this.redo();
      }
    });
  }

  debounceSave() {
    if (this.isLocked) return;
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      this.saveStateImmediate();
    }, 150);
  }

  saveStateImmediate() {
    if (this.isLocked) return;

    // Serialize canvas state
    const json = this.canvas.toJSON(['id', 'isArrow', 'customType', 'selectable']);
    const stateStr = JSON.stringify(json);

    // Don't push duplicate state
    if (this.undoStack.length > 0 && this.undoStack[this.undoStack.length - 1] === stateStr) {
      return;
    }

    this.undoStack.push(stateStr);
    if (this.undoStack.length > this.maxDepth) {
      this.undoStack.shift();
    }

    // New action clears redo stack
    this.redoStack = [];
    this.notifyChange();
  }

  async undo() {
    if (this.undoStack.length <= 1 || this.isLocked) return;

    this.isLocked = true;
    const currentState = this.undoStack.pop();
    this.redoStack.push(currentState);

    const previousState = this.undoStack[this.undoStack.length - 1];

    try {
      await this.canvas.loadFromJSON(JSON.parse(previousState));
      this.canvas.requestRenderAll();
      this.cm.onCanvasContentChanged();
    } catch (err) {
      console.error('Error during undo:', err);
    } finally {
      this.isLocked = false;
      this.notifyChange();
    }
  }

  async redo() {
    if (this.redoStack.length === 0 || this.isLocked) return;

    this.isLocked = true;
    const nextState = this.redoStack.pop();
    this.undoStack.push(nextState);

    try {
      await this.canvas.loadFromJSON(JSON.parse(nextState));
      this.canvas.requestRenderAll();
      this.cm.onCanvasContentChanged();
    } catch (err) {
      console.error('Error during redo:', err);
    } finally {
      this.isLocked = false;
      this.notifyChange();
    }
  }

  canUndo() {
    return this.undoStack.length > 1;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  notifyChange() {
    if (this.onHistoryChange) {
      this.onHistoryChange({
        canUndo: this.canUndo(),
        canRedo: this.canRedo(),
        count: this.canvas.getObjects().length
      });
    }
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
    this.saveStateImmediate();
  }
}
