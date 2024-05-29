import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { CanvaComponent } from './canva/canva.component';
import { ToolboxComponent } from './toolbox/toolbox.component';
import CanvasController from './lib/canvas';

import { TipsComponent } from './tips/tips.component';
import { TipsService } from './tips/tips.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    CanvaComponent, 
    ToolboxComponent,
    TipsComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'aloo';
  tipService: TipsService = new TipsService();

  public canvasController!: CanvasController;

  ngAfterViewInit(): void {
    const gridCanvas = document.getElementById("gridCanvas") as HTMLCanvasElement | null;
    const interactiveCanvas = document.getElementById("interactiveCanvas") as HTMLCanvasElement | null;
    const staticCanvas = document.getElementById("staticCanvas") as HTMLCanvasElement | null;

    if (gridCanvas && interactiveCanvas && staticCanvas) {
      const gridContext = gridCanvas.getContext('2d');
      const interactiveContext = interactiveCanvas.getContext('2d');
      const staticContext = staticCanvas.getContext('2d');

      if (gridContext && interactiveContext && staticContext) {
        gridCanvas.width = window.innerWidth;
        gridCanvas.height = window.innerHeight;
        interactiveCanvas.width = window.innerWidth;
        interactiveCanvas.height = window.innerHeight;
        staticCanvas.width = window.innerWidth;
        staticCanvas.height = window.innerHeight;

        this.canvasController = new CanvasController(gridContext, interactiveContext, staticContext, window.innerWidth, window.innerHeight, this.tipService);
      } else {
        console.error('Failed to get drawing context for the canvases');
      }
    } else {
      console.error('Failed to find canvas elements');
    }
  }
}
