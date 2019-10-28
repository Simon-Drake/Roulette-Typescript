// done in 2 classes
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export class Star{
    // access modifier?
    x: number;
    y: number;
    rotation: number = 0;
    dx: number;
    dy: number;
    drotation: number
    size: number;
    source: [number, number];
    distanceFromSource: number = 0;
    constructor( x, y, size){
        this.x = x
        this.y = y
        this.source = [x,y]
        this.dx = this.randomDirection() * (getRandomInt(5) + 2)
        this.dy = this.randomDirection() * (getRandomInt(5) + 2)
        // -0.5 to clamp rotations and put on both sides of 0
        this.drotation = Math.random() - 0.5
        this.size = size
    }

    private randomDirection(){
        let x = getRandomInt(2)
                    ? -1
                    : 1
        return x*Math.random()
    }
}