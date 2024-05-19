import { AppState } from "../../elements/app-state";
import CanvasController from "./canvas";

/**
 * Class that manages the undo and redo operations
 * by storing the states of the application in two stacks
 */
export class UndoRedo {
    private undoStack: Array<AppState>;
    private pointer: number;

    // NOTE: It's better to avoid circular dependancies (e.g. CanvasController -> UndoRedo -> CanvasController)
    // But for the sake of simplicity in this project we will keep it like this
    private canvasController: CanvasController;

    public constructor(canvasController: CanvasController) {
        this.undoStack = [];
        this.pointer = -1;

        this.canvasController = canvasController;
    }

    /**
     * Undo the last action
     * @returns true if the undo was successful, false otherwise
     */
    public undo(): boolean {
        if (this.pointer - 1 >= 0) {
            this.pointer--;
            const state = this.undoStack.at(this.pointer);
            if (state) {
                this.applyState(state);
                return true;
            }
            else
                console.error("Undo stack is empty");
        } else
            console.error("No more states to undo");
        return false;
    }

    /**
     * Redo the last undone action
     * @returns true if the redo was successful, false otherwise
     */
    public redo(): boolean {
        if (this.pointer < this.undoStack.length - 1) {
            this.pointer++;
            const state = this.undoStack.at(this.pointer);
            if (state) {
                this.applyState(state);
                return true;
            }
            else
                console.error("Redo stack is empty");
        } else
            console.error("No more states to redo");

        return false;
    }

    /**
     * Add a new state to the undo stack
     * @param state The new state to add
     */
    public addState(state: AppState) {
        if (state.houseState == null)
            return;
        
        // If we are at the end of the list, we push the new state
        // otherwise we remove the states after the current pointer
        if (this.pointer !== this.undoStack.length - 1)
            this.undoStack.splice(this.pointer, this.undoStack.length - this.pointer);

        this.pointer++;
        this.undoStack.push(state);
    }

    /**
     * Apply a state to the canvas
     * @param state The state to apply
     */
    public applyState(state: AppState) {
        this.canvasController.applyState(state.houseState);
    }
}