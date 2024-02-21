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

  @ViewChild('canvas', { static: false })
  canvas!: ElementRef<HTMLCanvasElement>;
  
  public context!: CanvasRenderingContext2D;

  ngAfterViewInit(): void {
    window.addEventListener('mousemove', (e) => {
      this.canvasController.updateCanva();
      this.canvasController.mouseX = e.clientX;
      this.canvasController.mouseY = e.clientY;
    }, false);
  }

  handleClick(e: MouseEvent): void {
    this.canvasController.updateCanva();
    this.canvasController.handleClick(e.clientX, e.clientY);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'z' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault(); // Prevent the default action
      this.handleCtrlZ();
    }
  }

  handleCtrlZ() {
    this.canvasController.undo();
  }
}
