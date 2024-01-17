import Point from "./point";

class BaseObject {
    public points: [Point, Point];
    public thickness: number;
    id = crypto.randomUUID();

    public constructor(fPoint: Point, lPoint: Point, thickness: number) {
        this.points = [fPoint, lPoint];
        this.thickness = thickness;
    }
}

export default BaseObject;