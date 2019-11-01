/**
 * @author Simon Drake 2019
 */


import {Arithmetic} from '../maths/Arithmetic.js'

/**
 * Star object class
 * Used for particle effect in win animation
 */
export class Star{
    
    /**
     * Member variables
     */
    public x: number;
    public y: number;
    public rotation: number = 0;
    public dx: number;
    public dy: number;
    public drotation: number
    public size: number;
    public source: [number, number];
    public distanceFromSource: number = 0;


    /**
     * @param x x coord
     * @param y y coord
     * @param size size of png
     */
    constructor( x, y, size){
        this.x = x
        this.y = y
        this.source = [x,y]

        // Change in position vactor
        this.dx = this.randomDirection() * (Arithmetic.getRandomInt(5) + 2)
        this.dy = this.randomDirection() * (Arithmetic.getRandomInt(5) + 2)
        
        // -0.5 to clamp rotations and put on both sides of 0
        this.drotation = Math.random() - 0.5
        this.size = size
    }

    /**
     * Used to get a random direction between -1 and 1
     */
    private randomDirection(){
        let x = Arithmetic.getRandomInt(2)
                    ? -1
                    : 1
        return x*Math.random()
    }
}