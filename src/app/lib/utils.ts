import { Point } from "../../elements/point";
import { WIDTH } from "./constants";

function copyInstanceOfClass(obj: any): any {
    if (Array.isArray(obj)) {
        // Create a new array and copy each element
        return obj.map(element => copyInstanceOfClass(element));
    } else if (typeof obj === 'object' && obj !== null) {
        const clone = Object.create(Object.getPrototypeOf(obj));

        // Copy all properties
        for (let key of Object.keys(obj)) {
            // Check if the property is a method
            if (typeof obj[key] === 'function') {
                // If it's a method, bind it to the clone object
                clone[key] = obj[key].bind(clone);
            } else if (typeof obj[key] === "object") {
                // Recursive copy for nested objects
                clone[key] = copyInstanceOfClass(obj[key]);
            } else {
                // If it's a regular property, just copy it
                clone[key] = obj[key];
            }
        }

        return clone;
    } else {
        // For primitive types, simply return the value
        return obj;
    }
}


function drawLine(context: CanvasRenderingContext2D, startPoint: Point, endPoint: Point) {
    
    // Start a new Path
    context.save();

    context.beginPath();
    context.moveTo(startPoint.getX(), startPoint.getY());
    context.lineTo(endPoint.getX(), endPoint.getY());

    context.lineWidth = WIDTH;

    // Draw the Path
    context.stroke();  

    context.restore();
}

export { copyInstanceOfClass, drawLine }