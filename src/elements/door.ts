import { WIDTH } from "../app/lib/constants";
import { InsetElement } from "./inset-element";
import { Point } from "./point";

export class Door extends InsetElement {

    public constructor(
        length: number,
        center: Point,
        thickness: number
    ) {
        super(length, center, thickness); // CHANGER LA VALEUR PAR DEFAUT
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
