import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tools } from '../lib/canvas';

@Injectable()
export class TipsService {
  private tipTextSource = "Initial tip text";

  updateTipText(newText: string) {
    this.tipTextSource = newText;
  }

  getTip() {
    return this.tipTextSource;
  }

  updateTipTextForTool(tool: Tools) {
    switch(tool) {
      case Tools.Draw:
        this.updateTipText("Click on the canvas to add points and draw walls.");
        break;
      case Tools.Door:
        this.updateTipText("Click on a wall to add a door. You cannot add a door on a window or add two doors on the same place.");
        break;
      case Tools.Window:
        this.updateTipText("Click on a wall to add a window. You cannot add a window on a door or add two windows on the same place.");
        break;
      case Tools.Square:
        this.updateTipText("Draw a square by clicking and dragging.");
        break;
      case Tools.Remove:
        this.updateTipText("Remove an element by clicking on it");
        break;
      default:
        this.updateTipText("No tool selected");
    }
  }
}
