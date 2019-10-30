import {Canvas} from './ux/Canvas.js'
import {Game} from './ux/Game.js'


export class App {
	public static timeElapsed: number;
	public static game: Game;
	// insert access modifiers
	// take away static?
	static init() {
		// initiate game and pass to canvas
		App.game = new Game()
		Canvas.init(<HTMLCanvasElement>document.querySelector("canvas"), App.game)
		}
	static gameLoop(timestamp) {
		if(App.game.state == App.game.states["LOST"]){
			setTimeout(() => Canvas.implementLoss(), 3000)
		}
		App.timeElapsed = timestamp
		requestAnimationFrame(App.gameLoop)
	}
}
App.init()
requestAnimationFrame(App.gameLoop)





