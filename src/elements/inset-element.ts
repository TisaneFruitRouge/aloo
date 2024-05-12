export class InsetElement {
    private length: number;
    private relativePosition: number;  // Position relative au début du mur
    private thickness: number;
    public isHovered = false;
    private id = crypto.randomUUID();

    public constructor(
        length: number,
        relativePosition: number,
        thickness: number
    ) {
        this.length = length;
        this.relativePosition = relativePosition;
        this.thickness = thickness;
    }

    public getLength() {
        return this.length;
    }

    public getRelativePosition() {
        return this.relativePosition;
    }

    public getThickness() {
        return this.thickness;
    }

    public setLength(length: number) {
        this.length = length;
    }

    public setRelativePosition(relativePosition: number) {
        this.relativePosition = relativePosition;
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
