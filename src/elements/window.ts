import { WIDTH } from '../app/lib/constants';
import { InsetElement } from './inset-element';
import { Material } from './material';
import { Point } from './point';

export class Window extends InsetElement {
    private numberOfPanes: number; // Nouvelle propriété pour le nombre de vitres
    private glazingType: string; // par exemple 'double', 'triple'
    private frameMaterial: Material;
    private isOpen: boolean;

    constructor(
        length: number,
        center: Point,
        numberOfPanes: number,
        glazingType: string,
        frameMaterialType: string,
        frameColor: string
    ) {
        super(length, center, 5); // CHANGER LA VALEUR PAR DEFAUT
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

    public setNumberOfPanes(numberOfPanes: number) {
        this.numberOfPanes = numberOfPanes;
    }

    public setGlazingType(glazingType: string) {
        this.glazingType = glazingType;
    }

    public toggleWindow() {
        this.isOpen = !this.isOpen;
    }

    public draw(context: CanvasRenderingContext2D, wallAPoint: Point, wallBPoint: Point, forceHover?: boolean) {
        context.save();

        const color = (this.getHoveredState() || forceHover) ? 'gray' : '#EEEEEE'

        context.strokeStyle = color;
        context.lineWidth = WIDTH;

        const wallVector = [wallBPoint.getX() - wallAPoint.getX(), wallBPoint.getY() - wallAPoint.getY()];
        const rotation = Math.atan2(wallVector[1], wallVector[0]);

        const centerX = this.getCenter().getX();
        const centerY = this.getCenter().getY();
        const halfLength = this.getLength() / 2;

        const startX = centerX - halfLength;
        const endX = centerX + halfLength;
        const y = centerY;

        context.translate(centerX, centerY);
        context.rotate(rotation); // Apply rotation
        context.translate(-centerX, -centerY);
        
        this.getCenter().draw(context, color);
        context.beginPath();
        context.moveTo(startX, y);
        context.lineTo(endX, y);
        context.stroke();    

        context.restore();
    }
}
