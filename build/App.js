import { Draw } from './ux/Draw.js';
import { Game } from './ux/Game.js';
export class App {
    // insert access modifiers
    // take away static?
    static init() {
        // initiate game and pass to canvas
        App.game = new Game();
        Draw.init(document.querySelector("canvas"), App.game);
    }
    static gameLoop(timestamp) {
        if (App.game.state == Game.states["LOST"]) {
        }
        App.timeElapsed = timestamp;
        requestAnimationFrame(App.gameLoop);
    }
}
App.init();
requestAnimationFrame(App.gameLoop);
