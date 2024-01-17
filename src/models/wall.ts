import BaseObject from "./object";
import Point from "./point";
import { WallWindow, Door } from "./opening";

class Wall extends BaseObject {
    public doors: Array<Door>;
    public windows: Array<WallWindow>

    public constructor(
        fPoint: Point,
        lPoint: Point,
        thickness: number,
        doors: Array<Door>, 
        windows: Array<WallWindow>
    ) {
        super(fPoint, lPoint, thickness);
        this.doors = doors
        this.windows = windows;
    }

    public drawHover(context: CanvasRenderingContext2D) {
        // context.beginPath();
        
        // context.moveTo(sX, sY);
        // context.lineTo(eX, eY);

        // // Draw the Path
        // this.context.stroke();  
    }
}

export default Wall;