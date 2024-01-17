import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { CanvaComponent } from './canva/canva.component';
import { ToolboxComponent } from './toolbox/toolbox.component';
import CanvasController from './lib/canvas';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    CanvaComponent, 
    ToolboxComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'aloo';

  public canvasController!: CanvasController;

  ngAfterViewInit(): void {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (canvas !== null) {
      let context = canvas.getContext('2d') as CanvasRenderingContext2D;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      this.canvasController = new CanvasController(context, window.innerWidth, window.innerHeight);
    }
  }
}
