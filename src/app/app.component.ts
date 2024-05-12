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
    const gridCanvas = document.getElementById("gridCanvas") as HTMLCanvasElement | null;
    const interactiveCanvas = document.getElementById("interactiveCanvas") as HTMLCanvasElement | null;

    if (gridCanvas && interactiveCanvas) {
      const gridContext = gridCanvas.getContext('2d');
      const interactiveContext = interactiveCanvas.getContext('2d');

      if (gridContext && interactiveContext) {
        gridCanvas.width = window.innerWidth;
        gridCanvas.height = window.innerHeight;
        interactiveCanvas.width = window.innerWidth;
        interactiveCanvas.height = window.innerHeight;

        this.canvasController = new CanvasController(gridContext, interactiveContext, window.innerWidth, window.innerHeight);
      } else {
        console.error('Failed to get drawing context for the canvases');
      }
    } else {
      console.error('Failed to find canvas elements');
    }
  }
}
