import { InsetElement } from './inset-element';

export class Window extends InsetElement {
    private numberOfPanes: number; // Nouvelle propriété pour le nombre de vitres
    private glazingType: string; // par exemple 'double', 'triple'
    private frameMaterial: Material;
    private isOpen: boolean;

    constructor(
        length: number,
        relativePosition: number,
        numberOfPanes: number,
        glazingType: string,
        frameMaterialType: string,
        frameColor: string
    ) {
        super(length, relativePosition, 5); // CHANGER LA VALEUR PAR DEFAUT
        this.numberOfPanes = numberOfPanes;
        this.glazingType = glazingType;
        this.frameMaterial = new Material(frameMaterialType, frameColor);
        this.isOpen = false;
    }

    public getNumberOfPanes(): number {
        return this.numberOfPanes;
    }

    public getGlazingType(): string {
        return this.glazingType;
    }

    public getFrameMaterial(): Material {
        return this.frameMaterial;
    }

    public setNumberOfPanes(numberOfPanes: number): void {
        this.numberOfPanes = numberOfPanes;
    }

    public setGlazingType(glazingType: string): void {
        this.glazingType = glazingType;
    }

    public toggleWindow(): void {
        this.isOpen = !this.isOpen;
    }
}
