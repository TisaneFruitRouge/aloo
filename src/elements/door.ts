import { InsetElement } from "./inset-element";

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

    public getOpeningType(): string {
        return this.openingType;
    }

    public getDoorMaterial(): Material {
        return this.doorMaterial;
    }

    public setOpeningType(openingType: string): void {
        this.openingType = openingType;
    }

    public toggleDoor(): void {
        this.isOpen = !this.isOpen;
    }
}
