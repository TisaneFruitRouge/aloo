import { StructuralElement } from "./structural-element";
import { Point } from "./point";
import { Door } from "./door";
import { Window } from "./window";
import { drawLine } from "../app/lib/utils";
import { Material } from "./material";
import { getDistanceFromLine } from "../app/lib/geomerty";

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

    static findClosestWallToPoint(point: Point, walls: Wall[]): Wall | null {
        let closestWall: Wall | null = null;
        let minDistance = Number.MAX_VALUE;

        // Iterate through each wall in the list
        for (const wall of walls) {
            // Calculate the distance between the point and the wall
            const segment = wall.getSegment();
            const x1 = segment[0].getX();
            const y1 = segment[0].getY();
            const x2 = segment[1].getX();
            const y2 = segment[1].getY();
            const distance = getDistanceFromLine(point.getX(), point.getY(), x1, x2, y1, y2);

            // Update the closest wall if this wall is closer
            if (distance < minDistance) {
                minDistance = distance;
                closestWall = wall;
            }
        }

        return closestWall;
    }

    static findClosestPointOnWall(point: Point, wall: Wall) {
        const x1 = wall.getSegment()[0].getX();
        const y1 = wall.getSegment()[0].getY();
        const x2 = wall.getSegment()[1].getX();
        const y2 = wall.getSegment()[1].getY(); 
        
        // Vector representing the wall
        const wallVector = [x2 - x1, y2 - y1];
        
        // Vector from starting point of the wall to the given point
        const pointVector = [point.getX() - x1, point.getY() - y1];
        
        // Calculate the dot product of the wall vector and the point vector
        const dotProduct = wallVector[0] * pointVector[0] + wallVector[1] * pointVector[1];
        
        // Calculate the length of the wall vector squared
        const wallLengthSquared = wallVector[0] * wallVector[0] + wallVector[1] * wallVector[1];
        
        // Calculate the parameter t which represents the position of the closest point on the wall
        const t = Math.max(0, Math.min(1, dotProduct / wallLengthSquared));
        
        // Calculate the coordinates of the closest point on the wall
        const closestPoint = new Point(
            x1 + t * wallVector[0],
            y1 + t * wallVector[1]
        );
        
        return closestPoint;
    }

    addDoor(door: Door): void {
        this.doors.push(door);
    }

    removeDoor(door: Door): void {
        this.doors = this.doors.filter(d => d !== door);
    }

    addWindow(window: Window): void {
        this.windows.push(window);
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

        for (const door of this.doors) {
            door.draw(context);
        }

        for (const window of this.windows) {
            window.draw(context, this.getSegment()[0], this.getSegment()[1])
        }
    }

    public drawHover(context: CanvasRenderingContext2D) {
        // for walls, the drawHover is just a color change
    }
}


