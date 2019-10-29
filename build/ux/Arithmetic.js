export class Arithmetic {
    static degToRadians(deg) {
        return deg * Math.PI / 180;
    }
    static getResult(rotation) {
        let x = (2 - Math.round(rotation / 0.7) + 9) % 9;
        return x == 0
            ? 9
            : x;
    }
    static getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}
