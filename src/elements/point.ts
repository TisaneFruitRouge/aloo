import { HEIGHT, WIDTH } from "../app/lib/constants";

export class Point {
    private x: number;
    private y: number;
    private id = crypto.randomUUID();
    private isHovered = false;

    public constructor(
        x: number,
        y: number
    ) {
        this.x = x;
        this.y = y;
    }

    public getX() {
        return this.x;
    }

    public getY() {
        return this.y;
    }

    public setX(x: number) {
        this.x = x;
    }

    public setY(y: number) {
        this.y = y;
    }

    public getId() {
        return this.id;
    }

    public drawHover(context: CanvasRenderingContext2D) {
        context.save();
        const strokeX = this.x - 2;
        const strokeY = this.y - 2;

        context.strokeRect(strokeX - WIDTH / 2, strokeY - HEIGHT / 2, WIDTH + 4, HEIGHT + 4);
        context.restore();
    }

    public draw(context: CanvasRenderingContext2D, color = "black") {
        context.save();
        context.fillStyle = color;
        context.fillRect(this.x - WIDTH / 2, this.y - HEIGHT / 2, WIDTH, WIDTH);
        context.restore();
    }

    public getHoveredState() {
        return this.isHovered;
    }

    public setHoveredState(isHovered: boolean) {
        this.isHovered = isHovered;
    }
}