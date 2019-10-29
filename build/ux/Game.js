var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// done in 2 classes
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
export class Game {
    constructor() {
        this.bet = 10;
        this.boxes = {};
        this.spins = 0;
        this.multipliers = [];
        this.unlockedSafes = [];
        this.unlockedMultipliers = new Set();
        this.winSafesStrings = ['', ''];
        this.states = {
            "ZERO_SPINS": 0,
            "SPINNING": 1,
            "SPUN": 2,
            "WON": 3,
            "LOST": 4
        };
        this.multipliers.push(getRandomInt(5) + 15);
        this.completeMultipliers();
    }
    // use then not all as they are changing and testing the same list
    completeMultipliers() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pushOne().then(() => this.pushOne());
            this.setBoxes();
        });
    }
    pushOne() {
        return __awaiter(this, void 0, void 0, function* () {
            let int = getRandomInt(5) + 15;
            this.multipliers.indexOf(int) === -1
                ? this.multipliers.push(int)
                : this.pushOne();
        });
    }
    assessWin(m) {
        if (this.unlockedMultipliers.has(m)) {
            return true;
        }
        else {
            this.unlockedMultipliers.add(m);
            return false;
        }
    }
    setBoxes() {
        let multipliers = this.multipliers.concat(this.multipliers).concat(this.multipliers);
        for (let i = 1; i <= 8; i++) {
            this.boxes[i] = multipliers[getRandomInt(multipliers.length)];
            multipliers.splice(multipliers.indexOf(this.boxes[i]), 1);
        }
        this.boxes[9] = multipliers[0];
        this.boxes[1] = 15;
        this.boxes[2] = 15;
        this.boxes[3] = 15;
        this.boxes[4] = 15;
        this.boxes[5] = 15;
        this.boxes[6] = 15;
        this.boxes[7] = 15;
        this.boxes[8] = 15;
        this.boxes[9] = 15;
    }
    setWinSafes() {
        this.winSafes = [this.unlockedSafes[this.unlockedSafes.length - 1], this.returnBox(this.boxes[this.unlockedSafes[this.unlockedSafes.length - 1]], this.unlockedSafes)];
    }
    // may be better way to do this, new dict?
    returnBox(m, boxes) {
        for (let i = 0; i < boxes.length; i++) {
            if (this.boxes[boxes[i]] == m)
                return boxes[i];
        }
    }
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
