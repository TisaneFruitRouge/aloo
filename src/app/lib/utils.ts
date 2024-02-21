function copyInstanceOfClass(obj: any) {
    const clone = Object.create(Object.getPrototypeOf(obj));

    // Copy all properties
    for (let key of Object.keys(obj)) {
        // Check if the property is a method
        if (typeof obj[key] === 'function') {
        // If it's a method, bind it to the clone object
        clone[key] = obj[key].bind(clone);
        } else {
        // If it's a regular property, just copy it
        clone[key] = obj[key];
        }
    }

    return clone;
}

export { copyInstanceOfClass }