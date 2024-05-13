import { AppState } from "../../elements/app-state";
import CanvasController from "./canvas";

/**
 * Class that manages the undo and redo operations
 * by storing the states of the application in two stacks
 */
export class UndoRedo {
    private undoStack: Array<AppState>;
    private redoStack: Array<AppState>;

    // NOTE: It's better to avoid circular dependancies (e.g. CanvasController -> UndoRedo -> CanvasController)
    // But for the sake of simplicity in this project we will keep it like this
    private canvasController: CanvasController;

    public constructor(canvasController: CanvasController) {
        this.undoStack = [];
        this.redoStack = [];

        this.canvasController = canvasController;
    }

    public undo() {
        if (this.undoStack.length > 0) {
            const state = this.undoStack.pop();
            if (state) {
                this.redoStack.push(state);
                this.applyState(state);
            }
            else
                console.error("Undo stack is empty");
        }
    }

    public redo() {
        if (this.redoStack.length > 0) {
            const state = this.redoStack.pop();
            if (state) {
                this.undoStack.push(state);
                this.applyState(state);
            }
            else
                console.error("Redo stack is empty");
        }
    }

    public addState(state: AppState) {
        if (state.houseState == null)
            return;
        this.undoStack.push(state);
    }

    public applyState(state: AppState) {

        this.canvasController.applyState(state.houseState);
    }
}