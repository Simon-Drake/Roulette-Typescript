import { Canvas } from './ux/canvas.js';
export class Game {
    // insert access modifiers
    // take away static?
    static init() {
        Canvas.init(document.querySelector("canvas"));
    }
    static gameLoop(timestamp) {
        // divide by a 100 and round to get 100 ms interval
        Game.timeElapsed = timestamp;
        // console.log(timestamp)
        requestAnimationFrame(Game.gameLoop);
    }
}
Game.init();
requestAnimationFrame(Game.gameLoop);
