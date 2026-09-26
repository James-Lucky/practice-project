// DrawDot — Main Entry Point
import './style.css';
import { CanvasManager } from './canvas/canvas-manager.js';
import { UIController } from './ui/ui-controller.js';
import { Rect, Textbox, Line, Triangle, Group } from 'fabric';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Canvas and UI Controllers
  const canvasManager = new CanvasManager();
  const uiController = new UIController(canvasManager);

  // Setup initial demo scene if empty canvas
  setupInitialScene(canvasManager);

  // Expose to window for testing and easy inspection
  window.__drawDot = {
    canvasManager,
    uiController,
    reloadDemoScene: () => setupInitialScene(canvasManager, true)
  };
});

export function setupInitialScene(cm, force = false) {
  const canvas = cm.canvas;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  if (!force) {
    // Check if we have saved canvas in localStorage
    const savedScene = localStorage.getItem('drawdot_autosave');
    if (savedScene) {
      try {
        const data = JSON.parse(savedScene);
        canvas.loadFromJSON(data).then(() => {
          canvas.requestRenderAll();
          cm.syncBackgroundGrid();
          cm.onCanvasContentChanged();
        });
        return;
      } catch (err) {
        console.warn('Could not restore auto-saved scene:', err);
      }
    }
  }

  // Create an elegant welcome demo:
  // 1. Welcome Card (Rounded Rect)
  const rect = new Rect({
    left: 310,
    top: 130,
    width: 320,
    height: 180,
    fill: isDark ? 'rgba(30, 33, 43, 0.7)' : 'rgba(255, 255, 255, 0.9)',
    stroke: '#6366f1',
    strokeWidth: 2,
    rx: 12,
    ry: 12,
    shadow: {
      color: 'rgba(0, 0, 0, 0.25)',
      blur: 16,
      offsetX: 0,
      offsetY: 6
    }
  });

  // 2. Card Title & Description Text
  const title = new Textbox('Welcome to DrawDot', {
    left: 334,
    top: 154,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 20,
    fontWeight: 'bold',
    fill: isDark ? '#f3f4f6' : '#111827',
    width: 270
  });

  const body = new Textbox('• Drag shapes to trigger Smart Guides\n• Switch to Laser Pointer (K) to present\n• Freehand Pen (P) has organic stroke taper', {
    left: 334,
    top: 192,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    lineHeight: 1.4,
    fill: isDark ? '#9ca3af' : '#4b5563',
    width: 270
  });

  // 3. Sleek Arrow pointing to the toolbar
  const arrowLine = new Line([630, 220, 710, 220], {
    stroke: '#ec4899',
    strokeWidth: 3,
    strokeUniform: true
  });

  const arrowHead = new Triangle({
    left: 710,
    top: 220,
    originX: 'center',
    originY: 'center',
    angle: 90,
    width: 14,
    height: 16,
    fill: '#ec4899'
  });

  const arrowGroup = new Group([arrowLine, arrowHead], {
    isArrow: true
  });

  // 4. Feature Badge Box
  const badgeRect = new Rect({
    left: 730,
    top: 190,
    width: 160,
    height: 60,
    fill: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)',
    stroke: '#6366f1',
    strokeWidth: 1.5,
    strokeDashArray: [6, 4],
    rx: 8,
    ry: 8
  });

  const badgeText = new Textbox('Figma-grade\nSmart Guides', {
    left: 746,
    top: 202,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '600',
    fill: '#818cf8',
    width: 130
  });

  canvas.add(rect, title, body, arrowGroup, badgeRect, badgeText);
  canvas.requestRenderAll();
  cm.onCanvasContentChanged();

  // Setup auto-save listener
  let saveTimer = null;
  canvas.on('object:modified', () => scheduleAutoSave(canvas));
  canvas.on('object:added', () => scheduleAutoSave(canvas));
  canvas.on('object:removed', () => scheduleAutoSave(canvas));

  function scheduleAutoSave(c) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        const json = c.toJSON(['id', 'isArrow', 'customType', 'selectable']);
        localStorage.setItem('drawdot_autosave', JSON.stringify(json));
      } catch (e) {
        // ignore quota errors
      }
    }, 1000);
  }
}
