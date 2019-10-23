import {Canvas} from './ux/Canvas.js'
import {Game} from './ux/Game.js'


export class App {
	public static timeElapsed: number;
	// insert access modifiers
	// take away static?
	static init() {
		// initiate game and pass to canvas
		let game = new Game()
		Canvas.init(<HTMLCanvasElement>document.querySelector("canvas"), game)
		}
	static gameLoop(timestamp) {
		App.timeElapsed = timestamp
		requestAnimationFrame(App.gameLoop)
	}
}
App.init()
requestAnimationFrame(App.gameLoop)





