import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-canva',
  template: '<canvas #canvas width="400" height="400" (click)="handleClick($event)"></canvas>',
  styleUrls: ['./canva.component.css']
})
export class CanvaComponent implements AfterViewInit {
  
  @ViewChild('canvas', { static: false })
  canvas!: ElementRef<HTMLCanvasElement>;
  
  public context!: CanvasRenderingContext2D;

  ngAfterViewInit(): void {
    if (this.canvas !== undefined) {
      this.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
      this.context.fillStyle = 'blue';
      this.context.fillRect(50, 50, 100, 100);
    }
  }

  handleClick(e: MouseEvent): void {
    const x = e.clientX - this.canvas.nativeElement.getBoundingClientRect().left;
    const y = e.clientY - this.canvas.nativeElement.getBoundingClientRect().top;

    // Now, you can use x and y to perform actions based on the click position
    console.log(x, y);

    // For testing, draw a square at the click position
    this.context.fillStyle = 'red';
    this.context.fillRect(x, y, 50, 50);
  }
}
