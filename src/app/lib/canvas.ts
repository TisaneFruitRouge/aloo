import House from "../../elements/house";
import { Window } from "../../elements/window";
import { Door } from "../../elements/door";
import { Point } from "../../elements/point";
import { Wall } from "../../elements/wall";
import Command from "./command";
import { HOVERING_DISTANCE } from "./constants";
import { findIntersectionPoint, getDistance, getDistanceFromLine } from "./geomerty";
import { copyInstanceOfClass, drawLine } from "./utils";

export enum Tools {
    Draw,
    Door,
    Window,
    Remove,
    RemoveAll
}

class CanvasController {
    private backgroundContext: CanvasRenderingContext2D;
    private interactiveContext: CanvasRenderingContext2D;
    private width: number;
    private height: number;
    private ghostMode: boolean = false;

    private shiftPressed = false;

    private house: House;
    private lastPoint: Point | null = null;

    private currentTool: Tools = Tools.Draw;

    public mouseX = 0;
    public mouseY = 0;

    private hoveredElement: Point | Wall | Door | Window | null = null;

    private commands:Array<Command> = [];

    private spacing = 100;

    public constructor(backgroundContext: CanvasRenderingContext2D, interactiveContext:CanvasRenderingContext2D, width: number, height: number) {
        this.backgroundContext = backgroundContext;
        this.interactiveContext = interactiveContext;
        this.width = width;
        this.height = height;

        this.house = new House(new Array<Wall>());

        this.drawGrid();
    }

    public setShift(state: boolean) {
        this.shiftPressed = state;
    }

    private drawGrid() {

        // Save the current context state
        this.backgroundContext.save();


        this.backgroundContext.beginPath();
        this.backgroundContext.setLineDash([5, 5]); // Set the line dash pattern for dotted lines
        this.backgroundContext.strokeStyle = 'gray';

        // Vertical lines
        for (let x = 0; x <= this.width; x += this.spacing) {
            this.backgroundContext.moveTo(x, 0);
            this.backgroundContext.lineTo(x, this.height);
        }

        // Horizontal lines
        for (let y = 0; y <= this.height; y += this.spacing) {
            this.backgroundContext.moveTo(0, y);
            this.backgroundContext.lineTo(this.width, y);
        }

        this.backgroundContext.stroke();

        // Restore the context to its default state
        this.backgroundContext.restore();
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

    public redo() {

    }

    public updateCanva() {
        this.interactiveContext.clearRect(0, 0, this.width, this.height);

        // this.drawGrid();

        // drawing last point
        if (this.lastPoint !== null) {
            this.lastPoint.draw(this.interactiveContext);
        }

        // drawing the walls
        for (const wall of this.house.walls) {
            wall.draw(this.interactiveContext);
            wall.setHoveredState(false);
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
        this.interactiveContext.fillStyle = 'green';

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
                        
                        if (this.shiftPressed && this.lastPoint !== null) {
                            const al = determineAlignment(newPoint, this.lastPoint)
                            newPoint = createAlignedPoints(newPoint, this.lastPoint, al)[0]
                        }
                    }
                    
                    for (const wall of this.house.walls) {
                        let intersection = findIntersectionPoint( // finding the intersection
                        canvaController.lastPoint,
                            newPoint,
                            wall.getSegment()[0],
                            wall.getSegment()[1]
                        );
        
                        if (intersection !== null && canvaController.lastPoint.id !== intersection.getId()) {
                            const newWall = new Wall(canvaController.lastPoint, newPoint, "basic", "#FFFFFF");
                            this.lastPoint = intersection;
                            this.house.walls.push(newWall);
                        }
                    }
        
                    const newWall = new Wall(canvaController.lastPoint, newPoint, "basic", "#FFFFFF");
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
                const currentHouse = copyInstanceOfClass(this.house);
                const command = new Command(
                    (canvaController=this) => {
                        let preservedWalls = [];
                        for (const [index, wall] of this.house.walls.entries()) {
                            if (
                                canvaController.hoveredElement.id !== wall.getSegment()[0].getId() && 
                                canvaController.hoveredElement.id !== wall.getSegment()[1].getId()
                            ) {
                                preservedWalls.push(wall)
                            }
                            canvaController.house.walls = preservedWalls;
                        }
                    },
                    (canvaController=this, lastHouse=currentHouse) => {
                        canvaController.house = lastHouse;
                    }
                )
                command.doFnc();
                this.commands.push(command);
            } else if (this.hoveredElement instanceof Wall) {

            } else if (this.hoveredElement instanceof Door) {

            } else if (this.hoveredElement instanceof Window) {

            }
        }
    }

    public removeAll() {
        this.house.walls = [];
        this.lastPoint = null;
        this.ghostMode = false;
        this.updateCanva();
    }

    public setCurrentTool(tool: Tools) {
        this.currentTool = tool;
        this.lastPoint = null;
        this.ghostMode = false;
    }

    public drawGhostelement(mouseX: number, mouseY: number) {
        if (!this.ghostMode) {
            return;
        }

        if (this.lastPoint === null) {
            return;
        }

        this.interactiveContext.fillStyle = 'green';

        const mousePoint = new Point(mouseX, mouseY);
        
        let point = mousePoint

        if (this.shiftPressed) {
            const al = determineAlignment(mousePoint, this.lastPoint)
            point = createAlignedPoints(mousePoint, this.lastPoint, al)[0]
        }

        drawLine(this.interactiveContext, point, this.lastPoint);
    }

    private hoverOnElement(x: number, y: number) {

        const hoverableElement = this.getHoverableElement(x, y);

        if (hoverableElement === null) {
            return;
        }

        if (hoverableElement instanceof Wall) {
            hoverableElement
        }

        hoverableElement.setHoveredState(true);
        hoverableElement.drawHover(this.interactiveContext);
    }

    private getHoverableElement (x: number, y: number) {
        let lastDist = -1;

        for (const wall of this.house.walls) {
            for (const point of wall.getSegment()) {
                let dist = getDistance(x, y, point.getX(), point.getY());
                if (lastDist < 0 || dist < lastDist) {
                    lastDist = dist;
                    this.hoveredElement = point;
                }
            }
            let wallDist = getDistanceFromLine(
                x, 
                y, 
                wall.getSegment()[0].getX(),
                wall.getSegment()[0].getY(),
                wall.getSegment()[1].getX(),
                wall.getSegment()[1].getY()
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

function determineAlignment(mousePoint: Point, lastPoint:Point) {
    
    // Calculate the absolute differences in x and y coordinates
    const dx = Math.abs(mousePoint.getX() - lastPoint.getX());
    const dy = Math.abs(mousePoint.getY() - lastPoint.getY());
    
    // Determine alignment based on which difference is greater
    if (dx < dy) {
        return 'horizontal';
    } else {
        return 'vertical';
    }
}

// Function to create two points aligned either vertically or horizontally
function createAlignedPoints(mousePoint:Point, lastPoint:Point, alignment: string) {
    let point1, point2;
    if (alignment === 'vertical') {
        point1 = new Point(mousePoint.getX(), lastPoint.getY());
        point2 = new Point(mousePoint.getX(), mousePoint.getY()); 
    } else if (alignment === 'horizontal') {
        point1 = new Point(lastPoint.getX(), mousePoint.getY());
        point2 = new Point(mousePoint.getX(), mousePoint.getY()); 
    } else {
        throw new Error('Invalid alignment specified. Please use "vertical" or "horizontal".');
    }
    return [point1, point2];
}

export default CanvasController;