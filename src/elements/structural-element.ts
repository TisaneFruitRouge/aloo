import { Point } from "./point";

export class StructuralElement {
    private segment: [Point, Point];
    private thickness: number;
    private isHovered = false;
    private id = crypto.randomUUID();

    public constructor(
        A: Point,
        B: Point,
        thickness: number
    ) {
        this.segment = [A, B];
        this.thickness = thickness;
    }

    public getSegment(): [Point, Point] {
        return this.segment;
    }

    public getThickness() {
        return this.thickness;
    }

    public getSegmentLength() {
        const [A, B] = this.segment;
        return Math.sqrt(Math.pow(B.getX() - A.getX(), 2) + Math.pow(B.getY() - A.getY(), 2));
    }

    public setSegment(A: Point, B: Point) {
        this.segment = [A, B];
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
}