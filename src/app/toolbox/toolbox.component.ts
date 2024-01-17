import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenRuler, faDoorClosed, faWindowRestore, faTrash } from '@fortawesome/free-solid-svg-icons';
import CanvasController, { Tools } from '../lib/canvas';

@Component({
  selector: 'app-toolbox',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './toolbox.component.html',
  styleUrl: './toolbox.component.css'
})
export class ToolboxComponent {

  @Input() canvasController!: CanvasController;

  faPenRuler = faPenRuler;
  faDoorClosed = faDoorClosed;
  faWindowRestore = faWindowRestore;
  faTrash = faTrash;

  public currentTool = Tools.Draw;

  public chooseDraw = () => {this.canvasController.setCurrentTool(Tools.Draw); this.currentTool = Tools.Draw}
  public chooseWindow = () => {this.canvasController.setCurrentTool(Tools.Window); this.currentTool = Tools.Window}
  public chooseDoor = () => {this.canvasController.setCurrentTool(Tools.Door); this.currentTool = Tools.Door}
  public chooseRemove = () => {this.canvasController.setCurrentTool(Tools.Remove); this.currentTool = Tools.Remove}
}
