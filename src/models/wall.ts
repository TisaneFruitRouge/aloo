import BaseObject from "./object";
import Point from "./point";
import { WallWindow, Door } from "./opening";
import { drawLine } from "../app/lib/utils";

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

    public draw(context: CanvasRenderingContext2D) {
        context.fillStyle = 'black';
        this.points[0].draw(context);
        this.points[1].draw(context);
        drawLine(context, this.points[0], this.points[1])
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