import { Point } from "./point";

export class InsetElement {
    private length: number;
    private center: Point;  // Position relative au début du mur
    private thickness: number;
    public isHovered = false;
    private id = crypto.randomUUID();

    public constructor(
        length: number,
        center: Point,
        thickness: number
    ) {
        this.length = length;
        this.center = center;
        this.thickness = thickness;
    }

    public getLength() {
        return this.length;
    }

    public getCenter() {
        return this.center;
    }

    public getThickness() {
        return this.thickness;
    }

    public setLength(length: number) {
        this.length = length;
    }

    public setCenter(center: Point) {
        this.center = center;
    }

    public setThickness(thickness: number) {
        this.thickness = thickness;
    }

    public toggleHoverState() {
        this.isHovered = !this.isHovered;
    }

    public getHoveredState() {
        return this.isHovered;
    }

    public setHoveredState(isHovered: boolean) {
        this.isHovered = isHovered;
    }

    public drawHover(context: CanvasRenderingContext2D) {
        // for walls, the drawHover is just a color change
    }

    public collisionWithInsetElement(insetElement: InsetElement) {
        const halfLength = this.length / 2;
        const insetHalfLength = insetElement.getLength() / 2;

        // Calculate the bounds of this element
        const thisX1 = this.center.getX() - halfLength;
        const thisX2 = this.center.getX() + halfLength;
        const thisY1 = this.center.getY() - halfLength;
        const thisY2 = this.center.getY() + halfLength;

        // Calculate the bounds of the inset element
        const insetX1 = insetElement.getCenter().getX() - insetHalfLength;
        const insetX2 = insetElement.getCenter().getX() + insetHalfLength;
        const insetY1 = insetElement.getCenter().getY() - insetHalfLength;
        const insetY2 = insetElement.getCenter().getY() + insetHalfLength;

        // Check for collision in the x direction
        const xCollision = thisX1 < insetX2 && thisX2 > insetX1;

        // Check for collision in the y direction
        const yCollision = thisY1 < insetY2 && thisY2 > insetY1;

        // Collision occurs if there is overlap in both x and y directions
        return xCollision && yCollision;
    }
}
