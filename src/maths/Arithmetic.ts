/**
 * @author Simon Drake 2019
 */

/**
 * Class used for simple mathematics
 */
export class Arithmetic {

    /**
     * Converts degrees to radians
     * @param deg degrees
     */
    public static degToRadians(deg){
        return deg*Math.PI/180
    }

    /**
     * Uses rotation of dial to get result
     * @param rotation rotation of dial
     */
    public static getResult(rotation){
        let x = (2 - Math.round(rotation/0.7) + 9) % 9
        return x == 0
                    ? 9
                    : x
    }  

    /**
     * Returns random number between 0 and max
     * @param max max integer + 1
     */
    public static getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}