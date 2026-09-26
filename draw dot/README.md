# DrawDot — Sleek Minimal Whiteboard

A high-performance, minimalist whiteboard and drawing tool built with **Vanilla JavaScript (ES Modules)**, **Fabric.js v7**, **`perfect-freehand`**, and a modern **CSS Glassmorphism Design System**.

Unlike tools that rely on hand-drawn wobbly lines (`rough.js`), **DrawDot** focuses on clean geometric precision, reminiscent of modern design platforms like Whimsical, Miro, and Figma.

---

## 🏗️ Architecture: The Three-Layer Stack

DrawDot decouples concerns across three stacked layers:

```
┌────────────────────────────────────────────────────────────────────────┐
│  Layer 3: Overlay Canvas (<canvas id="overlay-canvas">)                │
│  • Real-time fading laser pointer with RAF decay (~850ms)              │
│  • Figma-grade smart alignment guidelines & coordinate badges          │
│  • pointer-events: none (only captures events when Laser is active)    │
│  • 100% decoupled from Fabric's object tree and history stack          │
├────────────────────────────────────────────────────────────────────────┤
│  Layer 2: Content Canvas (<canvas id="fabric-canvas">)                 │
│  • Fabric.js v7 Core Vector Engine (Rect, Circle, Arrow, Text, Path)   │
│  • Converts perfect-freehand stroke outlines into SVG Path objects     │
│  • Authoritative serializable data model (JSON / PNG / SVG)            │
├────────────────────────────────────────────────────────────────────────┤
│  Layer 1: Background Layer (<div id="background-grid">)                │
│  • Hardware-accelerated CSS repeating pattern (Dots / Grid / Blank)    │
│  • Synchronized in 60/120fps with pan & zoom coordinates               │
│  • Zero JavaScript rendering or redraw cost                            │
└────────────────────────────────────────────────────────────────────────┘
```

### Why This Architecture Matters:
1. **Zero Data Model Pollution**: Temporary visual feedback like laser trails and alignment guidelines live solely in Layer 3. They never enter the undo/redo stack, never bloat the JSON representation, and never leak into exported PNGs.
2. **Maximum Performance**: The background grid is rendered via CSS gradients. Panning and zooming simply updates CSS `background-position` and `background-size`, keeping the GPU free for vector transformations.
3. **Robust State Serialization**: All permanent drawings reside strictly in Fabric's vector graph on Layer 2, making import, export, and undo/redo deterministic.

---

## ✨ Features

### 📐 Shapes & Drawing Tools
- **Rectangle**: Drag-to-size with live dimension previews; supports customizable corner radius (0px, 8px, 16px). Hold `Shift` to constrain to 1:1 square.
- **Circle / Ellipse**: Smooth geometry. Hold `Shift` to constrain to 1:1 perfect circle.
- **Straight Line**: Crisp line strokes with solid, dashed, or dotted patterns. Hold `Shift` to lock angles to 0°, 45°, 90°, etc.
- **Directional Arrow**: Interactive vector group composed of a line and an arrowhead with trigonometric rotation (`Math.atan2`).
- **Freehand Pen**: Powered by `perfect-freehand` (`getStroke`), capturing pointer pressure and coordinates to generate organic, tapered vector paths converted to `fabric.Path`.
- **Typography Text**: Editable `fabric.Textbox` using *Plus Jakarta Sans*, inline editing, font size options, and auto-focus.
- **Eraser Tool**: Hit-tests canvas objects to delete strokes and shapes on click or drag.

### 🧲 Smart Snapping (Figma-Style Alignment)
- **Edge-to-Edge & Center Alignment**: As an object is moved, the snapping engine compares its bounding box (`left`, `center-x`, `right`, `top`, `center-y`, `bottom`) against every other object on the canvas.
- **Dynamic Magnetic Pull**: Automatically snaps coordinates when within a configurable threshold (~12px).
- **Overlay Guidelines**: Renders dashed neon-pink alignment lines with crosshairs and coordinate badges onto Layer 3.
- **Grid Snap Mode**: Optional toggleable grid snapping (20px intervals).

### 🔦 Real-Time Laser Pointer
- Built entirely on Layer 3 via a high-performance `requestAnimationFrame` render loop.
- Generates a glowing neon beam (outer blur pass + intense white core) with a timestamp-based decay (~850ms).
- Features a pulsing target reticle that follows the cursor during presentations.
- Automatically suspends its animation loop when idle to preserve CPU and battery life.

### 🎨 Styling & Inspector Panel
- **Stroke Colors**: Curated modern swatches (Charcoal, Slate, Indigo, Cyan, Emerald, Amber, Rose, Purple) plus native custom color picker.
- **Fill Colors**: Includes semi-transparent tints, solid colors, and a dedicated **Transparent / None** option.
- **Stroke Thickness**: Thin (2px), Medium (4px), Thick (8px), Extra (14px).
- **Stroke Style**: Solid, Dashed, or Dotted.
- **Opacity Slider**: Smooth opacity adjustment from 10% to 100%.
- **Z-Ordering**: Bring Forward (`]`), Send Backward (`[`), Duplicate (`Ctrl+D`), and Delete (`Delete`).

### 🔍 Infinite Pan & Zoom
- **Mouse Wheel Zoom**: Smooth scaling centered directly at cursor position (`canvas.zoomToPoint`).
- **Panning**: Hold `Spacebar + Drag`, middle-click drag, or use the dedicated Hand tool (`H`).
- **Canvas Zoom Controls**: Zoom In (`+`), Zoom Out (`-`), Click-to-Reset (`Ctrl+0`), and Fit to Content (`Shift+1`).

### 💾 Export & Import
- **High-Res PNG Export**: Calculates the union bounding box of all active objects + 40px padding. Temporarily normalizes the viewport transform so you always get a clean, cropped 2x retina image without viewport clipping.
- **Transparent PNG**: Exports canvas content with transparent background.
- **Copy to Clipboard**: One-click copy of cropped PNG to system clipboard via `navigator.clipboard.write()`.
- **JSON File (`.drawdot`)**: Full editable vector scene serialization with custom metadata.
- **Drag-and-Drop Import**: Drag any `.drawdot` or `.json` file directly onto the canvas to restore your drawing.
- **SVG Export**: High-fidelity vector export.
- **Auto-Save**: Automatic debounced persistence to `localStorage`.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `V` | Select / Move tool |
| `H` or `Space + Drag` | Hand / Pan tool |
| `R` | Rectangle tool |
| `O` or `C` | Circle / Ellipse tool |
| `A` | Arrow tool |
| `L` | Straight Line tool |
| `P` | Freehand Pen tool (`perfect-freehand`) |
| `T` | Text tool |
| `E` | Eraser tool |
| `K` | Laser Pointer tool |
| `Ctrl + Z` | Undo |
| `Ctrl + Y` / `Ctrl + Shift + Z` | Redo |
| `Delete` / `Backspace` | Delete selected objects |
| `Ctrl + D` | Duplicate selection |
| `Ctrl + A` | Select all objects |
| `+` / `-` | Zoom In / Out |
| `Ctrl + 0` | Reset Zoom to 100% |
| `Shift + 1` | Fit content to viewport |
| `]` | Bring object forward |
| `[` | Send object backward |
| `?` | Open keyboard shortcuts dialog |
| `Escape` | Deselect / Close dialogs |

---

## 🛠️ Tech Stack & Dependencies

- **Runtime**: Vanilla JavaScript (ES Modules)
- **Canvas Framework**: [Fabric.js v7](https://fabricjs.com/) (modern TypeScript rewrite)
- **Pen Stroke Engine**: [`perfect-freehand`](https://github.com/steveruizok/perfect-freehand) (pressure-aware tapered path calculation)
- **Icons**: [`lucide`](https://lucide.dev/) (clean modern SVG icons)
- **Bundler & Dev Server**: [Vite 8](https://vitejs.dev/)
- **Typography**: Google Fonts (*Plus Jakarta Sans* & *JetBrains Mono*)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation
```bash
# Clone or navigate to the repository
cd "draw dot"

# Install dependencies
npm install
```

### Development
Start the local development server:
```bash
npm run dev
```
Open your browser at `http://127.0.0.1:5173/`.

### Production Build
Compile optimized production assets:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## 📂 Project Directory Structure

```
draw-dot/
├── index.html                   # HTML entry point with 3-layer architecture
├── package.json                 # Project configuration and dependencies
├── README.md                    # Comprehensive documentation
├── src/
│   ├── main.js                  # App initialization, demo scene, auto-save
│   ├── style.css                # Design system, glassmorphism, theme tokens
│   ├── canvas/
│   │   ├── canvas-manager.js    # Fabric canvas coordinator & layer synchronization
│   │   └── pan-zoom.js          # Wheel zoom, spacebar pan, viewport controls
│   ├── tools/
│   │   ├── shape-tool.js        # Rectangles, circles, lines, and grouped arrows
│   │   ├── pen-tool.js          # perfect-freehand stroke to Fabric.Path integration
│   │   ├── text-tool.js         # Typography text tool with inline editing
│   │   └── eraser-tool.js       # Hit-testing eraser brush
│   ├── snapping/
│   │   └── snapping-engine.js   # Figma smart guides, edge hit-testing, overlay lines
│   ├── laser/
│   │   └── laser-engine.js      # Overlay RAF loop, timestamp-decaying laser trail
│   ├── history/
│   │   └── history-manager.js   # Snapshot-based undo/redo stack & shortcuts
│   ├── export/
│   │   └── export-manager.js    # Bounding-box cropped PNG, SVG, JSON, and clipboard
│   └── ui/
│       └── ui-controller.js     # Toolbar dock, context panel, theme switcher, modals
```

---

## 📄 License
MIT License. Free for personal and commercial use.
