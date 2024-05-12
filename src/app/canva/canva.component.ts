import { AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import CanvasController from '../lib/canvas';

@Component({
  selector: 'app-canva',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './canva.component.html',
  styleUrl: './canva.component.css'
})
export class CanvaComponent implements AfterViewInit {
  
  @Input() canvasController!: CanvasController;


  @ViewChild('gridCanvas') gridCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('interactiveCanvas') interactiveCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('staticCanvas') staticCanvas!: ElementRef<HTMLCanvasElement>;

  private gridContext?: CanvasRenderingContext2D;
  private interactiveContext?: CanvasRenderingContext2D;
  private staticContext?: CanvasRenderingContext2D;

  ngAfterViewInit(): void {
    window.addEventListener('mousemove', (e) => {
      this.canvasController.updateCanva();
      this.canvasController.mouseX = e.clientX;
      this.canvasController.mouseY = e.clientY;
    }, false);
  }

  handleClick(e: MouseEvent): void {

    this.canvasController.handleClick(e.clientX, e.clientY);
    this.canvasController.updateCanva();
    this.canvasController.updateCanvaLastPoint();
    this.canvasController.updateCanvaWalls();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'z' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault(); // Prevent the default action
      this.handleCtrlZ();
    } else if (event.key === 'Shift') {
      event.preventDefault(); // Prevent the default action
      this.handleShiftPress();
    }
  } 

  @HostListener('window:keyup', ['$event'])
  handleKeyboardKeyUpEvent(event: KeyboardEvent) {
    if (event.key === 'Shift') {
      event.preventDefault(); // Prevent the default action
      this.handleShiftUnpress();
    }
  }

  handleCtrlZ() {
    this.canvasController.undo();
  }

  handleShiftPress() {
    this.canvasController.setShift(true);
  }

  handleShiftUnpress() {
    this.canvasController.setShift(false);
  }
}
