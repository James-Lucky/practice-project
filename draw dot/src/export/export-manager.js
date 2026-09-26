// Export Manager — High-Res PNG (smart bounding box), SVG, JSON, and Clipboard Copy

export class ExportManager {
  constructor(canvasManager) {
    this.cm = canvasManager;
    this.canvas = canvasManager.canvas;
  }

  // Get union bounding box of all visible objects
  getContentBounds(padding = 40) {
    const objects = this.canvas.getObjects().filter((o) => !o.isTemporary && o.visible);
    if (objects.length === 0) return null;

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

    const width = maxX - minX;
    const height = maxY - minY;

    return {
      left: Math.max(0, minX - padding),
      top: Math.max(0, minY - padding),
      width: width + padding * 2,
      height: height + padding * 2
    };
  }

  exportPNG({ transparent = false, multiplier = 2 } = {}) {
    const bounds = this.getContentBounds();
    if (!bounds) {
      this.cm.showToast('Canvas is empty — nothing to export', 'warn');
      return;
    }

    // Save current viewport transform
    const savedVpt = [...this.canvas.viewportTransform];
    const prevBg = this.canvas.backgroundColor;

    // Temporarily reset zoom/pan to identity for accurate bounding box snapshot
    this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

    if (transparent) {
      this.canvas.backgroundColor = null;
    } else {
      // Use current theme background color
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      this.canvas.backgroundColor = isDark ? '#121317' : '#ffffff';
    }

    this.canvas.renderAll();

    const dataUrl = this.canvas.toDataURL({
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
      height: bounds.height,
      multiplier: multiplier,
      format: 'png'
    });

    // Restore viewport and background
    this.canvas.backgroundColor = prevBg;
    this.canvas.setViewportTransform(savedVpt);
    this.canvas.requestRenderAll();

    // Trigger download
    const docTitle = document.getElementById('doc-title-input')?.value || 'drawing';
    const filename = `${docTitle.trim().replace(/\s+/g, '_')}.png`;

    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    this.cm.showToast('PNG exported successfully!', 'success');
  }

  async copyPNGToClipboard() {
    const bounds = this.getContentBounds();
    if (!bounds) {
      this.cm.showToast('Canvas is empty — nothing to copy', 'warn');
      return;
    }

    const savedVpt = [...this.canvas.viewportTransform];
    const prevBg = this.canvas.backgroundColor;

    this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    this.canvas.backgroundColor = isDark ? '#121317' : '#ffffff';
    this.canvas.renderAll();

    const dataUrl = this.canvas.toDataURL({
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
      height: bounds.height,
      multiplier: 2,
      format: 'png'
    });

    this.canvas.backgroundColor = prevBg;
    this.canvas.setViewportTransform(savedVpt);
    this.canvas.requestRenderAll();

    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      this.cm.showToast('Image copied to clipboard!', 'success');
    } catch (err) {
      console.error('Clipboard copy error:', err);
      this.cm.showToast('Could not copy image to clipboard', 'warn');
    }
  }

  exportSVG() {
    const bounds = this.getContentBounds();
    if (!bounds) {
      this.cm.showToast('Canvas is empty — nothing to export', 'warn');
      return;
    }

    const svg = this.canvas.toSVG({
      viewBox: {
        x: bounds.left,
        y: bounds.top,
        width: bounds.width,
        height: bounds.height
      },
      width: bounds.width,
      height: bounds.height
    });

    const docTitle = document.getElementById('doc-title-input')?.value || 'drawing';
    const filename = `${docTitle.trim().replace(/\s+/g, '_')}.svg`;

    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.cm.showToast('SVG exported successfully!', 'success');
  }

  exportJSON() {
    const json = this.canvas.toJSON(['id', 'isArrow', 'customType', 'selectable']);
    const docTitle = document.getElementById('doc-title-input')?.value || 'drawing';

    const payload = {
      version: 1,
      name: docTitle,
      timestamp: Date.now(),
      viewport: this.canvas.viewportTransform,
      canvas: json
    };

    const str = JSON.stringify(payload, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${docTitle.trim().replace(/\s+/g, '_')}.drawdot`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.cm.showToast('.drawdot file saved!', 'success');
  }

  async importJSONFile(file) {
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      const canvasData = data.canvas || data;
      if (data.name) {
        const titleInput = document.getElementById('doc-title-input');
        if (titleInput) titleInput.value = data.name;
      }

      await this.canvas.loadFromJSON(canvasData);

      if (data.viewport) {
        this.canvas.setViewportTransform(data.viewport);
      } else {
        this.cm.panZoom.fitToContent();
      }

      this.canvas.requestRenderAll();
      this.cm.syncBackgroundGrid();
      this.cm.history.saveStateImmediate();
      this.cm.onCanvasContentChanged();

      this.cm.showToast(`Loaded ${file.name}`, 'success');
    } catch (err) {
      console.error('Failed to import file:', err);
      this.cm.showToast('Invalid drawing file format', 'warn');
    }
  }
}
