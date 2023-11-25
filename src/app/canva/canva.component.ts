import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
  
  @ViewChild('canvas', { static: false })
  canvas!: ElementRef<HTMLCanvasElement>;
  
  public context!: CanvasRenderingContext2D;
  private canvasController!: CanvasController;

  ngAfterViewInit(): void {
    if (this.canvas !== undefined) {
      this.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
      this.canvas.nativeElement.width = window.innerWidth;
      this.canvas.nativeElement.height = window.innerHeight;

      this.canvasController = new CanvasController(this.context, window.innerWidth, window.innerHeight);
    }

    window.addEventListener('mousemove', (e) => {
      this.canvasController.updateCanva();
      this.canvasController.drawGhostelement(e.clientX, e.clientY);
    }, false)
  }

  handleClick(e: MouseEvent): void {
    this.canvasController.updateCanva();
    this.canvasController.handleClick(e.clientX, e.clientY);
  }
}
