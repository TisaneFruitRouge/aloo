import House from "../../elements/house";
import { Window } from "../../elements/window";
import { Door } from "../../elements/door";
import { Point } from "../../elements/point";
import { Wall } from "../../elements/wall";
import { HOVERING_DISTANCE } from "./constants";
import { createAlignedPoints, determineAlignment, findIntersectionPoint, getDistance, getDistanceFromLine } from "./geomerty";
import { copyInstanceOfClass, drawLine } from "./utils";
import { UndoRedo } from "./undo-redo";

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
    // private commands:Array<Command> = [];

    private undoManager: UndoRedo;

    // Grid spacing
    private spacing = 100;

    public constructor(backgroundContext: CanvasRenderingContext2D, interactiveContext: CanvasRenderingContext2D,
        staticContext: CanvasRenderingContext2D, width: number, height: number) {

        this.backgroundContext = backgroundContext;
        this.interactiveContext = interactiveContext;
        this.staticContext = staticContext;
        this.width = width;
        this.height = height;

        this.house = new House([]);
        this.house.walls = [];

        this.drawGrid();

        this.undoManager = new UndoRedo(this);
        this.addNewUndoRedoState();
    }

    /**
     * Add new state to undo manager
     */
    private addNewUndoRedoState() {
        this.undoManager.addState({ houseState: copyInstanceOfClass(this.house) });
    }

    /**
     * Set the shift key state
     * @param state State of the shift key (true if pressed, false if not pressed)
     */
    public setShift(state: boolean) {
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

    public applyState(house: House) {
        this.house.walls = house.walls;
    }

    /**
     * Undo the last command
     */
    public undo() {
        this.undoManager.undo();

        // if we are in the middle of a ghost line, we need to clear it
        if (this.ghostMode) {
            this.ghostMode = false;
        }
        this.lastPoint = null;
        this.updateAllCanvases();
    }

    private clearStaticCanvas() {
        this.staticContext.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Redo the last command
     */
    public redo() {
        this.undoManager.redo();

        this.updateAllCanvases();
    }

    /**
     * Update all the canvases
     */
    private updateAllCanvases() {
        this.clearStaticCanvas();
        this.updateCanva();
        this.updateCanvaWalls();
        this.updateCanvaLastPoint();
    }

    /**
     * Update the static canvas with the walls
     */
    public updateCanvaWalls() {
        // drawing the walls
        for (const wall of this.house.walls) {
            wall.draw(this.staticContext);
            wall.setHoveredState(false);
        }
    }

    /**
     * Update the static canvas with the last point
     */
    public updateCanvaLastPoint() {
        // drawing last point
        if (this.lastPoint !== null) {
            this.lastPoint.draw(this.staticContext);
        }
    }

    /**
     * Update the interactive canvas for ghost and hover elements
     */
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

    /**
     * Handle the mouse click event
     * @param x mouse x position
     * @param y mouse y position
     */
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
        // Add the current state to the undo stack
        this.addNewUndoRedoState();
    }

    /**
     * Handle the mouse draw click event
     * @param x mouse x position
     * @param y mouse y position
     */
    private clickWithDraw(x: number, y: number) {
        this.interactiveContext.fillStyle = 'green';

        if (this.lastPoint !== null) { // creating a wall
            let newPoint: Point;

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
                    this.lastPoint,
                    newPoint,
                    wall.getSegment()[0],
                    wall.getSegment()[1]
                );

                if (intersection !== null && this.lastPoint.getId() !== intersection.getId()) {
                    const newWall = new Wall(this.lastPoint, newPoint);
                    this.lastPoint = intersection;
                    this.house.walls.push(newWall);
                }
            }

            const newWall = new Wall(this.lastPoint, newPoint);
            this.house.walls.push(newWall);

            if (newPoint === this.hoveredElement) {
                this.lastPoint = null;
            } else {
                this.lastPoint = newPoint;
            }

        } else {
            if (this.hoveredElement !== null && this.hoveredElement instanceof Point) { // the new point is an existing point
                this.lastPoint = this.hoveredElement;
                this.ghostMode = true;
            }

            this.lastPoint = new Point(x, y);
        }
        this.ghostMode = true;
    }

    /**
     * Handle the mouse click event with the door tool
     * @param x mouse x position
     * @param y mouse y position
     */
    private clickWithDoor(x: number, y: number) {

    }

    /**
     * Handle the mouse click event with the window tool
     * @param x mouse x position
     * @param y mouse y position
     */
    private clickWithWindow(x: number, y: number) {
        if (this.windowClosestWall !== null && this.ghostWindow !== null) {
            this.windowClosestWall.addWindow(this.ghostWindow)
        }
    }

    /**
     * Handle the mouse click event with the remove tool
     * @param x mouse x position
     * @param y mouse y position
     */
    private clickWithRemove(x: number, y: number) {
        if (this.hoveredElement !== null) {
            if (this.hoveredElement instanceof Point) {

                let preservedWalls = [];
                for (const [index, wall] of this.house.walls.entries()) {
                    if (
                        this.hoveredElement.getId() !== wall.getSegment()[0].getId() &&
                        this.hoveredElement.getId() !== wall.getSegment()[1].getId()
                    ) {
                        preservedWalls.push(wall)
                    }
                    
                }
                this.house.walls = preservedWalls;
                this.updateAllCanvases();
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
        this.updateAllCanvases();
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

    /**
     * Handle the mouse hover on element event
     * @param x mouse x position
     * @param y mouse y position
     * Sets the hover element global variable
     */
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

    /**
     * Get the element that is currently hovered by the mouse
     * @param x mouse x position
     * @param y mouse y position
     * @returns The element that is currently hovered by the mouse
     */
    private getHoverableElement(x: number, y: number) {
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

    /**
     * Draw a ghost window on the wall closest to the mouse (to help user place the window)
     * @param mouseX mouse x position
     * @param mouseY mouse y position
     */
    private drawWindowGhost(mouseX: number, mouseY: number) {
        if (this.house.walls.length > 0) {
            const closestWall = Wall.findClosestWallToPoint(new Point(mouseX, mouseY), this.house.walls);
            if (closestWall !== null) {
                const closestPoint = Wall.findClosestPointOnWall(new Point(mouseX, mouseY), closestWall);
                const ghostWindow = new Window(100, closestPoint, 5);

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

                if (distanceA >= 50 && distanceB >= 50) {
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