import { InsetElement } from "./inset-element";
import { Material } from "./material";

export class Door extends InsetElement {
    private openingType: string; // par exemple 'coulissante', 'battante'
    private doorMaterial: Material;
    private isOpen: boolean;

    public constructor(
        length: number,
        relativePosition: number,
        openingType: string,
        doorMaterialType: string,
        doorColor: string,
    ) {
        super(length, relativePosition, 5); // CHANGER LA VALEUR PAR DEFAUT
        this.openingType = openingType;
        this.doorMaterial = new Material(doorMaterialType, doorColor);
        this.isOpen = false;
    }

    public getOpeningType() {
        return this.openingType;
    }

    public getDoorMaterial() {
        return this.doorMaterial;
    }

    public setOpeningType(openingType: string) {
        this.openingType = openingType;
    }

    public toggleDoor() {
        this.isOpen = !this.isOpen;
    }
}
