import {Canvas} from './ux/canvas.js'

export class Game {
	public static timeElapsed: number;
	// insert access modifiers
	// take away static?
	static init() {

		Canvas.init(<HTMLCanvasElement>document.querySelector("canvas"))
		}
	static gameLoop(timestamp) {
		// divide by a 100 and round to get 100 ms interval
		Game.timeElapsed = timestamp
		// console.log(timestamp)
		requestAnimationFrame(Game.gameLoop)
	}
}
Game.init()
requestAnimationFrame(Game.gameLoop)
