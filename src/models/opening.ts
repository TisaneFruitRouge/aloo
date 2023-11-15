class Opening extends BaseObject {
    public constructor(fPoint: Point, lPoint: Point, thickness: number) {
        super(fPoint, lPoint, thickness);
    }
}

class Door extends Opening {
    public constructor(fPoint: Point, lPoint: Point, thickness: number) {
        super(fPoint, lPoint, thickness);
    }
}

class WallWindow extends Opening {
    public constructor(fPoint: Point, lPoint: Point, thickness: number) {
        super(fPoint, lPoint, thickness);
    }
}

