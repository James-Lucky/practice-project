// Laser Pointer Engine — Renders real-time fading laser strokes on the top overlay canvas
// Never enters Fabric's object tree or history stack

export class LaserEngine {
  constructor(overlayCanvas) {
    this.canvas = overlayCanvas;
    this.ctx = overlayCanvas.getContext('2d');

    this.isActive = false;
    this.isDrawing = false;
    this.laserColor = '#ef4444'; // default crimson red
    this.maxAgeMs = 850; // Fade lifetime
    this.baseWidth = 10; // Head width

    // Laser strokes array: array of strokes, each stroke is array of { x, y, time }
    this.strokes = [];
    this.currentStroke = null;

    // Hover cursor dot position
    this.cursorPos = null;

    this.animationFrameId = null;
    this.isLoopRunning = false;

    this.initEvents();
  }

  setLaserColor(color) {
    this.laserColor = color;
  }

  setActive(active) {
    this.isActive = active;
    if (active) {
      this.canvas.classList.add('interactive');
      this.startLoop();
    } else {
      this.canvas.classList.remove('interactive');
      this.isDrawing = false;
      this.currentStroke = null;
      this.cursorPos = null;
      // Let existing strokes fade out, then loop stops automatically
    }
  }

  initEvents() {
    const el = this.canvas;

    el.addEventListener('pointerdown', (e) => {
      if (!this.isActive) return;
      this.isDrawing = true;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      this.currentStroke = [{ x, y, time: performance.now() }];
      this.strokes.push(this.currentStroke);
      this.cursorPos = { x, y };
      this.startLoop();
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isActive) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      this.cursorPos = { x, y };

      if (this.isDrawing && this.currentStroke) {
        this.currentStroke.push({ x, y, time: performance.now() });
      }

      this.startLoop();
    });

    window.addEventListener('pointerup', () => {
      if (this.isDrawing) {
        this.isDrawing = false;
        this.currentStroke = null;
      }
    });

    el.addEventListener('pointerleave', () => {
      if (!this.isDrawing) {
        this.cursorPos = null;
      }
    });
  }

  startLoop() {
    if (!this.isLoopRunning) {
      this.isLoopRunning = true;
      this.render();
    }
  }

  render() {
    const now = performance.now();
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Clean overlay canvas
    ctx.clearRect(0, 0, width, height);

    let hasActiveStrokes = false;

    // Process and draw each stroke
    for (let sIdx = this.strokes.length - 1; sIdx >= 0; sIdx--) {
      const stroke = this.strokes[sIdx];
      // Filter out points older than maxAgeMs
      while (stroke.length > 0 && now - stroke[0].time > this.maxAgeMs) {
        stroke.shift();
      }

      if (stroke.length === 0) {
        this.strokes.splice(sIdx, 1);
        continue;
      }

      hasActiveStrokes = true;
      this.drawLaserStroke(stroke, now);
    }

    // Draw hovering laser cursor target if active
    if (this.isActive && this.cursorPos) {
      this.drawLaserCursor(this.cursorPos.x, this.cursorPos.y);
    }

    // Continue render loop if strokes exist, laser is active, or drawing
    if (hasActiveStrokes || this.isActive || this.isDrawing) {
      this.animationFrameId = requestAnimationFrame(() => this.render());
    } else {
      this.isLoopRunning = false;
      this.animationFrameId = null;
    }
  }

  drawLaserStroke(points, now) {
    if (points.length < 2) return;

    const ctx = this.ctx;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw glowing segments
    for (let i = 1; i < points.length; i++) {
      const p1 = points[i - 1];
      const p2 = points[i];

      const age = now - p2.time;
      const progress = Math.max(0, 1 - age / this.maxAgeMs); // 1 = fresh, 0 = faded

      // Tapered stroke width: from baseWidth down to 1px
      const strokeWidth = Math.max(1.5, this.baseWidth * progress);

      // Outer Glow pass
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = this.laserColor;
      ctx.lineWidth = strokeWidth * 2;
      ctx.globalAlpha = progress * 0.4;
      ctx.shadowColor = this.laserColor;
      ctx.shadowBlur = 14 * progress;
      ctx.stroke();

      // Bright Core pass
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = Math.max(1, strokeWidth * 0.6);
      ctx.globalAlpha = progress * 0.9;
      ctx.shadowBlur = 0;
      ctx.stroke();
    }

    // Draw glowing head dot on the newest point
    const head = points[points.length - 1];
    const headAge = now - head.time;
    if (headAge < 100) {
      ctx.beginPath();
      ctx.arc(head.x, head.y, this.baseWidth * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = this.laserColor;
      ctx.shadowBlur = 18;
      ctx.globalAlpha = 1;
      ctx.fill();
    }

    ctx.restore();
  }

  drawLaserCursor(x, y) {
    const ctx = this.ctx;
    ctx.save();

    // Outer pulsing ring
    const pulse = (Math.sin(performance.now() / 150) + 1) / 2; // 0 to 1
    const radius = 6 + pulse * 2.5;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = this.laserColor;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.85;
    ctx.shadowColor = this.laserColor;
    ctx.shadowBlur = 10;
    ctx.stroke();

    // Center core dot
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 4;
    ctx.fill();

    ctx.restore();
  }

  // Clear overlay (e.g. on window resize)
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.strokes = [];
    this.currentStroke = null;
  }
}
