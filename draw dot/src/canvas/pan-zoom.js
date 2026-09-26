// Pan and Zoom Controller for Fabric Canvas
import { Point } from 'fabric';

export class PanZoomController {
  constructor(canvasManager) {
    this.cm = canvasManager;
    this.canvas = canvasManager.canvas;

    this.isPanning = false;
    this.lastClientX = 0;
    this.lastClientY = 0;
    this.isSpacePressed = false;
    this.zoomLevel = 1.0;
    this.minZoom = 0.1;
    this.maxZoom = 5.0;

    this.onZoomChange = null;

    this.initListeners();
  }

  initListeners() {
    const canvas = this.canvas;
    const upperCanvas = canvas.upperCanvasEl;

    // Mouse Wheel Zoom
    upperCanvas.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        e.stopPropagation();

        const pointer = canvas.getScenePoint(e);
        const delta = e.deltaY;
        let zoom = canvas.getZoom();

        // Smooth zoom scaling
        const zoomFactor = delta > 0 ? 0.92 : 1.08;
        zoom = Math.min(Math.max(zoom * zoomFactor, this.minZoom), this.maxZoom);

        canvas.zoomToPoint(new Point(e.offsetX, e.offsetY), zoom);
        this.zoomLevel = zoom;

        this.cm.syncBackgroundGrid();
        if (this.onZoomChange) {
          this.onZoomChange(this.zoomLevel);
        }
      },
      { passive: false }
    );

    // Spacebar Keydown / Keyup for Pan toggle
    window.addEventListener('keydown', (e) => {
      if (
        (e.code === 'Space' || e.key === ' ') &&
        !this.isSpacePressed &&
        document.activeElement.tagName !== 'INPUT' &&
        document.activeElement.tagName !== 'TEXTAREA' &&
        !canvas.getActiveObject()?.isEditing
      ) {
        this.isSpacePressed = true;
        this.updateCursor();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space' || e.key === ' ') {
        this.isSpacePressed = false;
        this.isPanning = false;
        this.updateCursor();
      }
    });
  }

  handleMouseDown(e) {
    const isMiddleClick = e.e && e.e.button === 1;
    const isHandTool = this.cm.activeTool === 'hand';

    if (this.isSpacePressed || isMiddleClick || isHandTool) {
      this.isPanning = true;
      this.lastClientX = e.e.clientX;
      this.lastClientY = e.e.clientY;
      this.canvas.defaultCursor = 'grabbing';
      this.canvas.setCursor('grabbing');
      return true; // handled
    }
    return false;
  }

  handleMouseMove(e) {
    if (!this.isPanning) return false;

    const deltaX = e.e.clientX - this.lastClientX;
    const deltaY = e.e.clientY - this.lastClientY;

    this.lastClientX = e.e.clientX;
    this.lastClientY = e.e.clientY;

    this.canvas.relativePan(new Point(deltaX, deltaY));
    this.cm.syncBackgroundGrid();
    return true;
  }

  handleMouseUp() {
    if (this.isPanning) {
      this.isPanning = false;
      this.updateCursor();
      return true;
    }
    return false;
  }

  updateCursor() {
    if (this.isSpacePressed || this.cm.activeTool === 'hand') {
      this.canvas.defaultCursor = 'grab';
      this.canvas.setCursor('grab');
    } else {
      this.cm.updateCanvasCursor();
    }
  }

  zoomIn() {
    const center = new Point(this.canvas.getWidth() / 2, this.canvas.getHeight() / 2);
    let zoom = Math.min(this.canvas.getZoom() * 1.2, this.maxZoom);
    this.canvas.zoomToPoint(center, zoom);
    this.zoomLevel = zoom;
    this.cm.syncBackgroundGrid();
    if (this.onZoomChange) this.onZoomChange(this.zoomLevel);
  }

  zoomOut() {
    const center = new Point(this.canvas.getWidth() / 2, this.canvas.getHeight() / 2);
    let zoom = Math.max(this.canvas.getZoom() * 0.8, this.minZoom);
    this.canvas.zoomToPoint(center, zoom);
    this.zoomLevel = zoom;
    this.cm.syncBackgroundGrid();
    if (this.onZoomChange) this.onZoomChange(this.zoomLevel);
  }

  resetZoom() {
    const center = new Point(this.canvas.getWidth() / 2, this.canvas.getHeight() / 2);
    this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    this.zoomLevel = 1.0;
    this.cm.syncBackgroundGrid();
    if (this.onZoomChange) this.onZoomChange(this.zoomLevel);
  }

  fitToContent() {
    const objects = this.canvas.getObjects();
    if (objects.length === 0) {
      this.resetZoom();
      return;
    }

    // Compute bounding box of all objects
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    objects.forEach((obj) => {
      const bound = obj.getBoundingRect();
      minX = Math.min(minX, bound.left);
      minY = Math.min(minY, bound.top);
      maxX = Math.max(maxX, bound.left + bound.width);
      maxY = Math.max(maxY, bound.top + bound.height);
    });

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    if (contentWidth <= 0 || contentHeight <= 0) {
      this.resetZoom();
      return;
    }

    const padding = 60;
    const canvasWidth = this.canvas.getWidth();
    const canvasHeight = this.canvas.getHeight();

    const scaleX = (canvasWidth - padding * 2) / contentWidth;
    const scaleY = (canvasHeight - padding * 2) / contentHeight;
    const zoom = Math.min(Math.max(Math.min(scaleX, scaleY), this.minZoom), 2.0);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const panX = canvasWidth / 2 - centerX * zoom;
    const panY = canvasHeight / 2 - centerY * zoom;

    this.canvas.setViewportTransform([zoom, 0, 0, zoom, panX, panY]);
    this.zoomLevel = zoom;
    this.cm.syncBackgroundGrid();
    if (this.onZoomChange) this.onZoomChange(this.zoomLevel);
  }
}
