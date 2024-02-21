import House from "../../models/house";
import { Door, WallWindow } from "../../models/opening";
import Point from "../../models/point";
import Wall from "../../models/wall";
import Command from "./command";
import { HEIGHT, HOVERING_DISTANCE, WIDTH } from "./constants";
import { findIntersectionPoint, getDistance, getDistanceFromLine } from "./geomerty";
import { copyInstanceOfClass } from "./utils";

export enum Tools {
    Draw,
    Door,
    Window,
    Remove,
    RemoveAll
}

class CanvasController {
    private context: CanvasRenderingContext2D;
    private width: number;
    private height: number;
    private ghostMode: boolean = false;

    private house: House;
    private lastPoint: Point | null = null;

    private currentTool: Tools = Tools.Draw;

    public mouseX = 0;
    public mouseY = 0;

    private hoveredElement: Point | Wall | Door | WallWindow | null = null;

    private commands:Array<Command> = [];

    public constructor(context: CanvasRenderingContext2D, width: number, height: number) {
        this.context = context;
        this.width = width;
        this.height = height;

        this.house = new House(new Array<Wall>());
    }

    public undo() {
        const size = this.commands.length;

        if (size < 1) {
            return;
        }

        const lastCommand = this.commands[size - 1];
        lastCommand.undoFnc();
        this.commands.pop();
        this.updateCanva();
    }

    public updateCanva() {
        this.context.clearRect(0, 0, this.width, this.height);

        // drawing last point
        if (this.lastPoint !== null) {
            this.drawPoint(this.lastPoint.x, this.lastPoint.y);
        }

        // drawing the walls
        for (const wall of this.house.walls) {
            this.drawWall(wall);
        }

        // draw ghost line if necessary
        if (this.ghostMode) {
            this.drawGhostelement(this.mouseX, this.mouseY);
        }


        this.hoverOnElement(this.mouseX, this.mouseY);
    }

    public handleClick(x: number, y: number) {
        switch (this.currentTool) {
            case Tools.Draw:
                this.clickWithDraw(x, y);
                break;
            case Tools.Door:
                this.clickWithDoor(x, y);
                break;
            case Tools.Window:
                this.clickWithWindow(x, y);
                break;
            case Tools.Remove:
                this.clickWithRemove(x, y);
                break;
            case Tools.RemoveAll:
                this.removeAll();
                break;
        }
    }

    private clickWithDraw(x: number, y: number) {
        this.context.fillStyle = 'green';

        if (this.lastPoint !== null) { // creating a wall
            let newPoint: Point;

            const currentGhostMode = this.ghostMode;
            const currentLastPoint = copyInstanceOfClass(this.lastPoint);
            const currentHouse = copyInstanceOfClass(this.house);

            const command = new Command(
                (canvaController=this) => {
                    if (this.hoveredElement !== null && this.hoveredElement instanceof Point) { // action to perform related to the hovered element
                        newPoint = this.hoveredElement; // the point we clicked was the one hovered
                        this.ghostMode = false;
                    } else { // creating a new point
                        newPoint = new Point(x, y);
                    }
                    
                    for (const wall of this.house.walls) {
                        let intersection = findIntersectionPoint( // finding the intersection
                        canvaController.lastPoint,
                            newPoint,
                            wall.points[0],
                            wall.points[1]
                        );
        
                        if (intersection !== null) {
                            const newWall = new Wall(canvaController.lastPoint, intersection, 5, [], []);
                            this.lastPoint = intersection;
                            this.house.walls.push(newWall);
                        }
                    }
        
                    const newWall = new Wall(canvaController.lastPoint, newPoint, 5, [], []);
                    this.house.walls.push(newWall);
        
                    if (newPoint === this.hoveredElement) {
                        this.lastPoint = null;
                    } else {
                        this.lastPoint = newPoint;
                    }
                    return;
                },
                (canvaController=this, lastGhostMode=currentGhostMode, lastLastPoint=currentLastPoint, lastHouse=currentHouse) => {
                    canvaController.ghostMode = lastGhostMode;
                    canvaController.lastPoint = lastLastPoint;
                    canvaController.house = lastHouse;
                }
            )
            command.doFnc();
            this.commands.push(command);
            
        } else {
            if (this.hoveredElement !== null && this.hoveredElement instanceof Point) { // the new point is an existing point
                const command = new Command(
                    (canvaController) => {
                        canvaController.lastPoint = canvaController.hoveredElement;
                        canvaController.ghostMode = true;
                    },
                    (canvaController=this, currentLastPoint=this.lastPoint, currentGhostMode=this.ghostMode) => {
                        canvaController.lastPoint = currentLastPoint;
                        canvaController.ghostMode = currentGhostMode;
                    }
                )
                command.doFnc();
                this.commands.push(command);
                return;
            }
            const command = new Command(
                (canvaController=this) => {
                    canvaController.lastPoint = new Point(x, y);
                },
                (canvasController=this, currentLastPoint=this.lastPoint) => {
                    canvasController.lastPoint = currentLastPoint;
                }
            );
            command.doFnc();
            this.commands.push(command);
        }
        this.ghostMode = true;
    }

    private clickWithDoor(x: number, y: number) {

    }

    private clickWithWindow(x: number, y: number) {

    }

    private clickWithRemove(x: number, y: number) {
        if (this.hoveredElement !== null) {
            if (this.hoveredElement instanceof Point) {
                let preservedWalls = [];
                for (const [index, wall] of this.house.walls.entries()) {
                    if (this.hoveredElement.id !== wall.points[0].id && this.hoveredElement.id !== wall.points[1].id) {
                        preservedWalls.push(wall)
                    }
                    this.house.walls = preservedWalls;
                }
            } else if (this.hoveredElement instanceof Wall) {

            } else if (this.hoveredElement instanceof Door) {

            } else if (this.hoveredElement instanceof WallWindow) {

            }
        }
    }

    public removeAll() {
        this.house.walls = [];
        this.updateCanva();
    }

    public setCurrentTool(tool: Tools) {
        this.currentTool = tool;
        this.lastPoint = null;
        this.ghostMode = false;
    }

    private drawPoint(x:number, y:number) {
        this.context.fillStyle = 'black';

        this.context.fillRect(x - WIDTH / 2, y - HEIGHT / 2, WIDTH, WIDTH);
    }

    public drawGhostelement(mouseX: number, mouseY: number) {
        if (!this.ghostMode) {
            return;
        }

        if (this.lastPoint === null) {
            return;
        }

        this.context.fillStyle = 'green';
        this.drawLine(mouseX, mouseY, this.lastPoint.x, this.lastPoint.y)
    }

    private drawLine(sX: number, sY: number, eX: number, eY: number) {
        // Start a new Path
        this.context.beginPath();
        this.context.moveTo(sX, sY);
        this.context.lineTo(eX, eY);

        // Draw the Path
        this.context.stroke();  
    }

    private drawWall(wall: Wall) {
        this.context.fillStyle = 'black';
        this.drawPoint(wall.points[0].x, wall.points[0].y);
        this.drawPoint(wall.points[1].x, wall.points[1].y);
        this.drawLine(
            wall.points[0].x, 
            wall.points[0].y,
            wall.points[1].x, 
            wall.points[1].y
        );
    }

    private hoverOnElement(x: number, y: number) {
        const hoverableElement = this.getHoverableElement(x, y);

        if (hoverableElement === null) {
            return;
        }

        console.log(hoverableElement)
        hoverableElement.drawHover(this.context);
        
        if (hoverableElement instanceof Point) {
            
        }
    }

    private getHoverableElement (x: number, y: number) {
        let lastDist = -1;

        for (const wall of this.house.walls) {
            for (const point of wall.points) {
                let dist = getDistance(x, y, point.x, point.y);
                if (lastDist < 0 || dist < lastDist) {
                    lastDist = dist;
                    this.hoveredElement = point;
                }
            }
            let wallDist = getDistanceFromLine(
                x, 
                y, 
                wall.points[0].x,
                wall.points[0].y,
                wall.points[1].x,
                wall.points[1].y
            )
            if (wallDist < lastDist) {
                lastDist = wallDist;
                this.hoveredElement = wall;
            }
        }

        if (lastDist < HOVERING_DISTANCE) {
            return this.hoveredElement;
        } else {
            this.hoveredElement = null;
            return null;
        }
    }
}

export default CanvasController;