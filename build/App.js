/**
 * @author Simon Drake 2019
 */
import { Draw } from './ux/Draw.js';
import { Game } from './types/Game.js';
/**
 * Main class which initialised the app and runs animation frame
 */
export class App {
    /**
     * Initialising method
     */
    static init() {
        // initiate game and pass to canvas
        App.game = new Game();
        Draw.init(document.querySelector("canvas"), App.game);
    }
    /**
     * Game loop
     */
    static gameLoop() {
        requestAnimationFrame(App.gameLoop);
    }
}
/**
 * Main method
 */
App.init();
requestAnimationFrame(App.gameLoop);
