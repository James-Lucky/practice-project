// Eraser Tool — Click or drag to erase strokes and shapes
export class EraserTool {
  constructor(canvasManager) {
    this.cm = canvasManager;
    this.canvas = canvasManager.canvas;
    this.isErasing = false;
  }

  handleMouseDown(e) {
    this.isErasing = true;
    this.eraseAtPoint(e);
  }

  handleMouseMove(e) {
    if (!this.isErasing) return;
    this.eraseAtPoint(e);
  }

  handleMouseUp() {
    this.isErasing = false;
  }

  eraseAtPoint(e) {
    const pt = this.canvas.getScenePoint(e.e);
    const objects = this.canvas.getObjects();

    // Check from top to bottom (reverse z-order)
    for (let i = objects.length - 1; i >= 0; i--) {
      const obj = objects[i];
      if (obj.isTemporary) continue;

      if (obj.containsPoint(pt)) {
        this.canvas.remove(obj);
        this.canvas.requestRenderAll();
        return;
      }
    }
  }
}
