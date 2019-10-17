export class Spark{
    values: number[];
    radius: number;
    expanding: boolean;
    constructor( values, radius){
        this.values = values
        this.radius = radius
        this.expanding = true
    }
}