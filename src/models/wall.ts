class Wall extends BaseObject {
    public doors: Array<Door>;
    public windows: Array<WallWindow>

    public constructor(
        fPoint: Point,
        lPoint: Point,
        thickness: number,
        doors: Array<Door>, 
        windows: Array<WallWindow>
    ) {
        super(fPoint, lPoint, thickness);
        this.doors = doors
        this.windows = windows;
    }
}