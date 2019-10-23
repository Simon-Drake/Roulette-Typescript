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
        this.multipliers = [];
        this.multipliers.push(getRandomInt(6) + 15);
        this.completeMultipliers();
        this.boxes = {};
    }
    completeMultipliers() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([this.pushOne(), this.pushOne()]);
            this.setBoxes();
        });
    }
    pushOne() {
        return __awaiter(this, void 0, void 0, function* () {
            let int = getRandomInt(6) + 15;
            this.multipliers.indexOf(int) === -1
                ? this.multipliers.push(int)
                : this.pushOne();
        });
    }
    setBoxes() {
        let multipliers = this.multipliers.concat(this.multipliers).concat(this.multipliers);
        for (let i = 1; i <= 8; i++) {
            this.boxes[i] = multipliers[Math.floor(Math.random() * this.multipliers.length)];
            multipliers.splice(multipliers.indexOf(this.boxes[i]), 1);
        }
        this.boxes[9] = multipliers[0];
    }
}
