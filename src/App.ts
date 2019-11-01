/**
 * @author Simon Drake 2019
 */

import {Draw} from './ux/Draw.js'
import {Game} from './types/Game.js'

/**
 * Main class which initialised the app and runs animation frame
 */
export class App {

	public static game: Game;
	
	/**
	 * Initialising method
	 */
	public static init() {
		// initiate game and pass to canvas
		App.game = new Game()
		Draw.init(<HTMLCanvasElement>document.querySelector("canvas"), App.game)
	}
	
	/**
	 * Game loop
	 */
	public static gameLoop() {
		requestAnimationFrame(App.gameLoop)
	}
}

/**
 * Main method
 */
App.init()
requestAnimationFrame(App.gameLoop)





