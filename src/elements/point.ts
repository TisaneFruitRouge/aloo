export class Point {
    private x: number;
    private y: number;
    private id = crypto.randomUUID();

    public constructor(
        x: number,
        y: number
    ) {
        this.x = x;
        this.y = y;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public setX(x: number): void {
        this.x = x;
    }

    public setY(y: number): void {
        this.y = y;
    }
}