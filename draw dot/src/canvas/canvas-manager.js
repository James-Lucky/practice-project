// Canvas Manager — Master coordinator for Fabric Canvas, Layer synchronization, and Tools
import { Canvas, Point, util, ActiveSelection } from 'fabric';
import { PanZoomController } from './pan-zoom.js';
import { LaserEngine } from '../laser/laser-engine.js';
import { SnappingEngine } from '../snapping/snapping-engine.js';
import { HistoryManager } from '../history/history-manager.js';
import { PenTool } from '../tools/pen-tool.js';
import { ShapeTool } from '../tools/shape-tool.js';
import { TextTool } from '../tools/text-tool.js';
import { EraserTool } from '../tools/eraser-tool.js';
import { ExportManager } from '../export/export-manager.js';

export class CanvasManager {
  constructor() {
    this.viewportEl = document.getElementById('canvas-viewport');
    this.backgroundGridEl = document.getElementById('background-grid');
    this.fabricCanvasEl = document.getElementById('fabric-canvas');
    this.overlayCanvasEl = document.getElementById('overlay-canvas');

    // Default Drawing Styles
    this.currentStyle = {
      stroke: '#6366f1', // Indigo accent
      fill: 'transparent',
      strokeWidth: 4,
      strokeStyle: 'solid', // solid | dashed | dotted
      opacity: 1,
      cornerRadius: 0,
      fontSize: 24,
      laserColor: '#ef4444'
    };

    this.activeTool = 'select';
    this.bgPattern = 'dots'; // dots | grid | none
    this.baseGridSize = 24;

    this.initFabric();
    this.initOverlay();
    this.initSubsystems();
    this.initEvents();
    this.initWindowResize();
    this.syncBackgroundGrid();
  }

  initFabric() {
    const width = this.viewportEl.clientWidth;
    const height = this.viewportEl.clientHeight;

    this.canvas = new Canvas(this.fabricCanvasEl, {
      width: width,
      height: height,
      selection: true,
      selectionColor: 'rgba(99, 102, 241, 0.12)',
      selectionBorderColor: '#6366f1',
      selectionLineWidth: 1.5,
      preserveObjectStacking: true,
      stopContextMenu: true,
      fireRightClick: true
    });

    // Modernize default selection controls across all objects
    const objProto = Object.getPrototypeOf(this.canvas);
    this.canvas.on('object:added', (e) => {
      const obj = e.target;
      if (!obj) return;
      obj.set({
        cornerStyle: 'circle',
        cornerColor: '#ffffff',
        cornerStrokeColor: '#6366f1',
        borderColor: '#6366f1',
        cornerSize: 8,
        borderScaleFactor: 1.5,
        transparentCorners: false,
        padding: 4
      });
    });
  }

  initOverlay() {
    const width = this.viewportEl.clientWidth;
    const height = this.viewportEl.clientHeight;

    this.overlayCanvasEl.width = width;
    this.overlayCanvasEl.height = height;
    this.overlayCanvasEl.style.width = `${width}px`;
    this.overlayCanvasEl.style.height = `${height}px`;
  }

  initSubsystems() {
    this.panZoom = new PanZoomController(this);
    this.laserEngine = new LaserEngine(this.overlayCanvasEl);
    this.snapping = new SnappingEngine(this, this.overlayCanvasEl);
    this.history = new HistoryManager(this);
    this.exportMgr = new ExportManager(this);

    // Tools
    this.penTool = new PenTool(this);
    this.shapeTool = new ShapeTool(this);
    this.textTool = new TextTool(this);
    this.eraserTool = new EraserTool(this);
  }

  initEvents() {
    const canvas = this.canvas;

    // Mouse Down
    canvas.on('mouse:down', (e) => {
      if (this.panZoom.handleMouseDown(e)) return;

      if (this.activeTool === 'pen') {
        this.penTool.handleMouseDown(e);
      } else if (['rectangle', 'circle', 'line', 'arrow'].includes(this.activeTool)) {
        this.shapeTool.handleMouseDown(e);
      } else if (this.activeTool === 'text') {
        this.textTool.handleMouseDown(e);
      } else if (this.activeTool === 'eraser') {
        this.eraserTool.handleMouseDown(e);
      }
    });

    // Mouse Move
    canvas.on('mouse:move', (e) => {
      if (this.panZoom.handleMouseMove(e)) return;

      if (this.activeTool === 'pen') {
        this.penTool.handleMouseMove(e);
      } else if (['rectangle', 'circle', 'line', 'arrow'].includes(this.activeTool)) {
        this.shapeTool.handleMouseMove(e);
      } else if (this.activeTool === 'eraser') {
        this.eraserTool.handleMouseMove(e);
      }
    });

    // Mouse Up
    canvas.on('mouse:up', (e) => {
      if (this.panZoom.handleMouseUp()) return;

      if (this.activeTool === 'pen') {
        this.penTool.handleMouseUp();
      } else if (['rectangle', 'circle', 'line', 'arrow'].includes(this.activeTool)) {
        this.shapeTool.handleMouseUp(e);
      } else if (this.activeTool === 'eraser') {
        this.eraserTool.handleMouseUp();
      }
    });

    // Canvas Selection updates
    canvas.on('selection:created', (e) => this.handleSelectionChange(e));
    canvas.on('selection:updated', (e) => this.handleSelectionChange(e));
    canvas.on('selection:cleared', () => this.handleSelectionChange(null));

    // Keyboard Shortcuts (Delete, Duplicate, Select All, etc.)
    window.addEventListener('keydown', (e) => {
      if (
        document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA' ||
        canvas.getActiveObject()?.isEditing
      ) {
        return;
      }

      // Delete / Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        this.deleteSelected();
      }

      // Duplicate: Ctrl+D
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        this.duplicateSelected();
      }

      // Select All: Ctrl+A
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        this.selectAll();
      }

      // Bring Forward: ]
      if (e.key === ']' && !e.ctrlKey) {
        this.bringForward();
      }

      // Send Backward: [
      if (e.key === '[' && !e.ctrlKey) {
        this.sendBackward();
      }
    });

    // Drag and drop drawing files (.json / .drawdot) directly onto canvas
    window.addEventListener('dragover', (e) => e.preventDefault());
    window.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.name.endsWith('.json') || file.name.endsWith('.drawdot')) {
          this.exportMgr.importJSONFile(file);
        }
      }
    });
  }

  initWindowResize() {
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const width = this.viewportEl.clientWidth;
        const height = this.viewportEl.clientHeight;

        this.canvas.setDimensions({ width, height });

        this.overlayCanvasEl.width = width;
        this.overlayCanvasEl.height = height;
        this.overlayCanvasEl.style.width = `${width}px`;
        this.overlayCanvasEl.style.height = `${height}px`;

        this.syncBackgroundGrid();
        this.canvas.requestRenderAll();
      }, 100);
    });
  }

  // Layer 1 Background Sync: updates repeating pattern position and scale
  syncBackgroundGrid() {
    const vpt = this.canvas.viewportTransform;
    const zoom = vpt[0];
    const panX = vpt[4];
    const panY = vpt[5];

    const scaledGridSize = this.baseGridSize * zoom;

    this.backgroundGridEl.style.backgroundPosition = `${panX}px ${panY}px`;
    this.backgroundGridEl.style.backgroundSize = `${scaledGridSize}px ${scaledGridSize}px`;
  }

  setTool(tool) {
    this.activeTool = tool;

    // Discard active Fabric selection when switching away from 'select'
    if (tool !== 'select') {
      this.canvas.discardActiveObject();
      this.canvas.requestRenderAll();
    }

    // Configure Fabric selection mode
    this.canvas.selection = tool === 'select';
    this.canvas.skipTargetFind = tool !== 'select' && tool !== 'eraser';

    // Handle Laser Engine Layer 3 activation
    if (tool === 'laser') {
      this.laserEngine.setActive(true);
    } else {
      this.laserEngine.setActive(false);
    }

    this.updateCanvasCursor();

    if (this.onToolChange) {
      this.onToolChange(tool);
    }
  }

  updateCanvasCursor() {
    const canvas = this.canvas;
    let cursor = 'default';

    switch (this.activeTool) {
      case 'select':
        cursor = 'default';
        break;
      case 'hand':
        cursor = 'grab';
        break;
      case 'rectangle':
      case 'circle':
      case 'line':
      case 'arrow':
      case 'pen':
        cursor = 'crosshair';
        break;
      case 'text':
        cursor = 'text';
        break;
      case 'eraser':
        cursor = 'pointer';
        break;
      case 'laser':
        cursor = 'none';
        break;
    }

    canvas.defaultCursor = cursor;
    canvas.setCursor(cursor);
  }

  setStyle(key, val) {
    this.currentStyle[key] = val;

    // If an object is actively selected, apply the property live!
    const active = this.canvas.getActiveObject();
    if (active) {
      if (key === 'stroke') {
        if (active.type === 'path' && active.fill && !active.stroke) {
          // Freehand pen path
          active.set('fill', val);
        } else {
          active.set('stroke', val);
        }
      } else if (key === 'fill') {
        active.set('fill', val);
      } else if (key === 'strokeWidth') {
        active.set('strokeWidth', val);
      } else if (key === 'strokeStyle') {
        const dash = this.shapeTool.getDashArray(val);
        active.set('strokeDashArray', dash);
      } else if (key === 'opacity') {
        active.set('opacity', val);
      } else if (key === 'cornerRadius' && active.type === 'rect') {
        active.set({ rx: val, ry: val });
      } else if (key === 'fontSize' && active.type === 'textbox') {
        active.set('fontSize', val);
      }
      this.canvas.requestRenderAll();
      this.history.debounceSave();
    }
  }

  handleSelectionChange(e) {
    const active = this.canvas.getActiveObject();
    if (this.onSelectionChange) {
      this.onSelectionChange(active);
    }
  }

  deleteSelected() {
    const activeObjects = this.canvas.getActiveObjects();
    if (activeObjects.length === 0) return;

    this.canvas.discardActiveObject();
    activeObjects.forEach((obj) => this.canvas.remove(obj));
    this.canvas.requestRenderAll();
    this.history.saveStateImmediate();
    this.onCanvasContentChanged();
  }

  async duplicateSelected() {
    const active = this.canvas.getActiveObject();
    if (!active) return;

    const cloned = await active.clone();
    this.canvas.discardActiveObject();
    cloned.set({
      left: cloned.left + 24,
      top: cloned.top + 24,
      evented: true
    });

    if (cloned.type === 'activeSelection') {
      cloned.canvas = this.canvas;
      cloned.forEachObject((obj) => {
        this.canvas.add(obj);
      });
      cloned.setCoords();
    } else {
      this.canvas.add(cloned);
    }

    this.canvas.setActiveObject(cloned);
    this.canvas.requestRenderAll();
    this.history.saveStateImmediate();
    this.onCanvasContentChanged();
  }

  selectAll() {
    this.setTool('select');
    this.canvas.discardActiveObject();
    const objs = this.canvas.getObjects().filter((o) => !o.isTemporary);
    if (objs.length === 0) return;

    // Use Fabric selection
    const sel = new ActiveSelection(objs, {
      canvas: this.canvas
    });
    this.canvas.setActiveObject(sel);
    this.canvas.requestRenderAll();
  }

  bringForward() {
    const active = this.canvas.getActiveObject();
    if (active) {
      this.canvas.bringObjectForward(active);
      this.canvas.requestRenderAll();
      this.history.saveStateImmediate();
    }
  }

  sendBackward() {
    const active = this.canvas.getActiveObject();
    if (active) {
      this.canvas.sendObjectBackwards(active);
      this.canvas.requestRenderAll();
      this.history.saveStateImmediate();
    }
  }

  clearCanvas() {
    this.canvas.clear();
    this.history.clear();
    this.onCanvasContentChanged();
    this.showToast('Canvas cleared', 'info');
  }

  cycleBackgroundPattern() {
    const patterns = ['dots', 'grid', 'none'];
    const idx = patterns.indexOf(this.bgPattern);
    this.bgPattern = patterns[(idx + 1) % patterns.length];

    this.backgroundGridEl.className = `canvas-layer canvas-layer-background pattern-${this.bgPattern}`;
    return this.bgPattern;
  }

  onCanvasContentChanged() {
    const count = this.canvas.getObjects().filter((o) => !o.isTemporary).length;
    const badge = document.getElementById('canvas-items-count');
    if (badge) {
      badge.textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
    }
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-zinc-900/90 backdrop-blur-md shadow-xl text-xs font-medium text-white transition-all duration-200';
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px) scale(0.95)';
      setTimeout(() => toast.remove(), 200);
    }, 2500);
  }
}
