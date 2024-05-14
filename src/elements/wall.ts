import { StructuralElement } from "./structural-element";
import { Point } from "./point";
import { Door } from "./door";
import { Window } from "./window";
import { drawLine } from "../app/lib/utils";
import { getDistanceFromLine } from "../app/lib/geomerty";

export class Wall extends StructuralElement {
    private doors: Array<Door>;
    private windows: Array<Window>

    public constructor(
        A: Point,
        B: Point,
    ) {
        super(A, B, 5); // CHANGER LA VALEUR PAR DEFAUT
        this.doors = new Array<Door>();
        this.windows = new Array<Window>();
    }

    static findClosestWallToPoint(point: Point, walls: Wall[]): Wall | null {
        let closestWall: Wall | null = null;
        let minDistance = Number.MAX_VALUE;

        // Iterate through each wall in the list
        for (const wall of walls) {
            // Calculate the distance between the point and the wall
            const segment = wall.getSegment();

            const wallCenterPoint = StructuralElement.getCenterPoint(segment[0], segment[1]);

            const distanceBetweenWallAndMouse = Point.getDistanceBetweenTwoPoints(point, wallCenterPoint);

            // Update the closest wall if this wall is closer
            if (distanceBetweenWallAndMouse < minDistance) {
                minDistance = distanceBetweenWallAndMouse;
                closestWall = wall;
            }
        }

        return closestWall;
    }

    static findClosestPointOnWall(mousePos: Point, wall: Wall): Point {
        // Calculate coefficients A, B, and C of the line equation Ax + By + C = 0
        const A = wall.getSegment()[1].getY() - wall.getSegment()[0].getY();
        const B = wall.getSegment()[0].getX() - wall.getSegment()[1].getX();
        const C =  wall.getSegment()[1].getX() * wall.getSegment()[0].getY() - wall.getSegment()[0].getX() * wall.getSegment()[1].getY();
    
        // Calculate the denominator (A^2 + B^2)
        const denom = A * A + B * B;
    
        // Calculate the closest point (x0, y0)
        const x0 = (B * (B * mousePos.getX() - A * mousePos.getY()) - A * C) / denom;
        const y0 = (A * (-B * mousePos.getX() + A * mousePos.getY()) - B * C) / denom;
    
        const closestPoint = new Point(x0, y0);

        return closestPoint;
    }

    static isPointInsideWall(closestPoint: Point, closestWall: Wall): boolean {

        // Check if x0 is between x1 and x2, and if y0 is between y1 and y2
        const isXInRange = (closestPoint.getX() >= Math.min(closestWall.getSegment()[0].getX(), closestWall.getSegment()[1].getX()) &&
            closestPoint.getX() <= Math.max(closestWall.getSegment()[0].getX(), closestWall.getSegment()[1].getX()));

        const isYInRange = (closestPoint.getY() >= Math.min(closestWall.getSegment()[0].getY(), closestWall.getSegment()[1].getY()) &&
            closestPoint.getY() <= Math.max(closestWall.getSegment()[0].getY(), closestWall.getSegment()[1].getY()));

        return isXInRange && isYInRange;
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
            door.draw(context, this.getSegment()[0], this.getSegment()[1]);
        }

        for (const window of this.windows) {
            window.draw(context, this.getSegment()[0], this.getSegment()[1])
        }
    }

    public drawHover(context: CanvasRenderingContext2D) {
        // for walls, the drawHover is just a color change
    }
}


