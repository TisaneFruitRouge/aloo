class BaseObject {
    public points: [Point, Point];
    public thickness: number;

    public constructor(fPoint: Point, lPoint: Point, thickness: number) {
        this.points = [fPoint, lPoint];
        this.thickness = thickness;
    }
}