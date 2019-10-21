export class Spark{
    x: number;
    y: number;
    radius: number;
    // remove expanding?
    expanding: boolean;
    constructor( x, y, radius){
        this.x = x
        this.y = y
        this.radius = radius
        this.expanding = true
    }
}