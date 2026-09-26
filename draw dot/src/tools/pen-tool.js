// Freehand Pen Tool using perfect-freehand
// Generates beautiful pressure-sensitive, tapered vector paths converted to Fabric.Path

import { getStroke } from 'perfect-freehand';
import { Path } from 'fabric';

export class PenTool {
  constructor(canvasManager) {
    this.cm = canvasManager;
    this.canvas = canvasManager.canvas;

    this.isDrawing = false;
    this.points = [];
    this.previewPath = null;
  }

  handleMouseDown(e) {
    this.isDrawing = true;
    const pt = this.canvas.getScenePoint(e.e);
    const pressure = e.e.pressure !== undefined && e.e.pressure > 0 ? e.e.pressure : 0.5;

    this.points = [[pt.x, pt.y, pressure]];

    // Create temporary preview path
    this.updatePreview();
  }

  handleMouseMove(e) {
    if (!this.isDrawing) return;

    const pt = this.canvas.getScenePoint(e.e);
    const pressure = e.e.pressure !== undefined && e.e.pressure > 0 ? e.e.pressure : 0.5;

    this.points.push([pt.x, pt.y, pressure]);
    this.updatePreview();
  }

  handleMouseUp() {
    if (!this.isDrawing) return;
    this.isDrawing = false;

    // Remove preview path
    if (this.previewPath) {
      this.canvas.remove(this.previewPath);
      this.previewPath = null;
    }

    if (this.points.length < 2) {
      this.points = [];
      return;
    }

    // Generate final SVG path from points
    const svgPath = this.getSvgPath();
    if (!svgPath) return;

    const strokeColor = this.cm.currentStyle.stroke;
    const opacity = this.cm.currentStyle.opacity;

    const path = new Path(svgPath, {
      fill: strokeColor,
      stroke: null, // Outline is already a closed filled polygon from perfect-freehand
      opacity: opacity,
      selectable: true,
      hasControls: true,
      cornerStyle: 'circle',
      cornerColor: '#ffffff',
      cornerStrokeColor: '#6366f1',
      borderColor: '#6366f1',
      transparentCorners: false
    });

    this.canvas.add(path);
    this.canvas.requestRenderAll();
    this.points = [];
  }

  updatePreview() {
    const svgPath = this.getSvgPath();
    if (!svgPath) return;

    const strokeColor = this.cm.currentStyle.stroke;
    const opacity = this.cm.currentStyle.opacity;

    if (this.previewPath) {
      this.canvas.remove(this.previewPath);
    }

    this.previewPath = new Path(svgPath, {
      fill: strokeColor,
      stroke: null,
      opacity: opacity,
      selectable: false,
      evented: false,
      isTemporary: true
    });

    this.canvas.add(this.previewPath);
    this.canvas.requestRenderAll();
  }

  getSvgPath() {
    if (this.points.length === 0) return '';

    const strokeWidth = this.cm.currentStyle.strokeWidth || 4;

    const strokePoints = getStroke(this.points, {
      size: strokeWidth * 2,
      thinning: 0.45,
      smoothing: 0.55,
      streamline: 0.5,
      simulatePressure: true,
      start: { taper: true, cap: true },
      end: { taper: true, cap: true }
    });

    if (!strokePoints || strokePoints.length < 3) return '';

    // Convert outline points to SVG quadratic bezier path
    const d = strokePoints.reduce(
      (acc, [x0, y0], i, arr) => {
        const [x1, y1] = arr[(i + 1) % arr.length];
        acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
        return acc;
      },
      ['M', ...strokePoints[0], 'Q']
    );

    d.push('Z');
    return d.join(' ');
  }
}
