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
    const backgroundCanvas = document.getElementById("backgroundCanvas") as HTMLCanvasElement | null;
    const interactiveCanvas = document.getElementById("interactiveCanvas") as HTMLCanvasElement | null;

    if (backgroundCanvas && interactiveCanvas) {
      const backgroundContext = backgroundCanvas.getContext('2d');
      const interactiveContext = interactiveCanvas.getContext('2d');

      if (backgroundContext && interactiveContext) {
        backgroundCanvas.width = window.innerWidth;
        backgroundCanvas.height = window.innerHeight;
        interactiveCanvas.width = window.innerWidth;
        interactiveCanvas.height = window.innerHeight;

        this.canvasController = new CanvasController(backgroundContext, interactiveContext, window.innerWidth, window.innerHeight);
      } else {
        console.error('Failed to get drawing context for the canvases');
      }
    } else {
      console.error('Failed to find canvas elements');
    }
  }
}
