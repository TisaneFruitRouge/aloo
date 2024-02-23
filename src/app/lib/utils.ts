import Point from "../../models/point";

function copyInstanceOfClass(obj: any) {
    const clone = Object.create(Object.getPrototypeOf(obj));

    // Copy all properties
    for (let key of Object.keys(obj)) {
        // Check if the property is a method
        if (typeof obj[key] === 'function') {
            // If it's a method, bind it to the clone object
            clone[key] = obj[key].bind(clone);
        } else if (typeof obj[key] === "object") {
            clone[key] = copyInstanceOfClass(obj[key]);
        } else {
            // If it's a regular property, just copy it
            clone[key] = obj[key];
        }
    }
    
    return clone;
}

function drawLine(context: CanvasRenderingContext2D, startPoint: Point, endPoint: Point) {
    // Start a new Path
    context.beginPath();
    context.moveTo(startPoint.x, startPoint.y);
    context.lineTo(endPoint.x, endPoint.y);

    // Draw the Path
    context.stroke();  
}

export { copyInstanceOfClass, drawLine }