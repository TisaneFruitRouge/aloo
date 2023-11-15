import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  ngAfterViewInit(): void {
    if (this.canvas !== undefined) {
      this.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
      // this.context.fillStyle = "green";
      // this.context.fillRect(100, 100, 100, 100);
    }
  }

  handleClick(e: MouseEvent): void {
    
    const x = e.clientX - this.canvas.nativeElement.getBoundingClientRect().left;
    const y = e.clientY - this.canvas.nativeElement.getBoundingClientRect().top;

    // Now, you can use x and y to perform actions based on the click position
    console.log(`Clicked at (${x}, ${y})`);

    this.context.fillStyle = 'blue';
    this.context.fillRect(x, y, 100, 100);
  }
}
