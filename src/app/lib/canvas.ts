import House from "../../elements/house";
import { Window } from "../../elements/window";
import { Door } from "../../elements/door";
import { Point } from "../../elements/point";
import { Wall } from "../../elements/wall";
import Command from "./command";
import { HOVERING_DISTANCE } from "./constants";
import { createAlignedPoints, determineAlignment, findIntersectionPoint, getDistance, getDistanceFromLine } from "./geomerty";
import { copyInstanceOfClass, drawLine } from "./utils";

/**
 * Enum for the different tools available in the application
 * (Toolbar at the top of the canvas)
 */
export enum Tools {
    Draw,
    Door,
    Window,
    Remove,
    RemoveAll
}

/**
 * Class to control the canvas and the elements drawn on it
 */
class CanvasController {

    // The three different contexts for the canvas to improve performance
    // Background context is used for the static points and lines
    private backgroundContext: CanvasRenderingContext2D;

    // Interactive context is used for the dynamic points and lines
    private interactiveContext: CanvasRenderingContext2D;

    // Static context is used for the grid
    private staticContext: CanvasRenderingContext2D;

    private width: number;
    private height: number;

    // Ghost mode is used to draw a temporary line that is not yet confirmed
    private ghostMode: boolean = false;

    // Is the shift key pressed or not (used for alignment of lines horizontally or vertically)
    private shiftPressed = false;

    // The house object that contains all the elements drawn on the canvas
    private house: House;

    // The last point that was placed on the canvas
    private lastPoint: Point | null = null;

    // the ghost window element to draw if the window tools is selected
    private ghostWindow: Window | null = null;
    private windowClosestWall: Wall | null = null;

    // The tool that is currently selected
    private currentTool: Tools = Tools.Draw;

    // The mouse position on the canvas
    public mouseX = 0;
    public mouseY = 0;

    // The element that is currently hovered by the mouse
    private hoveredElement: Point | Wall | Door | Window | null = null;

    // Array of commands that have been executed
    private commands:Array<Command> = [];

    // Grid spacing
    private spacing = 100;

    public constructor(backgroundContext: CanvasRenderingContext2D, interactiveContext:CanvasRenderingContext2D,
        staticContext:CanvasRenderingContext2D, width: number, height: number) {
            
        this.backgroundContext = backgroundContext;
        this.interactiveContext = interactiveContext;
        this.staticContext = staticContext;
        this.width = width;
        this.height = height;

        this.house = new House(new Array<Wall>());

        this.drawGrid();
    }

    /**
     * Set the shift key state
     * @param state State of the shift key (true if pressed, false if not pressed)
     */
    public setShift(state: boolean) {
        this.shiftPressed = state;
    }

    /**
     * Draw the grid on the canvas using the given spacing settings
     */
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

    /**
     * Undo the last command
     */
    public undo() {
        const size = this.commands.length;

        if (size < 1) {
            return;
        }

        const lastCommand = this.commands[size - 1];
        lastCommand.undoFnc();
        this.commands.pop();
        this.updateCanva();
        this.updateCanvaWalls();
        this.updateCanvaLastPoint();
    }

    /**
     * Redo the last command
     */
    public redo() {

    }

    public updateCanvaWalls()
    {
        // this.staticContext.clearRect(0, 0, this.width, this.height);
        // drawing the walls
        for (const wall of this.house.walls) {
            wall.draw(this.staticContext);
            wall.setHoveredState(false);
        }
    }

    public updateCanvaLastPoint() {
        this.staticContext.clearRect(0, 0, this.width, this.height);
        // drawing last point
        if (this.lastPoint !== null) {
            this.lastPoint.draw(this.staticContext);
        }
    }

    public updateCanva() {
        this.interactiveContext.clearRect(0, 0, this.width, this.height);

        // draw ghost line if necessary
        if (this.ghostMode) {
            this.drawGhostelement(this.mouseX, this.mouseY);
        }

        if (this.currentTool === Tools.Window) {
            this.drawWindowGhost(this.mouseX, this.mouseY)
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
                            const newWall = new Wall(canvaController.lastPoint, newPoint);
                            this.lastPoint = intersection;
                            this.house.walls.push(newWall);
                        }
                    }
        
                    const newWall = new Wall(canvaController.lastPoint, newPoint);
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
        if (this.windowClosestWall !== null && this.ghostWindow !== null) {
            this.windowClosestWall.addWindow(this.ghostWindow)
        }
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

    /**
     * Remove all elements from the canvas
     */
    public removeAll() {
        this.house.walls = [];
        this.lastPoint = null;
        this.ghostMode = false;
        this.ghostWindow = null;
        this.windowClosestWall = null;
        this.updateCanva();
        this.updateCanvaWalls();
        this.updateCanvaLastPoint();
    }

    /**
     * Set the current tool to the specified tool
     * @param tool Tool to set as the current tool
     */
    public setCurrentTool(tool: Tools) {
        this.currentTool = tool;
        this.lastPoint = null;
        this.ghostMode = false;
        this.ghostWindow = null;
        this.windowClosestWall = null;
    }

    /**
     * Draw a temporary line that is not yet confirmed
     * @param mouseX The x coordinate of the mouse
     * @param mouseY The y coordinate of the mouse
     */
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

    private drawWindowGhost(mouseX: number, mouseY: number) {
        if (this.house.walls.length > 0) {
            const closestWall = Wall.findClosestWallToPoint(new Point(mouseX, mouseY), this.house.walls);
            if (closestWall !== null) {
                const closestPoint = Wall.findClosestPointOnWall(new Point(mouseX, mouseY), closestWall);
                const ghostWindow = new Window(100, closestPoint);
                
                const distanceA = getDistance(
                    closestPoint.getX(), 
                    closestPoint.getY(), 
                    closestWall.getSegment()[0].getX(),
                    closestWall.getSegment()[0].getY()
                )

                const distanceB = getDistance(
                    closestPoint.getX(), 
                    closestPoint.getY(), 
                    closestWall.getSegment()[1].getX(),
                    closestWall.getSegment()[1].getY()
                )

                if ((distanceA >= 50 && distanceB >= 50) || false) {
                    this.ghostWindow = ghostWindow;
                    this.windowClosestWall = closestWall;
                    this.ghostWindow.draw(
                        this.interactiveContext, 
                        closestWall.getSegment()[0], 
                        closestWall.getSegment()[1], 
                        true
                    );
                }
            }
        }
    }
}

export default CanvasController;    