// Text Tool — Inserts and edits modern typography Textboxes
import { Textbox } from 'fabric';

export class TextTool {
  constructor(canvasManager) {
    this.cm = canvasManager;
    this.canvas = canvasManager.canvas;
  }

  handleMouseDown(e) {
    const pt = this.canvas.getScenePoint(e.e);
    const style = this.cm.currentStyle;

    const textbox = new Textbox('Type here', {
      left: pt.x,
      top: pt.y,
      fontFamily: 'Plus Jakarta Sans',
      fontSize: style.fontSize || 24,
      fill: style.stroke,
      opacity: style.opacity,
      width: 180,
      cornerStyle: 'circle',
      cornerColor: '#ffffff',
      cornerStrokeColor: '#6366f1',
      borderColor: '#6366f1',
      transparentCorners: false,
      padding: 6
    });

    this.canvas.add(textbox);
    this.canvas.setActiveObject(textbox);
    textbox.enterEditing();
    textbox.selectAll();
    this.canvas.requestRenderAll();

    // Clean up if user leaves it empty
    textbox.on('editing:exited', () => {
      if (!textbox.text || textbox.text.trim() === '') {
        this.canvas.remove(textbox);
        this.canvas.requestRenderAll();
      }
    });

    // Reset tool to select
    this.cm.setTool('select');
  }
}
