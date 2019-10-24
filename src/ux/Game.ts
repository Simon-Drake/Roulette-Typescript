// done in 2 classes
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export class Game{
    boxes: object;
    multipliers: number[] = [];
    unlockedSafes: number[] = [];
    
    constructor(){
        this.multipliers.push(getRandomInt(5)+15)
        this.completeMultipliers()
        this.boxes = {}
    }

    // use then not all as they are changing and testing the same list
    public async completeMultipliers(){
        await Promise.all([this.pushOne(), this.pushOne()])
        this.setBoxes()
    }

    public async pushOne(){
        let int = getRandomInt(5)+15
        this.multipliers.indexOf(int) === -1
            ? this.multipliers.push(int)
            : this.pushOne()
    }

    public setBoxes(){
        let multipliers = this.multipliers.concat(this.multipliers).concat(this.multipliers)
        for (let i = 1; i <= 8; i++){
            this.boxes[i] = multipliers[Math.floor(Math.random()*this.multipliers.length)]
            multipliers.splice(multipliers.indexOf(this.boxes[i]), 1)
        }
        this.boxes[9] = multipliers[0]
    }
}