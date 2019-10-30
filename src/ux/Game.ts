import {Arithmetic} from './Arithmetic.js'

export class Game{
    bet: number = 10

    boxes: object = {};
    spins: number = 0;
    result: number;
    multipliers: number[] = [];
    unlockedSafes: number[] = [];
    unlockedMultipliers: any = new Set()
    winSafes: [number, number];
    winSafesStrings: [string, string] = ['', '']

    state: number
    states: object = {
        "ZERO_SPINS" : 0,
        "SPINNING" : 1,
        "SPUN" : 2,
        "WON" : 3, 
        "LOST" : 4
    }
    constructor(){
        this.multipliers.push(Arithmetic.getRandomInt(5)+15)
        this.completeMultipliers()
    }

    // use then not all as they are changing and testing the same list
    public async completeMultipliers(){
        await this.pushOne().then(() => this.pushOne())
        this.setBoxes()
    }

    public async pushOne(){
        let int = Arithmetic.getRandomInt(5)+15
        this.multipliers.indexOf(int) === -1
            ? this.multipliers.push(int)
            : this.pushOne()
    }

    public assessWin(m){
        if (this.unlockedMultipliers.has(m)) {
            return true
        }
        else {
            this.unlockedMultipliers.add(m)
            return false
        }
    }

    public setBoxes(){
        let multipliers = this.multipliers.concat(this.multipliers).concat(this.multipliers)
        for (let i = 1; i <= 8; i++){
            this.boxes[i] = multipliers[Arithmetic.getRandomInt(multipliers.length)]
            multipliers.splice(multipliers.indexOf(this.boxes[i]), 1)
        }
        this.boxes[9] = multipliers[0]

        this.boxes[1] = 11
        this.boxes[2] = 12
        this.boxes[3] = 13
        this.boxes[4] = 14
        this.boxes[5] = 15
        this.boxes[6] = 16
        this.boxes[7] = 17
        this.boxes[8] = 18
        this.boxes[9] = 19
    }

    public setWinSafes(){
        this.winSafes = [this.unlockedSafes[this.unlockedSafes.length-1], this.returnBox(this.boxes[this.unlockedSafes[this.unlockedSafes.length-1]], this.unlockedSafes)]
    }

    // may be better way to do this, new dict?
    private returnBox(m, boxes){
        for(let i = 0; i < boxes.length; i++) {
            if(this.boxes[boxes[i]] == m)
                return boxes[i]
        }
    }

    public getUnlockedSafesString(){
        let s = ''
        for(let i = 0; i < this.unlockedSafes.length; i++){
            s += `${this.unlockedSafes[i]}   `
        }
        while(s.length < 16){
            s += "-   "
        }
        return s.substr(0, s.length-3)
    }
}