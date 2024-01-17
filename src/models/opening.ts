import BaseObject from "./object";
import Point from "./point";

class Opening extends BaseObject {
    public constructor(fPoint: Point, lPoint: Point, thickness: number) {
        super(fPoint, lPoint, thickness);
    }
}

class Door extends Opening {
    public constructor(fPoint: Point, lPoint: Point, thickness: number) {
        super(fPoint, lPoint, thickness);
    }

    public drawHover(context: CanvasRenderingContext2D) {
        //
    }
}

class WallWindow extends Opening {
    public constructor(fPoint: Point, lPoint: Point, thickness: number) {
        super(fPoint, lPoint, thickness);
    }

    public drawHover(context: CanvasRenderingContext2D) {
        //
    }
}


export {Door, WallWindow}
