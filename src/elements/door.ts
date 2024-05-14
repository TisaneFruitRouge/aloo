import { InsetElement } from "./inset-element";
import { Point } from "./point";

export class Door extends InsetElement {

    public constructor(
        length: number,
        center: Point,
    ) {
        super(length, center, 5); // CHANGER LA VALEUR PAR DEFAUT
    }

    public draw(context: CanvasRenderingContext2D) {

    }
}
