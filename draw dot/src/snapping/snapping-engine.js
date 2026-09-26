// Snapping Engine — Implements Figma/Excalidraw-style Smart Guides & Grid Snapping
// Renders guidelines strictly on Layer 3 (Overlay Canvas) with zero impact on Fabric objects or undo history

import { util, Point } from 'fabric';

export class SnappingEngine {
  constructor(canvasManager, overlayCanvas) {
    this.cm = canvasManager;
    this.canvas = canvasManager.canvas;
    this.overlayCanvas = overlayCanvas;
    this.ctx = overlayCanvas.getContext('2d');

    this.guidesEnabled = true;
    this.gridSnapEnabled = false;
    this.gridSize = 20;
    this.snapThreshold = 12; // screen pixels threshold for magnetic snap
    this.aligningLineOffset = 24;

    this.initListeners();
  }

  setGuidesEnabled(enabled) {
    this.guidesEnabled = enabled;
    if (!enabled) this.clearGuides();
  }

  setGridSnapEnabled(enabled) {
    this.gridSnapEnabled = enabled;
  }

  initListeners() {
    const canvas = this.canvas;

    canvas.on('object:moving', (e) => {
      this.handleObjectMoving(e);
    });

    canvas.on('object:modified', () => {
      this.clearGuides();
    });

    canvas.on('selection:cleared', () => {
      this.clearGuides();
    });

    canvas.on('mouse:up', () => {
      this.clearGuides();
    });
  }

  isInRange(v1, v2, threshold) {
    return Math.abs(Math.round(v1) - Math.round(v2)) <= threshold;
  }

  handleObjectMoving(e) {
    const activeObject = e.target;
    if (!activeObject) return;

    this.clearGuides();

    // 1. Grid snapping (when smart guides off)
    if (this.gridSnapEnabled && !this.guidesEnabled) {
      this.snapToGrid(activeObject);
      return;
    }

    if (!this.guidesEnabled) {
      if (this.gridSnapEnabled) this.snapToGrid(activeObject);
      return;
    }

    // 2. Smart Guides alignment
    const canvas = this.canvas;
    const zoom = canvas.getZoom();
    const threshold = this.snapThreshold / zoom;
    const offset = this.aligningLineOffset / zoom;
    const vpt = canvas.viewportTransform;

    const activeCenter = activeObject.getCenterPoint();
    let activeLeft = activeCenter.x;
    let activeTop = activeCenter.y;
    const activeWidth = activeObject.getScaledWidth();
    const activeHeight = activeObject.getScaledHeight();

    const canvasObjects = canvas.getObjects().filter((obj) => {
      return (
        obj !== activeObject &&
        obj.visible &&
        !obj.isTemporary &&
        !(activeObject.type === 'activeSelection' && activeObject.contains(obj))
      );
    });

    if (canvasObjects.length === 0) {
      if (this.gridSnapEnabled) this.snapToGrid(activeObject);
      return;
    }

    const verticalLines = [];
    const horizontalLines = [];

    for (let i = canvasObjects.length; i--; ) {
      const other = canvasObjects[i];
      const otherCenter = other.getCenterPoint();
      const otherLeft = otherCenter.x;
      const otherTop = otherCenter.y;
      const otherWidth = other.getScaledWidth();
      const otherHeight = other.getScaledHeight();

      // Horizontal Alignment 1: Active Right touches Other Left
      if (this.isInRange(activeLeft + activeWidth / 2, otherLeft - otherWidth / 2, threshold)) {
        verticalLines.push({
          x: otherLeft - otherWidth / 2,
          y1: Math.min(activeTop - activeHeight / 2, otherTop - otherHeight / 2) - offset,
          y2: Math.max(activeTop + activeHeight / 2, otherTop + otherHeight / 2) + offset,
          label: `${Math.round(otherLeft - otherWidth / 2)}`
        });
        activeLeft = otherLeft - otherWidth / 2 - activeWidth / 2;
        activeObject.setPositionByOrigin(new Point(activeLeft, activeTop), 'center', 'center');
      }

      // Horizontal Alignment 2: Active Left touches Other Right
      if (this.isInRange(activeLeft - activeWidth / 2, otherLeft + otherWidth / 2, threshold)) {
        verticalLines.push({
          x: otherLeft + otherWidth / 2,
          y1: Math.min(activeTop - activeHeight / 2, otherTop - otherHeight / 2) - offset,
          y2: Math.max(activeTop + activeHeight / 2, otherTop + otherHeight / 2) + offset,
          label: `${Math.round(otherLeft + otherWidth / 2)}`
        });
        activeLeft = otherLeft + otherWidth / 2 + activeWidth / 2;
        activeObject.setPositionByOrigin(new Point(activeLeft, activeTop), 'center', 'center');
      }

      // Horizontal Alignment 3: Snap by Center X
      if (this.isInRange(activeLeft, otherLeft, threshold)) {
        verticalLines.push({
          x: otherLeft,
          y1: Math.min(activeTop - activeHeight / 2, otherTop - otherHeight / 2) - offset,
          y2: Math.max(activeTop + activeHeight / 2, otherTop + otherHeight / 2) + offset,
          label: 'Center X'
        });
        activeLeft = otherLeft;
        activeObject.setPositionByOrigin(new Point(activeLeft, activeTop), 'center', 'center');
      }

      // Horizontal Alignment 4: Snap Left edge with Left edge
      if (this.isInRange(activeLeft - activeWidth / 2, otherLeft - otherWidth / 2, threshold)) {
        verticalLines.push({
          x: otherLeft - otherWidth / 2,
          y1: Math.min(activeTop - activeHeight / 2, otherTop - otherHeight / 2) - offset,
          y2: Math.max(activeTop + activeHeight / 2, otherTop + otherHeight / 2) + offset,
          label: `${Math.round(otherLeft - otherWidth / 2)}`
        });
        activeLeft = otherLeft - otherWidth / 2 + activeWidth / 2;
        activeObject.setPositionByOrigin(new Point(activeLeft, activeTop), 'center', 'center');
      }

      // Horizontal Alignment 5: Snap Right edge with Right edge
      if (this.isInRange(activeLeft + activeWidth / 2, otherLeft + otherWidth / 2, threshold)) {
        verticalLines.push({
          x: otherLeft + otherWidth / 2,
          y1: Math.min(activeTop - activeHeight / 2, otherTop - otherHeight / 2) - offset,
          y2: Math.max(activeTop + activeHeight / 2, otherTop + otherHeight / 2) + offset,
          label: `${Math.round(otherLeft + otherWidth / 2)}`
        });
        activeLeft = otherLeft + otherWidth / 2 - activeWidth / 2;
        activeObject.setPositionByOrigin(new Point(activeLeft, activeTop), 'center', 'center');
      }

      // Vertical Alignment 1: Active Top touches Other Bottom
      if (this.isInRange(activeTop - activeHeight / 2, otherTop + otherHeight / 2, threshold)) {
        horizontalLines.push({
          y: otherTop + otherHeight / 2,
          x1: Math.min(activeLeft - activeWidth / 2, otherLeft - otherWidth / 2) - offset,
          x2: Math.max(activeLeft + activeWidth / 2, otherLeft + otherWidth / 2) + offset,
          label: `${Math.round(otherTop + otherHeight / 2)}`
        });
        activeTop = otherTop + otherHeight / 2 + activeHeight / 2;
        activeObject.setPositionByOrigin(new Point(activeLeft, activeTop), 'center', 'center');
      }

      // Vertical Alignment 2: Active Bottom touches Other Top
      if (this.isInRange(activeTop + activeHeight / 2, otherTop - otherHeight / 2, threshold)) {
        horizontalLines.push({
          y: otherTop - otherHeight / 2,
          x1: Math.min(activeLeft - activeWidth / 2, otherLeft - otherWidth / 2) - offset,
          x2: Math.max(activeLeft + activeWidth / 2, otherLeft + otherWidth / 2) + offset,
          label: `${Math.round(otherTop - otherHeight / 2)}`
        });
        activeTop = otherTop - otherHeight / 2 - activeHeight / 2;
        activeObject.setPositionByOrigin(new Point(activeLeft, activeTop), 'center', 'center');
      }

      // Vertical Alignment 3: Snap by Center Y
      if (this.isInRange(activeTop, otherTop, threshold)) {
        horizontalLines.push({
          y: otherTop,
          x1: Math.min(activeLeft - activeWidth / 2, otherLeft - otherWidth / 2) - offset,
          x2: Math.max(activeLeft + activeWidth / 2, otherLeft + otherWidth / 2) + offset,
          label: 'Center Y'
        });
        activeTop = otherTop;
        activeObject.setPositionByOrigin(new Point(activeLeft, activeTop), 'center', 'center');
      }

      // Vertical Alignment 4: Snap Top edge with Top edge
      if (this.isInRange(activeTop - activeHeight / 2, otherTop - otherHeight / 2, threshold)) {
        horizontalLines.push({
          y: otherTop - otherHeight / 2,
          x1: Math.min(activeLeft - activeWidth / 2, otherLeft - otherWidth / 2) - offset,
          x2: Math.max(activeLeft + activeWidth / 2, otherLeft + otherWidth / 2) + offset,
          label: `${Math.round(otherTop - otherHeight / 2)}`
        });
        activeTop = otherTop - otherHeight / 2 + activeHeight / 2;
        activeObject.setPositionByOrigin(new Point(activeLeft, activeTop), 'center', 'center');
      }

      // Vertical Alignment 5: Snap Bottom edge with Bottom edge
      if (this.isInRange(activeTop + activeHeight / 2, otherTop + otherHeight / 2, threshold)) {
        horizontalLines.push({
          y: otherTop + otherHeight / 2,
          x1: Math.min(activeLeft - activeWidth / 2, otherLeft - otherWidth / 2) - offset,
          x2: Math.max(activeLeft + activeWidth / 2, otherLeft + otherWidth / 2) + offset,
          label: `${Math.round(otherTop + otherHeight / 2)}`
        });
        activeTop = otherTop + otherHeight / 2 - activeHeight / 2;
        activeObject.setPositionByOrigin(new Point(activeLeft, activeTop), 'center', 'center');
      }
    }

    activeObject.setCoords();

    if (verticalLines.length > 0 || horizontalLines.length > 0) {
      this.renderGuides(verticalLines, horizontalLines, vpt);
    }
  }

  snapToGrid(obj) {
    const gridSize = this.gridSize;
    obj.set({
      left: Math.round(obj.left / gridSize) * gridSize,
      top: Math.round(obj.top / gridSize) * gridSize
    });
    obj.setCoords();
  }

  renderGuides(vLines, hLines, vpt) {
    if (this.cm.laserEngine?.isActive) return;

    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = '#ec4899'; // Vibrant Figma-style neon pink
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.shadowColor = 'rgba(236, 72, 153, 0.4)';
    ctx.shadowBlur = 6;

    for (const line of vLines) {
      const p1 = util.transformPoint(new Point(line.x, line.y1), vpt);
      const p2 = util.transformPoint(new Point(line.x, line.y2), vpt);

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      this.drawCrossMarker(ctx, p1.x, p1.y);
      this.drawCrossMarker(ctx, p2.x, p2.y);

      if (line.label) {
        this.drawBadge(ctx, p1.x + 8, (p1.y + p2.y) / 2, line.label);
      }
    }

    for (const line of hLines) {
      const p1 = util.transformPoint(new Point(line.x1, line.y), vpt);
      const p2 = util.transformPoint(new Point(line.x2, line.y), vpt);

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      this.drawCrossMarker(ctx, p1.x, p1.y);
      this.drawCrossMarker(ctx, p2.x, p2.y);

      if (line.label) {
        this.drawBadge(ctx, (p1.x + p2.x) / 2, p1.y - 12, line.label);
      }
    }

    ctx.restore();
  }

  drawCrossMarker(ctx, x, y) {
    ctx.save();
    ctx.setLineDash([]);
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 1.5;
    const r = 4;
    ctx.beginPath();
    ctx.moveTo(x - r, y);
    ctx.lineTo(x + r, y);
    ctx.moveTo(x, y - r);
    ctx.lineTo(x, y + r);
    ctx.stroke();
    ctx.restore();
  }

  drawBadge(ctx, x, y, text) {
    ctx.save();
    ctx.setLineDash([]);
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    const textMetrics = ctx.measureText(text);
    const padX = 6;
    const padY = 3;
    const w = textMetrics.width + padX * 2;
    const h = 18;

    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x - padX, y - h / 2, w, h, 4);
    } else {
      ctx.rect(x - padX, y - h / 2, w, h);
    }
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  clearGuides() {
    if (this.cm.laserEngine?.isActive) return;
    this.ctx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
  }
}
