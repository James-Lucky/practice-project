import { createIcons, icons } from 'lucide';

export class UIController {
  constructor(canvasManager) {
    this.cm = canvasManager;

    this.strokePalette = [
      '#ffffff', '#94a3b8', '#1e293b',
      '#6366f1', '#06b6d4', '#10b981',
      '#f59e0b', '#ef4444', '#a855f7',
      '#ec4899', '#3b82f6', '#14b8a6'
    ];

    this.fillPalette = [
      'transparent', '#ffffff', '#1e293b',
      'rgba(99, 102, 241, 0.2)', 'rgba(6, 182, 212, 0.2)', 'rgba(16, 185, 129, 0.2)',
      'rgba(245, 158, 11, 0.2)', 'rgba(239, 68, 68, 0.2)', 'rgba(168, 85, 247, 0.2)',
      '#6366f1', '#10b981', '#ef4444'
    ];

    this.initIcons();
    this.initToolbar();
    this.initContextPanel();
    this.initHeader();
    this.initBottomBar();
    this.initShortcutsModal();
    this.initCallbacks();
  }

  initIcons() {
    createIcons({ icons });
  }

  initToolbar() {
    const dock = document.getElementById('floating-dock');
    const buttons = dock.querySelectorAll('.tool-btn');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.cm.setTool(btn.dataset.tool);
      });
    });

    window.addEventListener('keydown', (e) => {
      if (
        document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA' ||
        this.cm.canvas.getActiveObject()?.isEditing
      ) {
        return;
      }

      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toLowerCase();
      const map = {
        v: 'select',
        h: 'hand',
        r: 'rectangle',
        o: 'circle',
        c: 'circle',
        a: 'arrow',
        l: 'line',
        p: 'pen',
        t: 'text',
        e: 'eraser',
        k: 'laser'
      };

      if (map[key]) {
        e.preventDefault();
        this.cm.setTool(map[key]);
      }
    });
  }

  initContextPanel() {
    const strokePaletteEl = document.getElementById('stroke-palette');
    const fillPaletteEl = document.getElementById('fill-palette');
    const customStrokeInput = document.getElementById('custom-stroke-color');
    const customFillInput = document.getElementById('custom-fill-color');
    const opacitySlider = document.getElementById('opacity-slider');
    const opacityValEl = document.getElementById('opacity-val');

    // Stroke swatches
    strokePaletteEl.innerHTML = '';
    this.strokePalette.forEach((hex) => {
      const sw = document.createElement('button');
      const isActive = hex.toLowerCase() === this.cm.currentStyle.stroke.toLowerCase();
      sw.className = `w-7 h-7 rounded-md border-2 cursor-pointer transition hover:scale-110 shadow-inner ${
        isActive ? 'border-white scale-105 shadow-indigo-500/50' : 'border-transparent'
      }`;
      sw.style.backgroundColor = hex;
      sw.title = hex;
      sw.addEventListener('click', () => this.setStrokeColor(hex));
      strokePaletteEl.appendChild(sw);
    });

    // Fill swatches
    fillPaletteEl.innerHTML = '';
    this.fillPalette.forEach((color) => {
      const sw = document.createElement('button');
      const isTrans = color === 'transparent';
      const isActive = color.toLowerCase() === this.cm.currentStyle.fill.toLowerCase();
      sw.className = `w-7 h-7 rounded-md border-2 cursor-pointer transition hover:scale-110 shadow-inner ${
        isTrans ? 'transparent-swatch' : ''
      } ${isActive ? 'border-white scale-105 shadow-indigo-500/50' : 'border-transparent'}`;
      if (!isTrans) sw.style.backgroundColor = color;
      sw.title = isTrans ? 'Transparent / None' : color;
      sw.addEventListener('click', () => this.setFillColor(color));
      fillPaletteEl.appendChild(sw);
    });

    customStrokeInput.addEventListener('input', (e) => this.setStrokeColor(e.target.value));
    customFillInput.addEventListener('input', (e) => this.setFillColor(e.target.value));

    // Stroke width buttons
    const strokeWidthControl = document.getElementById('stroke-width-control');
    strokeWidthControl.querySelectorAll('.seg-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        strokeWidthControl.querySelectorAll('.seg-btn').forEach((b) => {
          b.classList.remove('bg-zinc-700', 'text-white', 'shadow-sm');
          b.classList.add('text-zinc-400');
        });
        btn.classList.add('bg-zinc-700', 'text-white', 'shadow-sm');
        btn.classList.remove('text-zinc-400');
        this.cm.setStyle('strokeWidth', parseInt(btn.dataset.width, 10));
      });
    });

    // Stroke style buttons
    const strokeStyleControl = document.getElementById('stroke-style-control');
    strokeStyleControl.querySelectorAll('.seg-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        strokeStyleControl.querySelectorAll('.seg-btn').forEach((b) => {
          b.classList.remove('bg-zinc-700', 'text-white', 'shadow-sm');
          b.classList.add('text-zinc-400');
        });
        btn.classList.add('bg-zinc-700', 'text-white', 'shadow-sm');
        btn.classList.remove('text-zinc-400');
        this.cm.setStyle('strokeStyle', btn.dataset.style);
      });
    });

    // Laser color swatches
    const laserColorsRow = document.getElementById('laser-colors');
    laserColorsRow.querySelectorAll('.laser-color-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        laserColorsRow.querySelectorAll('.laser-color-btn').forEach((b) => b.classList.remove('ring-2', 'ring-white', 'scale-110'));
        btn.classList.add('ring-2', 'ring-white', 'scale-110');
        const col = btn.dataset.laser;
        this.cm.currentStyle.laserColor = col;
        this.cm.laserEngine.setLaserColor(col);
      });
    });

    // Opacity
    opacitySlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      opacityValEl.textContent = `${val}%`;
      this.cm.setStyle('opacity', val / 100);
    });

    // Corner radius
    const cornerRadiusControl = document.getElementById('corner-radius-control');
    cornerRadiusControl.querySelectorAll('.seg-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        cornerRadiusControl.querySelectorAll('.seg-btn').forEach((b) => {
          b.classList.remove('bg-zinc-700', 'text-white');
          b.classList.add('text-zinc-400');
        });
        btn.classList.add('bg-zinc-700', 'text-white');
        btn.classList.remove('text-zinc-400');
        this.cm.setStyle('cornerRadius', parseInt(btn.dataset.radius, 10));
      });
    });

    // Text size
    const textSizeControl = document.getElementById('text-size-control');
    textSizeControl.querySelectorAll('.seg-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        textSizeControl.querySelectorAll('.seg-btn').forEach((b) => {
          b.classList.remove('bg-zinc-700', 'text-white');
          b.classList.add('text-zinc-400');
        });
        btn.classList.add('bg-zinc-700', 'text-white');
        btn.classList.remove('text-zinc-400');
        this.cm.setStyle('fontSize', parseInt(btn.dataset.size, 10));
      });
    });

    document.getElementById('btn-duplicate').addEventListener('click', () => this.cm.duplicateSelected());
    document.getElementById('btn-delete').addEventListener('click', () => this.cm.deleteSelected());
    document.getElementById('btn-bring-forward').addEventListener('click', () => this.cm.bringForward());
    document.getElementById('btn-send-backward').addEventListener('click', () => this.cm.sendBackward());

    document.getElementById('btn-close-panel').addEventListener('click', () => {
      document.getElementById('context-panel').classList.toggle('hidden');
    });
  }

  setStrokeColor(hex) {
    this.cm.setStyle('stroke', hex);
    document.getElementById('stroke-hex-val').textContent = hex;
    document.querySelectorAll('#stroke-palette button').forEach((sw) => {
      const match = sw.title.toLowerCase() === hex.toLowerCase();
      sw.classList.toggle('border-white', match);
      sw.classList.toggle('scale-105', match);
      sw.classList.toggle('border-transparent', !match);
    });
  }

  setFillColor(color) {
    this.cm.setStyle('fill', color);
    document.getElementById('fill-hex-val').textContent = color === 'transparent' ? 'Transparent' : color;
    document.querySelectorAll('#fill-palette button').forEach((sw) => {
      const match = sw.title.toLowerCase() === color.toLowerCase();
      sw.classList.toggle('border-white', match);
      sw.classList.toggle('scale-105', match);
      sw.classList.toggle('border-transparent', !match);
    });
  }

  initHeader() {
    const btnUndo = document.getElementById('btn-undo');
    const btnRedo = document.getElementById('btn-redo');

    btnUndo.addEventListener('click', () => this.cm.history.undo());
    btnRedo.addEventListener('click', () => this.cm.history.redo());

    // Smart guides
    const btnGuides = document.getElementById('btn-toggle-guides');
    btnGuides.addEventListener('click', () => {
      const active = !btnGuides.classList.contains('active');
      btnGuides.classList.toggle('active', active);
      if (active) {
        btnGuides.className = 'badge-btn active flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg font-medium text-indigo-400 bg-indigo-500/15 border border-indigo-500/30 transition hover:bg-indigo-500/20';
      } else {
        btnGuides.className = 'badge-btn flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg font-medium text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent transition';
      }
      this.cm.snapping.setGuidesEnabled(active);
      this.cm.showToast(active ? 'Smart Guides on' : 'Smart Guides off', 'info');
    });

    // Grid snap
    const btnGridSnap = document.getElementById('btn-toggle-grid-snap');
    btnGridSnap.addEventListener('click', () => {
      const active = !btnGridSnap.classList.contains('active');
      btnGridSnap.classList.toggle('active', active);
      if (active) {
        btnGridSnap.className = 'badge-btn active flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg font-medium text-indigo-400 bg-indigo-500/15 border border-indigo-500/30 transition hover:bg-indigo-500/20';
      } else {
        btnGridSnap.className = 'badge-btn flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg font-medium text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent transition';
      }
      this.cm.snapping.setGridSnapEnabled(active);
      this.cm.showToast(active ? 'Grid Snap on' : 'Grid Snap off', 'info');
    });

    // Background pattern cycle
    const btnCycleBg = document.getElementById('btn-cycle-background');
    const bgLabel = document.getElementById('bg-pattern-label');
    btnCycleBg.addEventListener('click', () => {
      const next = this.cm.cycleBackgroundPattern();
      const labels = { dots: 'Dots', grid: 'Grid', none: 'Blank' };
      bgLabel.textContent = labels[next] || next;
      if (next !== 'none') {
        btnCycleBg.className = 'badge-btn active flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg font-medium text-indigo-400 bg-indigo-500/15 border border-indigo-500/30 transition hover:bg-indigo-500/20';
      } else {
        btnCycleBg.className = 'badge-btn flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg font-medium text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent transition';
      }
    });

    // Theme toggle
    const btnTheme = document.getElementById('btn-theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    btnTheme.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      themeIcon.setAttribute('data-lucide', next === 'dark' ? 'moon' : 'sun');
      this.initIcons();
      this.cm.showToast(`${next === 'dark' ? 'Dark' : 'Light'} mode`, 'info');
    });

    // Clear
    document.getElementById('btn-clear-canvas').addEventListener('click', () => {
      if (this.cm.canvas.getObjects().length === 0) return;
      if (confirm('Clear canvas?')) {
        this.cm.clearCanvas();
      }
    });

    // File Open
    const btnImport = document.getElementById('btn-import-json');
    const fileInput = document.getElementById('file-input-json');
    btnImport.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        this.cm.exportMgr.importJSONFile(e.target.files[0]);
        fileInput.value = '';
      }
    });

    // Export dropdown
    const btnExportDropdown = document.getElementById('btn-export-dropdown');
    const exportMenu = document.getElementById('export-menu');

    btnExportDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      exportMenu.classList.toggle('hidden');
    });

    window.addEventListener('click', () => exportMenu.classList.add('hidden'));
    exportMenu.addEventListener('click', (e) => e.stopPropagation());

    document.getElementById('export-png-btn').addEventListener('click', () => {
      exportMenu.classList.add('hidden');
      this.cm.exportMgr.exportPNG({ transparent: false, multiplier: 2 });
    });

    document.getElementById('export-png-trans-btn').addEventListener('click', () => {
      exportMenu.classList.add('hidden');
      this.cm.exportMgr.exportPNG({ transparent: true, multiplier: 2 });
    });

    document.getElementById('copy-clipboard-btn').addEventListener('click', () => {
      exportMenu.classList.add('hidden');
      this.cm.exportMgr.copyPNGToClipboard();
    });

    document.getElementById('export-json-btn').addEventListener('click', () => {
      exportMenu.classList.add('hidden');
      this.cm.exportMgr.exportJSON();
    });

    document.getElementById('export-svg-btn').addEventListener('click', () => {
      exportMenu.classList.add('hidden');
      this.cm.exportMgr.exportSVG();
    });
  }

  initBottomBar() {
    document.getElementById('btn-zoom-out').addEventListener('click', () => this.cm.panZoom.zoomOut());
    document.getElementById('btn-zoom-in').addEventListener('click', () => this.cm.panZoom.zoomIn());
    document.getElementById('btn-zoom-reset').addEventListener('click', () => this.cm.panZoom.resetZoom());
    document.getElementById('btn-zoom-fit').addEventListener('click', () => this.cm.panZoom.fitToContent());

    const zoomText = document.getElementById('zoom-percentage');
    this.cm.panZoom.onZoomChange = (zoom) => {
      zoomText.textContent = `${Math.round(zoom * 100)}%`;
    };
  }

  initShortcutsModal() {
    const modal = document.getElementById('shortcuts-modal');
    const btnOpen = document.getElementById('btn-shortcuts');
    const btnClose = document.getElementById('btn-close-shortcuts');

    btnOpen.addEventListener('click', () => modal.classList.remove('hidden'));
    btnClose.addEventListener('click', () => modal.classList.add('hidden'));

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        modal.classList.toggle('hidden');
      }
      if (e.key === 'Escape') {
        modal.classList.add('hidden');
        document.getElementById('export-menu').classList.add('hidden');
      }
    });
  }

  initCallbacks() {
    const dock = document.getElementById('floating-dock');
    const panelTitle = document.getElementById('panel-title');
    const laserSection = document.getElementById('prop-section-laser');
    const fillSection = document.getElementById('prop-section-fill');
    const cornersSection = document.getElementById('prop-section-corners');
    const textSection = document.getElementById('prop-section-text');

    this.cm.onToolChange = (tool) => {
      dock.querySelectorAll('.tool-btn').forEach((btn) => {
        const isCurrent = btn.dataset.tool === tool;
        if (isCurrent) {
          if (tool === 'laser') {
            btn.className = 'tool-btn relative w-9 h-9 rounded-full flex items-center justify-center text-white bg-gradient-to-tr from-red-500 to-amber-500 shadow-md shadow-red-500/50 transition';
          } else {
            btn.className = 'tool-btn relative w-9 h-9 rounded-full flex items-center justify-center text-white bg-indigo-600 shadow-md shadow-indigo-600/40 transition';
          }
        } else {
          btn.className = 'tool-btn relative w-9 h-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition';
        }
      });

      panelTitle.textContent = `${tool.toUpperCase()} PROPERTIES`;
      laserSection.style.display = tool === 'laser' ? 'flex' : 'none';
      fillSection.style.display = ['rectangle', 'circle'].includes(tool) ? 'flex' : 'none';
      cornersSection.style.display = tool === 'rectangle' ? 'flex' : 'none';
      textSection.style.display = tool === 'text' ? 'flex' : 'none';
    };

    this.cm.onSelectionChange = (active) => {
      if (active) {
        panelTitle.textContent = `OBJECT (${active.type.toUpperCase()})`;
        fillSection.style.display = ['rect', 'ellipse', 'circle', 'polygon'].includes(active.type) ? 'flex' : 'none';
        cornersSection.style.display = active.type === 'rect' ? 'flex' : 'none';
        textSection.style.display = active.type === 'textbox' ? 'flex' : 'none';
        laserSection.style.display = 'none';

        if (active.stroke) {
          document.getElementById('stroke-hex-val').textContent = active.stroke;
        }
        if (active.fill && typeof active.fill === 'string') {
          document.getElementById('fill-hex-val').textContent = active.fill;
        }
      } else {
        panelTitle.textContent = `${this.cm.activeTool.toUpperCase()} PROPERTIES`;
      }
    };

    this.cm.history.onHistoryChange = ({ canUndo, canRedo }) => {
      document.getElementById('btn-undo').disabled = !canUndo;
      document.getElementById('btn-redo').disabled = !canRedo;
    };
  }
}
