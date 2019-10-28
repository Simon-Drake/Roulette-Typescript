// done in 2 classes
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
export class Star {
    constructor(x, y, size) {
        this.rotation = 0;
        this.distanceFromSource = 0;
        this.x = x;
        this.y = y;
        this.source = [x, y];
        this.dx = this.randomDirection() * (getRandomInt(5) + 2);
        this.dy = this.randomDirection() * (getRandomInt(5) + 2);
        // -0.5 to clamp rotations and put on both sides of 0
        this.drotation = Math.random() - 0.5;
        this.size = size;
    }
    randomDirection() {
        let x = getRandomInt(2)
            ? -1
            : 1;
        return x * Math.random();
    }
}
