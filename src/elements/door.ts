import { InsetElement } from "./inset-element";
import { Point } from "./point";

export class Door extends InsetElement {
    private openingType: string; // par exemple 'coulissante', 'battante'
    private isOpen: boolean;

    public constructor(
        length: number,
        center: Point,
        openingType: string,
        doorMaterialType: string,
        doorColor: string,
    ) {
        super(length, center, 5); // CHANGER LA VALEUR PAR DEFAUT
        this.openingType = openingType;
        this.isOpen = false;
    }

    public getOpeningType() {
        return this.openingType;
    }

    public setOpeningType(openingType: string) {
        this.openingType = openingType;
    }

    public toggleDoor() {
        this.isOpen = !this.isOpen;
    }

    public draw(context: CanvasRenderingContext2D) {

    }
}
