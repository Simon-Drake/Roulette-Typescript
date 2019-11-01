import {Arithmetic} from '../maths/Arithmetic.js'

/**
 * Game class handles game state
 */
export class Game{
    
    /**
     * Game static variables
     */
    public static states: object = {
        "ZERO_SPINS" : 0,
        "SPINNING" : 1,
        "ANIMATING" : 2,
        "SPUN" : 3,
        "WON" : 4,
        "LOST" : 5
    }
    public static bet: number = 10

    /**
     * Game state variables
     */
    public boxes: object = {};
    public spins: number = 0;
    public result: number;
    public multipliers: number[] = [];
    public unlockedSafes: number[] = [];
    public unlockedMultipliers: any = new Set()
    public winSafes: [number, number];
    public winSafesStrings: [string, string] = ['', '']
    public state: number

    /**
     * Constructor initialises multipliers and boxes
     */
    constructor(){
        this.multipliers.push(Arithmetic.getRandomInt(5)+15)
        this.completeMultipliers()
    }

    /**
     * Async method uses recursive helper
     * Sets multipliers and boxes
     */
    public async completeMultipliers(){
        await this.pushOne().then(() => this.pushOne())
        this.setBoxes()
    }

    /**
     * Finds 2 more random multipliers
     * Recusrive
     */
    public async pushOne(){
        let int = Arithmetic.getRandomInt(5)+15
        this.multipliers.indexOf(int) === -1
            ? this.multipliers.push(int)
            : this.pushOne()
    }

    /**
     * Sets 9 boxes to multipliers
     */
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

    /**
     * Method used to find out if player won
     * @param m multiplier
     * @returns boolean, win is true otherwise false
     */
    public assessWin(m){
        if (this.unlockedMultipliers.has(m)) {
            return true
        }
        else {
            this.unlockedMultipliers.add(m)
            return false
        }
    }

    /**
     * WinSafes setter
     */
    public setWinSafes(){
        this.winSafes = [this.unlockedSafes[this.unlockedSafes.length-1], this.returnBox(this.boxes[this.unlockedSafes[this.unlockedSafes.length-1]], this.unlockedSafes)]
    }

    /**
     * Returns box with multiplier
     * @param m multiplier
     * @param boxes boxes object
     */
    private returnBox(m, boxes){
        for(let i = 0; i < boxes.length; i++) {
            if(this.boxes[boxes[i]] == m)
                return boxes[i]
        }
    }

    /**
     * @returns returns unlockes safes string for screen
     */
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