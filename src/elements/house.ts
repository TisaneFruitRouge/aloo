import { Door } from "./door";
import { InsetElement } from "./inset-element";
import { Wall } from "./wall";
import { Window } from "./window";

class House {
    public walls: Array<Wall> = [];

    public constructor(walls: Array<Wall>) {
        this.walls = walls
    }

    public getDoors() {
        let doors:Door[] = []
        for (const wall of this.walls) {
            doors = [...doors, ...wall.getDoors()]
        }
        return doors;
    }

    public getWindows() {
        let windows:Window[] = []
        for (const wall of this.walls) {
            windows = [...windows, ...wall.getWindows()]
        }
        return windows;
    }

    public checkCollisionWithInsetElement(insetElementToCheckCollisionWith: InsetElement) {
        const doors = this.getDoors();
        const windows = this.getWindows();

        let insetElements = [...doors, ...windows];

        for (const insetElement of insetElements) {
            if (insetElement.collisionWithInsetElement(insetElementToCheckCollisionWith)) {
                return true;
            }
        }

        return false;
    }
}

export default House;