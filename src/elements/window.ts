import { WIDTH } from '../app/lib/constants';
import { InsetElement } from './inset-element';
import { Point } from './point';

export class Window extends InsetElement {
    private isOpen: boolean;

    constructor(
        length: number,
        center: Point
    ) {
        super(length, center, 5); // CHANGER LA VALEUR PAR DEFAUT
        this.isOpen = false;
    }

    public toggleWindow() {
        this.isOpen = !this.isOpen;
    }

    public draw(context: CanvasRenderingContext2D, wallAPoint: Point, wallBPoint: Point, forceHover?: boolean) {
        context.save();

        const color = (this.getHoveredState() || forceHover) ? 'gray' : 'red'

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

        const p1 = new Point(startX, y);
        const p2 = new Point(endX, y);

        context.translate(centerX, centerY);
        context.rotate(rotation); // Apply rotation
        context.translate(-centerX, -centerY);
        
        p1.draw(context, "red");
        p2.draw(context, "red");

        context.beginPath();
        context.moveTo(startX, y);
        context.lineTo(endX, y);
        context.stroke();    

        context.restore();
    }
}
