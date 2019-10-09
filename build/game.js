import { Canvas } from './ux/canvas.js';
export class Game {
    // insert access modifiers
    // take away static?
    static init() {
        Canvas.init(document.querySelector("canvas"));
    }
    static gameLoop(timestamp) {
        Game.timeElapsed = timestamp / 1000;
        requestAnimationFrame(Game.gameLoop);
    }
}
Game.init();
requestAnimationFrame(Game.gameLoop);
