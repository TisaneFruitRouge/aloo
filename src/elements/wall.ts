import { StructuralElement } from "./structural-element";
import { Point } from "./point";
import { Door } from "./door";
import { Window } from "./window";
import { drawLine } from "../app/lib/utils";
import { Material } from "./material";

export class Wall extends StructuralElement {
    private doors: Array<Door>;
    private windows: Array<Window>
    private wallMaterial: Material;

    public constructor(
        A: Point,
        B: Point,
        wallMaterialType: string,
        wallColor: string
    ) {
        super(A, B, 5); // CHANGER LA VALEUR PAR DEFAUT
        this.doors = new Array<Door>();
        this.windows = new Array<Window>();
        this.wallMaterial = new Material(wallMaterialType, wallColor);
    }

    addDoor(door: Door): void {
        const wallLength = this.getSegmentLength();
        if (door.getRelativePosition() >= 0 && door.getRelativePosition() + door.getLength() <= wallLength) {
            this.doors.push(door);
        }
    }

    removeDoor(door: Door): void {
        this.doors = this.doors.filter(d => d !== door);
    }

    addWindow(window: Window): void {
        const wallLength = this.getSegmentLength();
        if (window.getRelativePosition() >= 0 && window.getRelativePosition() + window.getLength() <= wallLength) {
            this.windows.push(window);
        }
    }

    removeWindow(window: Window): void {
        this.windows = this.windows.filter(w => w !== window);
    }

    public draw(context: CanvasRenderingContext2D) {
        
        context.save();

        context.fillStyle = this.getHoveredState() ? 'gray' : 'black';
        this.getSegment()[0].draw(context);
        this.getSegment()[1].draw(context);
        drawLine(context, this.getSegment()[0], this.getSegment()[1]);

        context.restore();
    }

    public drawHover(context: CanvasRenderingContext2D) {
        // for walls, the drawHover is just a color change
    }
}


