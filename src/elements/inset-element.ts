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
}
