/**
 * Spark object for support dial
 */
export class Spark{
    public x: number;
    public y: number;
    public size: number;
    
    /**
     * @param x x coord
     * @param y y coord
     * @param size size of png
     */
    constructor( x, y, size){
        this.x = x
        this.y = y
        this.size = size
    }
}