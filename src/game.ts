import {Canvas} from './ux/canvas.js'

export class Game {
	public static timeElapsed: number;
	// insert access modifiers
	// take away static?
	static init() {

		Canvas.init(<HTMLCanvasElement>document.querySelector("canvas"))
		}
	static gameLoop(timestamp) {
		Game.timeElapsed = timestamp/1000
		requestAnimationFrame(Game.gameLoop)
	}
}
Game.init()
requestAnimationFrame(Game.gameLoop)
