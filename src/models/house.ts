import Wall from "./wall";

class House {
    public walls: Array<Wall>

    public constructor(walls: Array<Wall>) {
        this.walls = walls
    }
}

export default House;