import {Canvas} from './ux/canvas.js'

export class Game {
static init() {

	Canvas.init(<HTMLCanvasElement>document.querySelector("canvas"))
	} 
}
Game.init()
