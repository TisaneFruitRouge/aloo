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

    public getLength(): number {
        return this.length;
    }

    public getRelativePosition(): number {
        return this.relativePosition;
    }

    public getThickness(): number {
        return this.thickness;
    }

    public setLength(length: number): void {
        this.length = length;
    }

    public setRelativePosition(relativePosition: number): void {
        this.relativePosition = relativePosition;
    }

    public setThickness(thickness: number): void {
        this.thickness = thickness;
    }

    public toggleHoverState(): void {
        this.isHovered = !this.isHovered;
    }
}
