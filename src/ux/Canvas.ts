import {Spark} from './Spark.js'
import {Game} from './Game.js'
import {Star} from './Star.js'



// done in 2 classes
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export class Canvas {

    // put semicolons

    // Parameters
    public static canvasElement: HTMLCanvasElement;
    public static context: CanvasRenderingContext2D;

    // Dimensions
    public static width: number;
    public static height: number;
    public static maxWidth: number = 916;
    public static maxHeight: number = 623;
    public static widthToHeightRatio: number = Canvas.maxWidth / Canvas.maxHeight
    public static heightToWidthRatio: number = Canvas.maxHeight / Canvas.maxWidth
    public static shrinkFactor: number;
    public static radiusSupport: number;
    public static radiusSpin: number;
    public static radiusDial: number;
    public static openSafeXTranslate: number = -35
    public static openSafeYTranslate: number = -25
    public static priseXTranslate: number = Canvas.openSafeXTranslate + 10
    public static priseYTranslate: number = Canvas.openSafeYTranslate + 6
    public static fontXTranslate: number = Canvas.priseXTranslate + 65
    public static fontYTranslate: number = Canvas.priseYTranslate + 110
    public static starXTranslate: number = Canvas.fontXTranslate - 15
    public static starYTranslate: number = Canvas.fontYTranslate - 70
    public static thirdLightsWidth: number;
    public static thirdDialWidth: number;



    // How far left and how far down as a ratio of the size of the Canvas
    // Needed for browser resizing 
    public static ratios: object = {
        "safe1" : [(50/Canvas.maxWidth), (173/Canvas.maxHeight)],
        "safe2" : [(220/Canvas.maxWidth), (173/Canvas.maxHeight)],
        "safe3" : [(390/Canvas.maxWidth), (173/Canvas.maxHeight)],
        "safe4" : [(50/Canvas.maxWidth), (320/Canvas.maxHeight)],
        "safe5" : [(220/Canvas.maxWidth), (320/Canvas.maxHeight)],
        "safe6" : [(390/Canvas.maxWidth), (320/Canvas.maxHeight)],
        "safe7" : [(50/Canvas.maxWidth), (467/Canvas.maxHeight)],
        "safe8" : [(220/Canvas.maxWidth), (467/Canvas.maxHeight)],
        "safe9" : [(390/Canvas.maxWidth), (467/Canvas.maxHeight)],
        "screen" : [(578/Canvas.maxWidth), (183/Canvas.maxHeight)],
        "winScreen" : [(600/Canvas.maxWidth), (183/Canvas.maxHeight)],
        "supportDial" : [(582/Canvas.maxWidth), (280/Canvas.maxHeight)],
        "dial" : [(593/Canvas.maxWidth), (318/Canvas.maxHeight)],
        "marker" : [(709/Canvas.maxWidth), (270/Canvas.maxHeight)],
        "spin" : [(695/Canvas.maxWidth), (420/Canvas.maxHeight)],
        "lights1" : [(582/Canvas.maxWidth), (270/Canvas.maxHeight)],
        "lights2" : [(758/Canvas.maxWidth), (270/Canvas.maxHeight)],
        "spinning" : [(270/Canvas.maxWidth), (115/Canvas.maxHeight)],
        "instructions" : [(65/Canvas.maxWidth), (30/Canvas.maxHeight)],
        "instructionsTop" : [(68/Canvas.maxWidth), (65/Canvas.maxHeight)],
        "instructionsBottom" : [(68/Canvas.maxWidth), (110/Canvas.maxHeight)],
        "unlockedSafes" : [(642/Canvas.maxWidth), (243/Canvas.maxHeight)]
    }

    // Image cache references
    public static lights: HTMLImageElement = new Image()
    public static background: HTMLImageElement = new Image()
    public static safe: HTMLImageElement = new Image()
    public static safeOpen: HTMLImageElement = new Image()
    public static screen: HTMLImageElement = new Image()
    public static supportDial: HTMLImageElement = new Image()
    public static sparkSafe: HTMLImageElement = new Image()
    public static dial: HTMLImageElement = new Image()
    public static spin: HTMLImageElement = new Image()
    public static coin: HTMLImageElement = new Image()
    public static diamond: HTMLImageElement = new Image()
    public static gold: HTMLImageElement = new Image()
    public static notes: HTMLImageElement = new Image()
    public static ring: HTMLImageElement = new Image()
    public static winScreen: HTMLImageElement = new Image()
    public static marker: HTMLImageElement = new Image()
    public static star: HTMLImageElement = new Image()


    public static images: HTMLElement[] = [Canvas.lights, Canvas.background, Canvas.safe, Canvas.safeOpen, Canvas.gold, Canvas.diamond,
        Canvas.coin, Canvas.ring, Canvas.notes, Canvas.sparkSafe, Canvas.screen, Canvas.supportDial, Canvas.dial, Canvas.spin, Canvas.marker, 
        Canvas.winScreen, Canvas.star]


        // Runtime state variables
    public static count: number = Canvas.images.length;
    public static fontsLoaded: boolean = false;
    public static spinOn: boolean = true;
    public static won: boolean = false;
    public static spinning: boolean = false;
    public static initialDraw: boolean = true;
    public static resizing: boolean = false;


    public static behindLightsOne: ImageData;
    public static behindLightsTwo: ImageData;
    public static behindSpin: ImageData;
    public static behindMarker: ImageData;
    public static behindInstructions: ImageData;
    public static behindSafes: object = {}

    // do i need center support?
    public static centerSupport: [number,number];
    public static centerDial: [number,number];
    public static sparks: Spark[] = [];
    public static stars: Star[] = [];
    public static currentRotation: number = 0;
    public static game: Game;


    // in app?
    public static glowInterval: number;
    public static flashInterval: number;
    

    // May be able to do this better
    public static xLights1: number = 0;
    public static xLights2: number = 1;

    public static init(el: HTMLCanvasElement, game) {


        Canvas.game = game


        Canvas.loadFonts()

        this.lights.src = '../../images/leds_safe_dial_minigame.png'
        this.background.src = '../../images/background_safe_minigame.png'
        this.safe.src = '../../images/safe_minigame.png'
        this.screen.src = '../../images/screen_safe_minigame.png'
        this.supportDial.src = '../../images/support_safe_dial_minigame.png'
        this.sparkSafe.src = '../../images/spark_safe.png'
        this.dial.src = '../../images/safe_dial_minigame.png'
        this.spin.src = '../../images/text_spin_safe_dial_minigame.png'
        this.safeOpen.src =  '../../images/safe_open_minigame.png'
        this.coin.src =  '../../images/coins.png'
        this.marker.src =  '../../images/marker.png'
        this.ring.src =  '../../images/ring.png'
        this.notes.src =  '../../images/notes.png'
        this.gold.src =  '../../images/gold.png'
        this.diamond.src =  '../../images/diamond.png'
        this.winScreen.src =  '../../images/screen_safe_win.png'
        this.star.src =  '../../images/star.png'



        this.canvasElement = el

        // need false?
        window.addEventListener('resize', function(){
            Canvas.resizing = true
            clearInterval(Canvas.glowInterval)
            clearInterval(Canvas.flashInterval)
            Canvas.deleteSparks()
            Canvas.sizeCanvas()
            Canvas.glowInterval = setInterval(Canvas.supportGlow, 450)
            Canvas.flashInterval = setInterval(Canvas.flashSpin, 500)
            setTimeout(function(){Canvas.resizing = false}, 50)
        })
        // need to add if clicks again while spinning do nothing
        el.addEventListener('click', function(e){
            if(Canvas.game.state == Canvas.game.states["ZERO_SPINS"] || Canvas.game.state == Canvas.game.states["SPUN"])
                Canvas.intersect(e.offsetX, e.offsetY)
        })

        Canvas.context = el.getContext("2d");

        this.background.onload = this.dial.onload = this.lights.onload = this.safe.onload = this.supportDial.onload = this.coin.onload =
                this.ring.onload = this.notes.onload = this.spin.onload = this.safeOpen.onload = this.screen.onload = this.sparkSafe.onload = 
                this.gold.onload = this.diamond.onload = this.winScreen.onload = this.marker.onload = this.star.onload = Canvas.counter

        setInterval(Canvas.changeLights, 1000)
        Canvas.glowInterval = setInterval(Canvas.supportGlow, 450)
        Canvas.flashInterval = setInterval(Canvas.flashSpin, 500)

        Canvas.game.state = Canvas.game.states["ZERO_SPINS"]
    }


    /// JUST A COMMMENT : need to play with radiuses still, some sparks is getting left ourside
    public static intersect(x, y){
        let inside = Math.sqrt((Canvas.centerSupport[0]-x)**2 + (Canvas.centerSupport[1]-y)**2) < Canvas.radiusSpin
        if(inside){
            Canvas.game.state = Canvas.game.states["SPINNING"];
            Canvas.spinOn = false
            Canvas.game.spins += 1
            // delete all current sparks
            Canvas.deleteSparks()
            clearInterval(Canvas.glowInterval)
            clearInterval(Canvas.flashInterval)
            Canvas.drawBackgroundAndSupport()
            // dont need to rotate here, right?
            let state
            let antiClockwise = Math.round(Math.random())*Math.random()*Math.PI
            antiClockwise
            ? state = 0
            : state = 1
            Canvas.writeWords(110)
            Canvas.spinWheel(Canvas.currentRotation, antiClockwise, -Canvas.degToRadians(360/9*getRandomInt(9)), Canvas.degToRadians(360/9*getRandomInt(9)), state)
        }
    }



    // should be static
    public static degToRadians(deg){
        return deg*Math.PI/180
    }

    public static getResult(rotation){
        // hard
        return Canvas.ifZeroReturn9((2 - Math.round(rotation/0.7) + 9) % 9)
    }

    public static ifZeroReturn9(n){
        return n == 0 ? 9 : n
    }

    // 0.7 is one slice
    // put in a state variable
    // shouldnt be static?
    public static spinWheel(rotation, antiClockwise, clockwise, antiClockwise2, state){
        switch (state) {
            case 0: {
                rotation += 0.05;
                Canvas.rotate(rotation, 0)
                rotation >= antiClockwise
                ? setTimeout(function(){Canvas.spinWheel(rotation, antiClockwise, clockwise, antiClockwise2, state+1)}, 20)
                : setTimeout(function(){Canvas.spinWheel(rotation, antiClockwise, clockwise, antiClockwise2, state)}, 20)
                break;
            }
            case 1: {
                rotation -= 0.05;
                Canvas.rotate(rotation, 0)
                rotation <= clockwise
                ? setTimeout(function(){Canvas.spinWheel(rotation, antiClockwise, clockwise, antiClockwise2, state+1)}, 20)
                : setTimeout(function(){Canvas.spinWheel(rotation, antiClockwise, clockwise, antiClockwise2, state)}, 20)
                break;
            }
            case 2 : {
                rotation += 0.05;
                Canvas.rotate(rotation, 0)
                rotation >= (antiClockwise2 + clockwise - 0.01)
                ? Canvas.evaluateScore(rotation)
                : setTimeout(function(){Canvas.spinWheel(rotation, antiClockwise, clockwise, antiClockwise2, state)}, 20)
                break;
            }
        }
    }
    
    public static evaluateScore(rotation){
        Canvas.game.state = Canvas.game.states["SPUN"]

        // Some DRY stuff to handle here 
        Canvas.currentRotation = rotation
        let result = Canvas.getResult(rotation)
        if(Canvas.game.unlockedSafes.indexOf(result) === -1) {
            Canvas.game.unlockedSafes.push(result)
            Canvas.openSafe(result)
            Canvas.assessWin(Canvas.game.boxes[result])
        }
        else {
            Canvas.glowInterval = setInterval(Canvas.supportGlow, 450)
            Canvas.flashInterval = setInterval(Canvas.flashSpin, 500)
        }
    }

    // may be better way to do this, new dict?
    public static returnBox(m, boxes){
        for(let i = 0; i < boxes.length; i++) {
            if(Canvas.game.boxes[boxes[i]] == m)
                return boxes[i]
        }
    }

    public static assessWin(m){
        if (Canvas.game.unlockedMultipliers.has(m)) {
            Canvas.game.state = Canvas.game.states["WON"]
            Canvas.won = true
            Canvas.handleWin()
            Canvas.game.winSafes = [Canvas.game.unlockedSafes[Canvas.game.unlockedSafes.length-1], Canvas.returnBox(m, Canvas.game.unlockedSafes.splice(0, Canvas.game.unlockedSafes.length-1))]
            Canvas.game.winImage = Canvas.mapMultiplierToImage(Canvas.game.boxes[Canvas.game.winSafes[0]])
            Canvas.starParticles()
            setInterval(function(){Canvas.drawStars(true)}, 100)
            setInterval(function(){Canvas.starParticles()}, 2500)

        }
        else {
            Canvas.game.unlockedMultipliers.add(m)
            Canvas.redDial(0)
        }
    }
    public static handleWin(){
        // better place to put i?
        Canvas.spinOn = false

        Canvas.deleteSparks()
        clearInterval(Canvas.glowInterval)
        clearInterval(Canvas.flashInterval)


        Canvas.writeWords(75)

        setInterval(function(){Canvas.winSpin(0.18, true)}, 35)        
    }


    public static starParticles(){
        // done twice
        let s1 = "safe" + Canvas.game.winSafes[0].toString()
        let s2 = "safe" + Canvas.game.winSafes[1].toString()

        for (let i = 0; i < 5; i++){
            Canvas.stars.push(new Star(Canvas.ratios[s1][0]*Canvas.width + Canvas.starXTranslate*Canvas.shrinkFactor, Canvas.ratios[s1][1]*Canvas.height + Canvas.starYTranslate*Canvas.shrinkFactor, 20+80*Math.random()))
            Canvas.stars.push(new Star(Canvas.ratios[s2][0]*Canvas.width + Canvas.starXTranslate*Canvas.shrinkFactor, Canvas.ratios[s2][1]*Canvas.height + Canvas.starYTranslate*Canvas.shrinkFactor, 20+80*Math.random()))
        }
    }

    public static fillCanvasColour(){
        Canvas.context.fillStyle = 'silver'
        Canvas.context.fillRect(0, 0, Canvas.width, Canvas.height)
    }

    public static drawStars(move){

        // done twice
        let s1 = "safe" + Canvas.game.winSafes[0].toString()
        let s2 = "safe" + Canvas.game.winSafes[1].toString()

        let image = Canvas.game.winImage

        Canvas.fillCanvasColour()
        Canvas.drawImages()
        Canvas.winSpin(0, false)
        Canvas.drawLights()
        Canvas.writeWords(75)


        for (let i = 0; i < Canvas.stars.length; i++){
            if (Canvas.stars[i]) {
                if (Canvas.stars[i].distanceFromSource > 190) {
                    delete Canvas.stars[i]
                }
                else {
                    if(move){
                        Canvas.stars[i].x += Canvas.stars[i].dx
                        Canvas.stars[i].y += Canvas.stars[i].dy
                        Canvas.stars[i].rotation += Canvas.stars[i].drotation
                        Canvas.stars[i].distanceFromSource = Math.sqrt((Canvas.stars[i].x - Canvas.stars[i].source[0])**2 + (Canvas.stars[i].y - Canvas.stars[i].source[1])**2)
                    }
                    Canvas.rotateStar(Canvas.stars[i])
                }
            }
        }

        Canvas.context.drawImage(image, 0, 0, image.width/2, image.height, Canvas.ratios[s1][0]*Canvas.width + Canvas.priseXTranslate*Canvas.shrinkFactor,  Canvas.ratios[s1][1]*Canvas.height + Canvas.priseYTranslate*Canvas.shrinkFactor, 
            image.width*Canvas.shrinkFactor/2, image.height*Canvas.shrinkFactor);

        Canvas.context.drawImage(image, 0, 0, image.width/2, image.height, Canvas.ratios[s2][0]*Canvas.width + Canvas.priseXTranslate*Canvas.shrinkFactor,  Canvas.ratios[s2][1]*Canvas.height + Canvas.priseYTranslate*Canvas.shrinkFactor, 
            image.width*Canvas.shrinkFactor/2, image.height*Canvas.shrinkFactor);
    }

    public static rotateStar(star){
        let centerX = star.x + star.size*Canvas.shrinkFactor/2
        let centerY = star.y + star.size*Canvas.shrinkFactor/2
        Canvas.context.translate(centerX, centerY)
        Canvas.context.rotate(star.rotation)
        Canvas.context.globalAlpha = star.distanceFromSource*-0.005 + 1
        Canvas.context.drawImage(Canvas.star, star.x - centerX,  star.y - centerY, star.size*Canvas.shrinkFactor, star.size*Canvas.shrinkFactor)
        Canvas.context.setTransform(1,0,0,1,0,0)
        Canvas.context.globalAlpha = 1
    }

    public static winSpin(increment, drawStars){
        Canvas.drawBackgroundAndSupport()
        Canvas.context.putImageData(Canvas.behindMarker, Canvas.ratios["marker"][0]*Canvas.width, Canvas.ratios["marker"][1]*Canvas.height)
        Canvas.context.drawImage(Canvas.marker, Canvas.marker.width/2, 0, Canvas.marker.width/2, Canvas.marker.height, Canvas.ratios["marker"][0]*Canvas.width,  Canvas.ratios["marker"][1]*Canvas.height, Canvas.marker.width*Canvas.shrinkFactor/2, Canvas.marker.height*Canvas.shrinkFactor)
        Canvas.currentRotation = Canvas.currentRotation + increment
        Canvas.rotate(Canvas.currentRotation, Canvas.thirdDialWidth*2)
        if(drawStars)
            Canvas.drawStars(false)
    }

    public static redDial(counter){
        if (counter == 10){
            Canvas.glowInterval = setInterval(Canvas.supportGlow, 450)
            Canvas.flashInterval = setInterval(Canvas.flashSpin, 500)
        }
        else {
            Canvas.drawBackgroundAndSupport()
            if (counter % 2 == 0) {
                Canvas.rotate(Canvas.currentRotation, Canvas.thirdDialWidth)
                // hard
                Canvas.context.drawImage(Canvas.marker, 0, 0, Canvas.marker.width/2, Canvas.marker.height, Canvas.ratios["marker"][0]*Canvas.width,  Canvas.ratios["marker"][1]*Canvas.height, Canvas.marker.width*Canvas.shrinkFactor/2, Canvas.marker.height*Canvas.shrinkFactor)
            }
            else {
                Canvas.context.putImageData(Canvas.behindMarker, Canvas.ratios["marker"][0]*Canvas.width, Canvas.ratios["marker"][1]*Canvas.height)
                Canvas.rotate(Canvas.currentRotation, 0)
            }
        counter ++;
        setTimeout(function(){Canvas.redDial(counter)}, 200)
        }
    }

    public static openSafe(result){
        let s = "safe" + result.toString()

        Canvas.writeWords(110)

        // need to scale for browser resize
        Canvas.context.putImageData(Canvas.behindSafes[s], Canvas.ratios[s][0]*Canvas.width, Canvas.ratios[s][1]*Canvas.height)

        Canvas.context.drawImage(Canvas.safeOpen, Canvas.ratios[s][0]*Canvas.width + Canvas.openSafeXTranslate*Canvas.shrinkFactor,  Canvas.ratios[s][1]*Canvas.height + Canvas.openSafeYTranslate*Canvas.shrinkFactor, 
                    Canvas.safeOpen.width*Canvas.shrinkFactor, Canvas.safeOpen.height*Canvas.shrinkFactor);
        
        let image = Canvas.mapMultiplierToImage(Canvas.game.boxes[result])
        // /2 once
        Canvas.context.drawImage(image, 0, 0, image.width/2, image.height, Canvas.ratios[s][0]*Canvas.width + Canvas.priseXTranslate*Canvas.shrinkFactor,  Canvas.ratios[s][1]*Canvas.height + Canvas.priseYTranslate*Canvas.shrinkFactor, 
            image.width*Canvas.shrinkFactor/2, image.height*Canvas.shrinkFactor);

        let fontSize = 65*Canvas.shrinkFactor
        Canvas.context.font = `${fontSize}px unlocked`
        Canvas.context.fillText(`x${Canvas.game.boxes[result]}`, Canvas.ratios[s][0]*Canvas.width + Canvas.fontXTranslate*Canvas.shrinkFactor - 3*Canvas.shrinkFactor,  Canvas.ratios[s][1]*Canvas.height + Canvas.fontYTranslate*Canvas.shrinkFactor + 3*Canvas.shrinkFactor)
        Canvas.context.fillStyle = 'white'
        // hard
        Canvas.context.fillText(`x${Canvas.game.boxes[result]}`, Canvas.ratios[s][0]*Canvas.width + Canvas.fontXTranslate*Canvas.shrinkFactor,  Canvas.ratios[s][1]*Canvas.height + Canvas.fontYTranslate*Canvas.shrinkFactor)
        Canvas.context.fillStyle = 'black'

    }
    

    public static mapMultiplierToImage(multiplier){
        // need all square brackets?
        switch (multiplier) {
            case 15 : {
                return Canvas.coin
            }
            case 16 : {
                return Canvas.ring
            }
            case 17 : {
                return Canvas.notes
            }
            case 18 : {
                return Canvas.gold
            }
            case 19 : {
                return Canvas.diamond
            }
        }
    }

    public static rotate(rotation, xTranslate){
        Canvas.context.translate(this.centerDial[0], this.centerDial[1])
        Canvas.context.rotate(rotation)
        Canvas.context.drawImage(this.dial, xTranslate, 0, Canvas.thirdDialWidth, this.dial.height, Canvas.ratios["dial"][0]*Canvas.width-this.centerDial[0],  Canvas.ratios["dial"][1]*Canvas.height-this.centerDial[1], Canvas.thirdDialWidth*Canvas.shrinkFactor, this.dial.height*Canvas.shrinkFactor); 
        Canvas.context.setTransform(1,0,0,1,0,0)
        if(Canvas.spinOn){
            Canvas.context.drawImage(this.spin, Canvas.ratios["spin"][0]*Canvas.width,  Canvas.ratios["spin"][1]*Canvas.height, this.spin.width*Canvas.shrinkFactor, this.spin.height*Canvas.shrinkFactor);
        }
    }

    public static async loadFonts(){
        const unl = new FontFace('unlocked', 'url(../../src/fonts/TitanOne-Regular.ttf)')
        const inst = new FontFace('instructions', 'url(../../src/fonts/Dimbo-Italic.ttf)')
        await Promise.all([unl.load(), inst.load()])
        document.fonts.add(unl)
        document.fonts.add(inst)
        Canvas.fontsLoaded = true
        // hard
        Canvas.writeWords(45)
    }

    // 45 or 110 or 75
    public static writeWords(fSize) {
        let fontSize = fSize*Canvas.shrinkFactor
        Canvas.context.font = `${fontSize}px instructions`
        switch (Canvas.game.state) {
            case Canvas.game.states["ZERO_SPINS"] :{
                Canvas.context.drawImage(this.screen, Canvas.ratios["screen"][0]*Canvas.width,  Canvas.ratios["screen"][1]*Canvas.height, this.screen.width*Canvas.shrinkFactor, this.screen.height*Canvas.shrinkFactor);
                Canvas.context.fillText('Match a pair of symbols for a safe busting multiplier!', Canvas.ratios["instructionsTop"][0]*Canvas.width, Canvas.ratios["instructionsTop"][1]*Canvas.height)
                Canvas.context.fillText('TOUCH THE DIAL TO SPIN YOUR 4 DIGIT COMBINATION', Canvas.ratios["instructionsBottom"][0]*Canvas.width, Canvas.ratios["instructionsBottom"][1]*Canvas.height)
                Canvas.context.font = `${fontSize}px unlocked`
                Canvas.context.fillText("-   -   -   -", Canvas.ratios["unlockedSafes"][0]*Canvas.width, Canvas.ratios["unlockedSafes"][1]*Canvas.height)
                break;
            }
            case Canvas.game.states["SPINNING"] :{
                Canvas.context.putImageData(this.behindInstructions, Canvas.ratios["instructions"][0]*Canvas.width, Canvas.ratios["instructions"][1]*Canvas.height)
                Canvas.context.fillText('SPINNING!', Canvas.ratios["spinning"][0]*Canvas.width, Canvas.ratios["spinning"][1]*Canvas.height)
                break;
            }
            case Canvas.game.states["SPUN"] :{
                Canvas.context.putImageData(this.behindInstructions, Canvas.ratios["instructions"][0]*Canvas.width, Canvas.ratios["instructions"][1]*Canvas.height)
                Canvas.context.drawImage(this.screen, Canvas.ratios["screen"][0]*Canvas.width,  Canvas.ratios["screen"][1]*Canvas.height, this.screen.width*Canvas.shrinkFactor, this.screen.height*Canvas.shrinkFactor);

                // hard and shrink
                Canvas.context.fillText("SAFE" + Canvas.game.unlockedSafes[Canvas.game.unlockedSafes.length-1].toString(), Canvas.ratios["spinning"][0]*Canvas.width+63, Canvas.ratios["spinning"][1]*Canvas.height)
                // hard
                Canvas.context.font = `${45}px unlocked`
                Canvas.context.fillText(Canvas.getUnlockedSafesString(), Canvas.ratios["unlockedSafes"][0]*Canvas.width, Canvas.ratios["unlockedSafes"][1]*Canvas.height)
                break;
            }
            case Canvas.game.states["WON"] :{
                Canvas.context.drawImage(Canvas.winScreen, Canvas.ratios["winScreen"][0]*Canvas.width,  Canvas.ratios["winScreen"][1]*Canvas.height, Canvas.winScreen.width*Canvas.shrinkFactor, Canvas.winScreen.height*Canvas.shrinkFactor);
                Canvas.context.font = `${fontSize}px unlocked`
                // hard + shrinkFactor
                Canvas.context.fillText("WIN", Canvas.ratios["unlockedSafes"][0]*Canvas.width+20, Canvas.ratios["unlockedSafes"][1]*Canvas.height+10)
                break;
            }
        }
    }

    public static getUnlockedSafesString(){
        let s = ''
        for(let i = 0; i < Canvas.game.unlockedSafes.length; i++){
            s += `${Canvas.game.unlockedSafes[i]}   `
        }
        while(s.length < 16){
            s += "-   "
        }
        return s.substr(0, s.length-3)
    }

    public static counter() {
        Canvas.count--
        if(Canvas.count === 0) {
            Canvas.thirdLightsWidth = Canvas.lights.width/3
            Canvas.thirdDialWidth = Canvas.dial.width/3
            Canvas.sizeCanvas()
        }
    }

    public static sizeCanvas() {
        // If the browser is large enough scale the canvas to its maximum dimensions.
	    if(document.body.clientWidth > this.maxWidth && window.innerHeight > this.maxHeight) {
            Canvas.canvasElement.width = Canvas.maxWidth;
            Canvas.width = Canvas.maxWidth
            Canvas.canvasElement.height = Canvas.maxHeight;
            Canvas.height = Canvas.maxHeight
        }
        else {
            // If both width and height are smaller than max determine which ratio is smallest and rescale accordingly.
            // Else if its just width than scale to width otherwise its height and scale to height. 
            document.body.clientWidth < this.maxWidth && document.body.clientHeight < this.maxHeight 
                ? document.body.clientWidth/this.maxWidth <= document.body.clientHeight/this.maxHeight 
                    ? Canvas.scaleToWidth(Canvas.canvasElement) 
                    : Canvas.scaleToHeight(Canvas.canvasElement) 
                : document.body.clientWidth < this.maxWidth 
                    ? Canvas.scaleToWidth(Canvas.canvasElement) 
                    : Canvas.scaleToHeight(Canvas.canvasElement)
        }
        Canvas.shrinkFactor = Canvas.width/Canvas.maxWidth
        Canvas.drawImages()
    }

    private static scaleToWidth(el: HTMLCanvasElement) {
        el.width = document.body.clientWidth*0.95;
        Canvas.width = document.body.clientWidth*0.95;
        el.height = Canvas.width*this.heightToWidthRatio;
        Canvas.height = Canvas.width*this.heightToWidthRatio;
    }

    private static scaleToHeight(el: HTMLCanvasElement) {
        el.height = document.body.clientHeight*0.95;
        Canvas.height = document.body.clientHeight*0.95;
        el.width = Canvas.height*this.widthToHeightRatio;
        Canvas.width = Canvas.height*this.widthToHeightRatio;
    }

    public static drawImages(){

        Canvas.context.drawImage(this.background, 0, 0, Canvas.width, Canvas.height);

        const widthFactor = this.safe.width*Canvas.shrinkFactor
        const heightFactor = this.safe.height*Canvas.shrinkFactor

        // Make a loop?
        if(Canvas.initialDraw){
            // hard code and shrink
            Canvas.behindInstructions = Canvas.context.getImageData(Canvas.ratios["instructions"][0]*Canvas.width,  Canvas.ratios["instructions"][1]*Canvas.height, 800, 90)
            Canvas.behindSafes["safe1"] = Canvas.context.getImageData(Canvas.ratios["safe1"][0]*Canvas.width,  Canvas.ratios["safe1"][1]*Canvas.height, widthFactor, heightFactor)
            Canvas.behindSafes["safe2"] = Canvas.context.getImageData(Canvas.ratios["safe2"][0]*Canvas.width,  Canvas.ratios["safe2"][1]*Canvas.height, widthFactor, heightFactor)
            Canvas.behindSafes["safe3"] = Canvas.context.getImageData(Canvas.ratios["safe3"][0]*Canvas.width,  Canvas.ratios["safe3"][1]*Canvas.height, widthFactor, heightFactor)
            Canvas.behindSafes["safe4"] = Canvas.context.getImageData(Canvas.ratios["safe4"][0]*Canvas.width,  Canvas.ratios["safe4"][1]*Canvas.height, widthFactor, heightFactor)
            Canvas.behindSafes["safe5"] = Canvas.context.getImageData(Canvas.ratios["safe5"][0]*Canvas.width,  Canvas.ratios["safe5"][1]*Canvas.height, widthFactor, heightFactor)
            Canvas.behindSafes["safe6"] = Canvas.context.getImageData(Canvas.ratios["safe6"][0]*Canvas.width,  Canvas.ratios["safe6"][1]*Canvas.height, widthFactor, heightFactor)
            Canvas.behindSafes["safe7"] = Canvas.context.getImageData(Canvas.ratios["safe7"][0]*Canvas.width,  Canvas.ratios["safe7"][1]*Canvas.height, widthFactor, heightFactor)
            Canvas.behindSafes["safe8"] = Canvas.context.getImageData(Canvas.ratios["safe8"][0]*Canvas.width,  Canvas.ratios["safe8"][1]*Canvas.height, widthFactor, heightFactor)
            Canvas.behindSafes["safe9"] = Canvas.context.getImageData(Canvas.ratios["safe9"][0]*Canvas.width,  Canvas.ratios["safe9"][1]*Canvas.height, widthFactor, heightFactor)   
        }

        for (let i = 1; i <=9; i++){
            let s = "safe" + i.toString()
            Canvas.game.unlockedSafes.indexOf(i) === -1
                ? Canvas.context.drawImage(this.safe, Canvas.ratios[s][0]*Canvas.width,  Canvas.ratios[s][1]*Canvas.height, widthFactor, heightFactor)
                : Canvas.openSafe(i)
        }


        if(!Canvas.won){
            Canvas.context.drawImage(this.supportDial, Canvas.ratios["supportDial"][0]*Canvas.width,  Canvas.ratios["supportDial"][1]*Canvas.height, this.supportDial.width*Canvas.shrinkFactor, this.supportDial.height*Canvas.shrinkFactor);
            Canvas.context.drawImage(this.dial, 0, 0, Canvas.thirdDialWidth, this.dial.height, Canvas.ratios["dial"][0]*Canvas.width,  Canvas.ratios["dial"][1]*Canvas.height, Canvas.thirdDialWidth*Canvas.shrinkFactor, this.dial.height*Canvas.shrinkFactor);
        }

        if(Canvas.initialDraw){
            Canvas.behindLightsTwo = Canvas.context.getImageData(Canvas.ratios["lights2"][0]*Canvas.width,  Canvas.ratios["lights2"][1]*Canvas.height, Canvas.thirdLightsWidth, this.lights.height)
            Canvas.behindLightsOne = Canvas.context.getImageData(Canvas.ratios["lights1"][0]*Canvas.width,  Canvas.ratios["lights1"][1]*Canvas.height, Canvas.thirdLightsWidth, this.lights.height)    
            Canvas.behindSpin = Canvas.context.getImageData(Canvas.ratios["spin"][0]*Canvas.width,  Canvas.ratios["spin"][1]*Canvas.height, this.spin.width, this.spin.height)
            Canvas.behindMarker = Canvas.context.getImageData(Canvas.ratios["marker"][0]*Canvas.width,  Canvas.ratios["marker"][1]*Canvas.height, Canvas.marker.width/2, Canvas.marker.height)
        }

        if(!Canvas.won){
            Canvas.context.drawImage(this.spin, Canvas.ratios["spin"][0]*Canvas.width,  Canvas.ratios["spin"][1]*Canvas.height, this.spin.width*Canvas.shrinkFactor, this.spin.height*Canvas.shrinkFactor);
            Canvas.context.drawImage(this.lights, 0, 0, Canvas.thirdLightsWidth, this.lights.height, Canvas.ratios["lights1"][0]*Canvas.width,  Canvas.ratios["lights1"][1]*Canvas.height, Canvas.thirdLightsWidth*Canvas.shrinkFactor, this.lights.height*Canvas.shrinkFactor);
            Canvas.context.drawImage(this.lights, Canvas.thirdLightsWidth, 0, Canvas.thirdLightsWidth, this.lights.height, Canvas.ratios["lights2"][0]*Canvas.width,  Canvas.ratios["lights2"][1]*Canvas.height, Canvas.thirdLightsWidth*Canvas.shrinkFactor, this.lights.height*Canvas.shrinkFactor);
        }

        if(Canvas.fontsLoaded) {Canvas.writeWords(45)} 

        if(Canvas.resizing || Canvas.initialDraw) {
            Canvas.setDimensions()
            Canvas.initialDraw = false;
        }
    }

    public static setDimensions(){
        Canvas.radiusSupport = (this.supportDial.width-15)/2*Canvas.shrinkFactor
        Canvas.radiusSpin = this.spin.width/2*Canvas.shrinkFactor
        Canvas.radiusDial = Canvas.radiusSupport*0.9
        // plus 30 on the height for marker, hard coded?
        Canvas.centerSupport = [Canvas.ratios["supportDial"][0]*Canvas.width+this.supportDial.width/2*Canvas.shrinkFactor, Canvas.ratios["supportDial"][1]*Canvas.height+30*Canvas.shrinkFactor+(Canvas.supportDial.height-30*Canvas.shrinkFactor)/2*Canvas.shrinkFactor]
        Canvas.centerDial = [Canvas.ratios["dial"][0]*Canvas.width+this.dial.width/6*Canvas.shrinkFactor, Canvas.ratios["dial"][1]*Canvas.height+Canvas.dial.height/2*Canvas.shrinkFactor]

    }

    // Can we do change lights with save and restore? What is more expensive?
    public static changeLights() {
        Canvas.drawLights()
        // Change the sx translation for both lights
        Canvas.xLights1 < 2 
            ? Canvas.xLights1 ++ 
            : Canvas.xLights1 = 0

        Canvas.xLights2 < 2 
            ? Canvas.xLights2 ++ 
            : Canvas.xLights2 = 0
    }

    public static drawLights(){
        Canvas.context.putImageData(Canvas.behindLightsOne, Canvas.ratios["lights1"][0]*Canvas.width, Canvas.ratios["lights1"][1]*Canvas.height)
        Canvas.context.putImageData(Canvas.behindLightsTwo, Canvas.ratios["lights2"][0]*Canvas.width, Canvas.ratios["lights2"][1]*Canvas.height)

        Canvas.context.drawImage(Canvas.lights, Canvas.xLights1*Canvas.thirdLightsWidth, 0, Canvas.thirdLightsWidth, Canvas.lights.height, Canvas.ratios["lights1"][0]*Canvas.width,  Canvas.ratios["lights1"][1]*Canvas.height, Canvas.thirdLightsWidth*Canvas.shrinkFactor, Canvas.lights.height*Canvas.shrinkFactor);
        Canvas.context.drawImage(Canvas.lights, Canvas.xLights2*Canvas.thirdLightsWidth, 0, Canvas.thirdLightsWidth, Canvas.lights.height, Canvas.ratios["lights2"][0]*Canvas.width,  Canvas.ratios["lights2"][1]*Canvas.height, Canvas.thirdLightsWidth*Canvas.shrinkFactor, Canvas.lights.height*Canvas.shrinkFactor);
    }

    // decrease radius. some are on outer grip
    public static async getPoint(){
        const a = Math.random() * 2 * Math.PI
        // hardcode
        const r = (Canvas.radiusSupport-5) * Math.sqrt(Math.random())

        if(Math.sqrt((r*Math.cos(a))**2 + (r*Math.sin(a))**2) > Canvas.radiusDial) {
            return [r*Math.cos(a)+Canvas.centerSupport[0], r*Math.sin(a)+Canvas.centerSupport[1]]
        }
        else {
            return Canvas.getPoint()
        }

    }

    // make it async?
    // Don't use hard numbers, save as constants 
    public static async supportGlow() {

        await Promise.all([Canvas.getPoint(), Canvas.getPoint(), Canvas.getPoint(), Canvas.getPoint(), Canvas.getPoint(), Canvas.getPoint(), Canvas.getPoint(), Canvas.getPoint()]).then(function(values){
            for (let x in values){
                let spark = new Spark(values[x][0], values[x][1], 10)
                Canvas.sparks.push(spark)
            }
            Canvas.drawSparks(Canvas.sparks.length-values.length)
        })
    }

    public static drawSparks(index) {
        if (Canvas.game.state == Canvas.game.states["ZERO_SPINS"] || Canvas.game.state == Canvas.game.states["SPUN"] && !Canvas.resizing){
            const set = new Set([index, index+1, index+2, index+3, index+4, index+5, index+6, index+7])
            Canvas.drawBackgroundAndSupport()
            Canvas.rotate(Canvas.currentRotation, 0)
            for (let i = 0; i < Canvas.sparks.length; i++){ 
                if (Canvas.sparks[i]){
                    if (set.has(i)) {
                        Canvas.sparks[i].size += 5;
                        Canvas.context.drawImage(Canvas.sparkSafe, Canvas.sparks[i].x-Canvas.sparks[i].size/2, Canvas.sparks[i].y-Canvas.sparks[i].size/2, Canvas.sparks[i].size, Canvas.sparks[i].size)
                    }
                    else {
                        Canvas.context.drawImage(Canvas.sparkSafe, Canvas.sparks[i].x-Canvas.sparks[i].size/2, Canvas.sparks[i].y-Canvas.sparks[i].size/2, Canvas.sparks[i].size, Canvas.sparks[i].size)
                    }
                }
            }
            if (Canvas.sparks[index].size == 55){
                Canvas.removeSpark(index)
            }
            else {
                setTimeout(function(){Canvas.drawSparks(index)}, 60)
            }
        }
    }

    public static deleteSparks(){
        // not better to just Canvas.sparks = []?
        Canvas.sparks = []
        // for (let i = 0; i < Canvas.sparks.length; i++){ 
        //     delete Canvas.sparks[i]
        // }
    }

    public static removeSpark(index) {
        if (Canvas.game.state == Canvas.game.states["ZERO_SPINS"] || Canvas.game.state == Canvas.game.states["SPUN"] && !Canvas.resizing){
            const set = new Set([index, index+1, index+2, index+3, index+4, index+5, index+6, index+7])
            if (Canvas.sparks[index].size == 0) {
                for (let i = index; i <= index+7; i++){
                    delete Canvas.sparks[i]
                }
            }
            else{
                Canvas.drawBackgroundAndSupport()
                Canvas.rotate(Canvas.currentRotation, 0)
                for (let i = 0; i < Canvas.sparks.length; i++){ 
                    if (Canvas.sparks[i]){
                        if (set.has(i)) {
                            Canvas.sparks[i].size -= 5;
                            Canvas.context.drawImage(Canvas.sparkSafe, Canvas.sparks[i].x-Canvas.sparks[i].size/2, Canvas.sparks[i].y-Canvas.sparks[i].size/2, Canvas.sparks[i].size, Canvas.sparks[i].size)
                        }
                        else {
                            Canvas.context.drawImage(Canvas.sparkSafe, Canvas.sparks[i].x-Canvas.sparks[i].size/2, Canvas.sparks[i].y-Canvas.sparks[i].size/2, Canvas.sparks[i].size, Canvas.sparks[i].size)
                        }
                    }
                }
                setTimeout(function(){Canvas.removeSpark(index)}, 60)
            }
        }
    }

    // clip larger area so you don't get the line half way through
    public static drawBackgroundAndSupport(){
        // can implement DRY morE?
        // if change radius change increment
        // I shouldnt have to clip twice
        Canvas.drawLights()
        Canvas.context.save();
        Canvas.context.beginPath();
        Canvas.context.arc(Canvas.centerSupport[0], Canvas.centerSupport[1], Canvas.radiusSupport+15, 0, Math.PI * 2);
        Canvas.context.clip();
        Canvas.context.drawImage(this.background, 0, 0, Canvas.width, Canvas.height);
        Canvas.context.drawImage(this.supportDial, Canvas.ratios["supportDial"][0]*Canvas.width,  Canvas.ratios["supportDial"][1]*Canvas.height, this.supportDial.width*Canvas.shrinkFactor, this.supportDial.height*Canvas.shrinkFactor);
        Canvas.context.restore();
    }

    // Method that flashes the "Spin" button. 
    // Called by a "setInterval"
    public static flashSpin(){
        Canvas.context.putImageData(Canvas.behindSpin, Canvas.ratios["spin"][0]*Canvas.width, Canvas.ratios["spin"][1]*Canvas.height)
        if(Canvas.spinOn){
            Canvas.spinOn = false
        }
        else {
            Canvas.context.drawImage(Canvas.spin, Canvas.ratios["spin"][0]*Canvas.width,  Canvas.ratios["spin"][1]*Canvas.height, Canvas.spin.width*Canvas.shrinkFactor, Canvas.spin.height*Canvas.shrinkFactor);
            Canvas.spinOn = true
        }
    }
}