// done in 2 classes
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
export class Star {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.dx = this.randomDirection();
        this.dy = this.randomDirection();
        this.size = size;
    }
    randomDirection() {
        let x = getRandomInt(2)
            ? -1
            : 1;
        return x * Math.random();
    }
}
