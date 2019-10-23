import { Canvas } from './ux/canvas.js';
export class Game {
    // insert access modifiers
    // take away static?
    static init() {
        Canvas.init(document.querySelector("canvas"));
    }
    static gameLoop(timestamp) {
        // divide by a 100 and round to get 100 ms interval
        // let mod = Math.round(timestamp/100)%5
        // if(mod === 0 && Canvas.drawn){
        // 	Canvas.changeLights()
        // }
        Game.timeElapsed = timestamp;
        // console.log(timestamp)
        requestAnimationFrame(Game.gameLoop);
    }
}
Game.init();
requestAnimationFrame(Game.gameLoop);
