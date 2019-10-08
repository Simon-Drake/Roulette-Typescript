import { Canvas } from './ux/canvas.js';
export class Game {
    static init() {
        Canvas.init(document.querySelector("canvas"));
    }
}
Game.init();
