/**
 * @author Simon Drake 2019
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Arithmetic } from '../maths/Arithmetic.js';
/**
 * Game class handles game state
 */
export class Game {
    /**
     * Constructor initialises multipliers and boxes
     */
    constructor() {
        /**
         * Game state variables
         */
        this.boxes = {};
        this.spins = 0;
        this.multipliers = [];
        this.unlockedSafes = [];
        this.unlockedMultipliers = new Set();
        this.winSafesStrings = ['', ''];
        this.multipliers.push(Arithmetic.getRandomInt(5) + 15);
        this.completeMultipliers();
    }
    /**
     * Async method uses recursive helper
     * Sets multipliers and boxes
     */
    completeMultipliers() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pushOne().then(() => this.pushOne());
            this.setBoxes();
        });
    }
    /**
     * Finds 2 more random multipliers
     * Recusrive
     */
    pushOne() {
        return __awaiter(this, void 0, void 0, function* () {
            let int = Arithmetic.getRandomInt(5) + 15;
            this.multipliers.indexOf(int) === -1
                ? this.multipliers.push(int)
                : this.pushOne();
        });
    }
    /**
     * Sets 9 boxes to multipliers
     */
    setBoxes() {
        let multipliers = this.multipliers.concat(this.multipliers).concat(this.multipliers);
        for (let i = 1; i <= 8; i++) {
            this.boxes[i] = multipliers[Arithmetic.getRandomInt(multipliers.length)];
            multipliers.splice(multipliers.indexOf(this.boxes[i]), 1);
        }
        this.boxes[9] = multipliers[0];
        // Uncomment to test lose scenario
        this.boxes[1] = 11;
        this.boxes[2] = 12;
        this.boxes[3] = 13;
        this.boxes[4] = 14;
        this.boxes[5] = 15;
        this.boxes[6] = 16;
        this.boxes[7] = 17;
        this.boxes[8] = 18;
        this.boxes[9] = 19;
        // // Uncomment to test win scenario
        // this.boxes[1] = 15
        // this.boxes[2] = 15
        // this.boxes[3] = 15
        // this.boxes[4] = 15
        // this.boxes[5] = 15
        // this.boxes[6] = 15
        // this.boxes[7] = 15
        // this.boxes[8] = 15
        // this.boxes[9] = 15
    }
    /**
     * Method used to find out if player won
     * @param m multiplier
     * @returns boolean, win is true otherwise false
     */
    assessWin(m) {
        if (this.unlockedMultipliers.has(m)) {
            return true;
        }
        else {
            this.unlockedMultipliers.add(m);
            return false;
        }
    }
    /**
     * WinSafes setter
     */
    setWinSafes() {
        this.winSafes = [this.unlockedSafes[this.unlockedSafes.length - 1], this.returnBox(this.boxes[this.unlockedSafes[this.unlockedSafes.length - 1]], this.unlockedSafes)];
    }
    /**
     * Returns box with multiplier
     * @param m multiplier
     * @param boxes boxes object
     */
    returnBox(m, boxes) {
        for (let i = 0; i < boxes.length; i++) {
            if (this.boxes[boxes[i]] == m)
                return boxes[i];
        }
    }
    /**
     * @returns returns unlockes safes string for screen
     */
    getUnlockedSafesString() {
        let s = '';
        for (let i = 0; i < this.unlockedSafes.length; i++) {
            s += `${this.unlockedSafes[i]}   `;
        }
        while (s.length < 16) {
            s += "-   ";
        }
        return s.substr(0, s.length - 3);
    }
}
/**
 * Game static variables
 */
Game.states = {
    "ZERO_SPINS": 0,
    "SPINNING": 1,
    "ANIMATING": 2,
    "SPUN": 3,
    "WON": 4,
    "LOST": 5
};
Game.bet = 10;
