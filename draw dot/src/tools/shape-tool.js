// Shape Tool — Handles interactive creation of Rectangles, Circles, Lines, and Arrows
import { Rect, Ellipse, Line, Triangle, Group, Point } from 'fabric';

export class ShapeTool {
  constructor(canvasManager) {
    this.cm = canvasManager;
    this.canvas = canvasManager.canvas;

    this.isDrawing = false;
    this.startX = 0;
    this.startY = 0;
    this.activeShape = null;
  }

  handleMouseDown(e) {
    this.isDrawing = true;
    const pt = this.canvas.getScenePoint(e.e);
    this.startX = pt.x;
    this.startY = pt.y;

    const style = this.cm.currentStyle;
    const strokeDash = this.getDashArray(style.strokeStyle);

    switch (this.cm.activeTool) {
      case 'rectangle':
        this.activeShape = new Rect({
          left: this.startX,
          top: this.startY,
          width: 0,
          height: 0,
          fill: style.fill,
          stroke: style.stroke,
          strokeWidth: style.strokeWidth,
          strokeDashArray: strokeDash,
          strokeUniform: true,
          rx: style.cornerRadius || 0,
          ry: style.cornerRadius || 0,
          opacity: style.opacity,
          selectable: false,
          isTemporary: true
        });
        break;

      case 'circle':
        this.activeShape = new Ellipse({
          left: this.startX,
          top: this.startY,
          rx: 0,
          ry: 0,
          fill: style.fill,
          stroke: style.stroke,
          strokeWidth: style.strokeWidth,
          strokeDashArray: strokeDash,
          strokeUniform: true,
          opacity: style.opacity,
          selectable: false,
          isTemporary: true
        });
        break;

      case 'line':
        this.activeShape = new Line([this.startX, this.startY, this.startX, this.startY], {
          stroke: style.stroke,
          strokeWidth: style.strokeWidth,
          strokeDashArray: strokeDash,
          strokeUniform: true,
          opacity: style.opacity,
          selectable: false,
          isTemporary: true
        });
        break;

      case 'arrow':
        // For arrow, create a temporary Line during drag
        this.activeShape = new Line([this.startX, this.startY, this.startX, this.startY], {
          stroke: style.stroke,
          strokeWidth: style.strokeWidth,
          strokeDashArray: strokeDash,
          strokeUniform: true,
          opacity: style.opacity,
          selectable: false,
          isTemporary: true
        });
        break;
    }

    if (this.activeShape) {
      this.canvas.add(this.activeShape);
      this.canvas.requestRenderAll();
    }
  }

  handleMouseMove(e) {
    if (!this.isDrawing || !this.activeShape) return;

    const pt = this.canvas.getScenePoint(e.e);
    let currentX = pt.x;
    let currentY = pt.y;

    const shiftKey = e.e.shiftKey;

    switch (this.cm.activeTool) {
      case 'rectangle': {
        let width = currentX - this.startX;
        let height = currentY - this.startY;

        if (shiftKey) {
          // Lock to 1:1 square
          const maxDim = Math.max(Math.abs(width), Math.abs(height));
          width = width < 0 ? -maxDim : maxDim;
          height = height < 0 ? -maxDim : maxDim;
        }

        this.activeShape.set({
          left: width < 0 ? this.startX + width : this.startX,
          top: height < 0 ? this.startY + height : this.startY,
          width: Math.abs(width),
          height: Math.abs(height)
        });
        break;
      }

      case 'circle': {
        let rx = Math.abs(currentX - this.startX) / 2;
        let ry = Math.abs(currentY - this.startY) / 2;

        if (shiftKey) {
          // Lock to 1:1 circle
          const r = Math.max(rx, ry);
          rx = r;
          ry = r;
        }

        const left = Math.min(this.startX, currentX);
        const top = Math.min(this.startY, currentY);

        this.activeShape.set({
          left: left,
          top: top,
          rx: rx,
          ry: ry
        });
        break;
      }

      case 'line':
      case 'arrow': {
        if (shiftKey) {
          // Snap angle to 0, 45, 90, 135, 180... degrees
          const dx = currentX - this.startX;
          const dy = currentY - this.startY;
          const angle = Math.atan2(dy, dx);
          const snapAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
          const dist = Math.hypot(dx, dy);
          currentX = this.startX + Math.cos(snapAngle) * dist;
          currentY = this.startY + Math.sin(snapAngle) * dist;
        }

        this.activeShape.set({
          x2: currentX,
          y2: currentY
        });
        break;
      }
    }

    this.canvas.requestRenderAll();
  }

  handleMouseUp(e) {
    if (!this.isDrawing || !this.activeShape) return;
    this.isDrawing = false;

    const pt = this.canvas.getScenePoint(e.e);
    const endX = pt.x;
    const endY = pt.y;

    const dist = Math.hypot(endX - this.startX, endY - this.startY);

    // If click without drag, remove the 0-size shape
    if (dist < 3) {
      this.canvas.remove(this.activeShape);
      this.activeShape = null;
      this.canvas.requestRenderAll();
      return;
    }

    // If arrow tool, construct the permanent Arrow group
    if (this.cm.activeTool === 'arrow') {
      const lineX2 = this.activeShape.x2;
      const lineY2 = this.activeShape.y2;
      this.canvas.remove(this.activeShape);

      const arrowGroup = this.createArrowObject(this.startX, this.startY, lineX2, lineY2);
      this.canvas.add(arrowGroup);
      this.applySelectionStyles(arrowGroup);
      this.canvas.setActiveObject(arrowGroup);
    } else {
      // Finalize regular shape
      this.activeShape.set({
        selectable: true,
        isTemporary: false
      });
      this.applySelectionStyles(this.activeShape);
      this.canvas.setActiveObject(this.activeShape);
    }

    this.activeShape = null;
    this.canvas.requestRenderAll();

    // After drawing, automatically switch back to select tool for smooth flow
    this.cm.setTool('select');
  }

  createArrowObject(x1, y1, x2, y2) {
    const style = this.cm.currentStyle;
    const strokeDash = this.getDashArray(style.strokeStyle);

    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headLength = Math.max(14, style.strokeWidth * 3.5);
    const headWidth = Math.max(12, style.strokeWidth * 2.8);

    // Shorten line slightly so it ends neatly at the base of arrowhead
    const lineEndX = x2 - Math.cos(angle) * (headLength * 0.4);
    const lineEndY = y2 - Math.sin(angle) * (headLength * 0.4);

    const line = new Line([x1, y1, lineEndX, lineEndY], {
      stroke: style.stroke,
      strokeWidth: style.strokeWidth,
      strokeDashArray: strokeDash,
      strokeUniform: true
    });

    const triangle = new Triangle({
      left: x2,
      top: y2,
      originX: 'center',
      originY: 'center',
      pointType: 'arrow_head',
      angle: (angle * 180) / Math.PI + 90,
      width: headWidth,
      height: headLength,
      fill: style.stroke,
      stroke: style.stroke,
      strokeWidth: 1
    });

    const group = new Group([line, triangle], {
      opacity: style.opacity,
      isArrow: true,
      strokeUniform: true
    });

    return group;
  }

  getDashArray(style) {
    if (style === 'dashed') return [8, 6];
    if (style === 'dotted') return [3, 5];
    return null;
  }

  applySelectionStyles(obj) {
    obj.set({
      cornerStyle: 'circle',
      cornerColor: '#ffffff',
      cornerStrokeColor: '#6366f1',
      borderColor: '#6366f1',
      cornerSize: 8,
      borderScaleFactor: 1.5,
      transparentCorners: false
    });
  }
}
