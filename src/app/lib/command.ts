class Command {

    public doFnc: (...args: any[]) => void;
    public undoFnc: (...args: any[]) => void;

    public constructor (doFnc: (...args: any[]) => void, undoFnc: (...args: any[]) => void) {
        this.doFnc = doFnc;
        this.undoFnc = undoFnc;
    }
}

export default Command;