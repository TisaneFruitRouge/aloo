import { HEIGHT, WIDTH } from "../app/lib/constants";

class Point {
    public x: number;
    public y: number;
    public id = crypto.randomUUID();

    public constructor(x: number, y:number) {
        this.x = x;
        this.y = y;
    }

    public drawHover(context: CanvasRenderingContext2D) {
        const strokeX = this.x - 2;
        const strokeY = this.y - 2;

        context.strokeRect(strokeX - WIDTH / 2, strokeY - HEIGHT / 2, WIDTH + 4, HEIGHT + 4);
    }

    public draw(context: CanvasRenderingContext2D) {
        context.fillStyle = 'black';
        context.fillRect(this.x - WIDTH / 2, this.y - HEIGHT / 2, WIDTH, WIDTH);
    }

    public toString() {
        return `x: ${this.x} | y: ${this.y}`;
    }
}

export default Point;