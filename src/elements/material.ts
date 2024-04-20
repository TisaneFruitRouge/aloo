class Material {
    name: string;
    color: string;
    private id = crypto.randomUUID();

    constructor(
        name: string,
        color: string
    ) {
        this.name = name;
        this.color = color;
    }
}