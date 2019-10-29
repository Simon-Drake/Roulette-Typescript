export class Arithmetic {

    public static degToRadians(deg){
        return deg*Math.PI/180
    }

    public static getResult(rotation){
        let x = (2 - Math.round(rotation/0.7) + 9) % 9
        return x == 0
                    ? 9
                    : x
    }  
}