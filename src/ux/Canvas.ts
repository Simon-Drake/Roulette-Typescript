import {Spark} from './Spark.js'
import {Game} from './Game.js'
import {Star} from './Star.js'
import {Dimensions} from './Dimensions.js'
import {Arithmetic} from './Arithmetic.js'

export class Canvas {

    // take away semicolons


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
    public static winImage: HTMLImageElement

    public static images: HTMLElement[] = [Canvas.lights, Canvas.background, Canvas.safe, Canvas.safeOpen, Canvas.gold, Canvas.diamond,
        Canvas.coin, Canvas.ring, Canvas.notes, Canvas.sparkSafe, Canvas.screen, Canvas.supportDial, Canvas.dial, Canvas.spin, Canvas.marker, 
        Canvas.winScreen, Canvas.star]

    // Other cache references
    public static ctx: CanvasRenderingContext2D;
    public static count: number = Canvas.images.length;

    public static game: Game;
    public static dim: Dimensions;

    public static behindLightsOne: ImageData;
    public static behindLightsTwo: ImageData;
    public static behindSpin: ImageData;
    public static behindMarker: ImageData;
    public static behindInstructions: ImageData;
    public static behindSafes: object = {}
    
    // Runtime state variables
    public static scale: number = 1
    public static currentRotation: number = 0;
    public static scaleDirection: number = 1;
    public static fontsLoaded: boolean = false;
    public static spinOn: boolean = true;
    public static initialDraw: boolean = true;
    public static resizing: boolean = false;

    public static sparks: Spark[] = [];
    public static stars: Star[] = [];

    public static glowInterval: number;
    public static flashInterval: number;

    public static init(el: HTMLCanvasElement, game) {

        Canvas.loadFonts()
        Canvas.loadImages()
        Canvas.ctx = el.getContext("2d");

        Canvas.game = game
        Canvas.game.state = Canvas.game.states["ZERO_SPINS"]
        Canvas.dim = new Dimensions(el)

        window.addEventListener('resize', function(){
            Canvas.resizing = true
            clearInterval(Canvas.glowInterval)
            clearInterval(Canvas.flashInterval)
            Canvas.sparks = []
            Canvas.dim.sizeCanvas()
            Canvas.drawImages()
            Canvas.glowInterval = setInterval(Canvas.generateSparks, 450)
            Canvas.flashInterval = setInterval(Canvas.flashSpin, 500)
            setTimeout(function(){Canvas.resizing = false}, 50)
        })

        el.addEventListener('click', function(e){
            if(Canvas.game.state == Canvas.game.states["ZERO_SPINS"] || Canvas.game.state == Canvas.game.states["SPUN"])
                Canvas.intersect(e.offsetX, e.offsetY)
        })

        setInterval(function(){
            Canvas.dim.changeLights()
            Canvas.drawLights()
        }, 1000)
        Canvas.glowInterval = setInterval(Canvas.generateSparks, 450)
        Canvas.flashInterval = setInterval(Canvas.flashSpin, 500)
    }

    public static loadImages(){
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

        this.background.onload = this.dial.onload = this.lights.onload = this.safe.onload = this.supportDial.onload = this.coin.onload =
        this.ring.onload = this.notes.onload = this.spin.onload = this.safeOpen.onload = this.screen.onload = this.sparkSafe.onload = 
        this.gold.onload = this.diamond.onload = this.winScreen.onload = this.marker.onload = this.star.onload = Canvas.counter
    }

    public static intersect(x, y){
        let inside = Math.sqrt((Canvas.dim.centerSupport[0]-x)**2 + (Canvas.dim.centerSupport[1]-y)**2) < Canvas.dim.radiusSpin
        if(inside){
            Canvas.game.state = Canvas.game.states["SPINNING"];
            Canvas.spinOn = false
            Canvas.game.spins += 1
            Canvas.sparks = []

            clearInterval(Canvas.glowInterval)
            clearInterval(Canvas.flashInterval)
            Canvas.drawBackgroundAndSupport()


            let state
            let antiClockwise = Math.round(Math.random())*Math.random()*Math.PI
            antiClockwise
            ? state = 0
            : state = 1
            Canvas.spinWheel(Canvas.currentRotation, antiClockwise, -Arithmetic.degToRadians(360/9*Arithmetic.getRandomInt(9)), Arithmetic.degToRadians(360/9*Arithmetic.getRandomInt(9)), state)
            Canvas.writeWords(110)
        }
    }


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
                if (rotation >= antiClockwise2) {
                    Canvas.rotate(antiClockwise2, 0)
                    Canvas.evaluateScore(antiClockwise2)
                }
                else {
                    Canvas.rotate(rotation, 0)
                    setTimeout(function(){Canvas.spinWheel(rotation, antiClockwise, clockwise, antiClockwise2, state)}, 20)
                }
                break;
            }
        }
    }
    
    public static evaluateScore(rotation){
        Canvas.game.state = Canvas.game.states["SPUN"]
        Canvas.currentRotation = rotation
        Canvas.game.result = Arithmetic.getResult(rotation)

        if(Canvas.game.unlockedSafes.indexOf(Canvas.game.result) === -1) {
            Canvas.game.unlockedSafes.push(Canvas.game.result)
            Canvas.openSafe(Canvas.game.result)

            Canvas.game.assessWin(Canvas.game.boxes[Canvas.game.result])
                ? setTimeout(function(){Canvas.implementWin()}, 2000)
                : Canvas.redDial(0)
        }
        else {
            Canvas.glowInterval = setInterval(Canvas.generateSparks, 450)
            Canvas.flashInterval = setInterval(Canvas.flashSpin, 500)
        }
        Canvas.writeWords(110)
    }

    public static implementWin(){
        Canvas.game.state = Canvas.game.states["WON"]
        Canvas.sparks = []
        clearInterval(Canvas.glowInterval)
        clearInterval(Canvas.flashInterval)
        setInterval(function(){Canvas.winSpin(0.18, true)}, 35)    
        Canvas.game.setWinSafes()
        Canvas.winImage = Canvas.mapMultiplierToImage(Canvas.game.boxes[Canvas.game.winSafes[0]])
        Canvas.starParticles()
        setInterval(function(){Canvas.drawStars(true)}, 100)
        setInterval(function(){Canvas.dim.changeSX(Canvas.winImage.width)}, 500)
        setTimeout(function(){setInterval(function(){Canvas.changeScale()}, 30)}, 3000)
        setInterval(function(){Canvas.starParticles()}, 2500)
    }


    public static changeScale(){
        Canvas.scale += 0.05 * Canvas.scaleDirection

        if(Canvas.scale > 1.4)
            Canvas.scaleDirection = -1

        if(Canvas.scale <= 1)
            Canvas.scaleDirection = +1
    }

    public static starParticles(){
        Canvas.game.winSafesStrings[0] = "safe" + Canvas.game.winSafes[0].toString()
        Canvas.game.winSafesStrings[1] = "safe" + Canvas.game.winSafes[1].toString()

        for (let i = 0; i < 5; i++){
            Canvas.stars.push(new Star(Canvas.dim.ratios[Canvas.game.winSafesStrings[0]][0]*Canvas.dim.width + Canvas.dim.starXTranslate*Canvas.dim.shrinkFactor, Canvas.dim.ratios[Canvas.game.winSafesStrings[0]][1]*Canvas.dim.height + Canvas.dim.starYTranslate*Canvas.dim.shrinkFactor, 20+80*Math.random()))
            Canvas.stars.push(new Star(Canvas.dim.ratios[Canvas.game.winSafesStrings[1]][0]*Canvas.dim.width + Canvas.dim.starXTranslate*Canvas.dim.shrinkFactor, Canvas.dim.ratios[Canvas.game.winSafesStrings[1]][1]*Canvas.dim.height + Canvas.dim.starYTranslate*Canvas.dim.shrinkFactor, 20+80*Math.random()))
        }
    }

    public static fillCanvasColour(){
        Canvas.ctx.fillStyle = 'silver'
        Canvas.ctx.fillRect(0, 0, Canvas.dim.width, Canvas.dim.height)
        Canvas.ctx.fillStyle = 'black'
    }

    // might not need move if array is empty... 
    public static drawStars(move){


        Canvas.fillCanvasColour()
        Canvas.drawImages()
        Canvas.winSpin(0, false)
        Canvas.drawLights()
        Canvas.writeWords(75)


        for (let i = 0; i < Canvas.stars.length; i++){
            if (Canvas.stars[i]) {
                if (Canvas.stars[i].distanceFromSource >= 200) {
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

        let image = Canvas.winImage
        let s1x = Canvas.dim.ratios[Canvas.game.winSafesStrings[0]][0]*Canvas.dim.width + Canvas.dim.priseXTranslate*Canvas.dim.shrinkFactor
        let s1y = Canvas.dim.ratios[Canvas.game.winSafesStrings[0]][1]*Canvas.dim.height + Canvas.dim.priseYTranslate*Canvas.dim.shrinkFactor
        let s2x = Canvas.dim.ratios[Canvas.game.winSafesStrings[1]][0]*Canvas.dim.width + Canvas.dim.priseXTranslate*Canvas.dim.shrinkFactor
        let s2y = Canvas.dim.ratios[Canvas.game.winSafesStrings[1]][1]*Canvas.dim.height + Canvas.dim.priseYTranslate*Canvas.dim.shrinkFactor
        let scale = Canvas.scale

        Canvas.ctx.drawImage(image, Canvas.dim.winImageSX, 0, image.width/2, image.height, s1x-image.width*(scale-1)/4, s1y-image.height*(scale-1)/2, 
            scale*image.width*Canvas.dim.shrinkFactor/2, scale*image.height*Canvas.dim.shrinkFactor);

        Canvas.ctx.drawImage(image, Canvas.dim.winImageSX, 0, image.width/2, image.height, s2x-image.width*(scale-1)/4, s2y-image.height*(scale-1)/2, 
            scale*image.width*Canvas.dim.shrinkFactor/2, scale*image.height*Canvas.dim.shrinkFactor);

        if(Canvas.dim.winImageSX > 0) {
            Canvas.drawMultiplier(Canvas.game.boxes[Canvas.game.winSafes[0]], Canvas.game.winSafesStrings[0])
            Canvas.drawMultiplier(Canvas.game.boxes[Canvas.game.winSafes[1]], Canvas.game.winSafesStrings[1])
        }
    }

    public static drawMultiplier(multiple, safe){
        // hard
        // all scaled
        let fontSize = 65*Canvas.dim.shrinkFactor*Canvas.scale
        Canvas.ctx.font = `${fontSize}px unlocked`
        let blackfx = Canvas.dim.ratios[safe][0]*Canvas.dim.width + Canvas.dim.fontXTranslate*Canvas.dim.shrinkFactor - Canvas.dim.blackFont*Canvas.dim.shrinkFactor
        let blackfy = Canvas.dim.ratios[safe][1]*Canvas.dim.height + Canvas.dim.fontYTranslate*Canvas.dim.shrinkFactor + Canvas.dim.blackFont*Canvas.dim.shrinkFactor
        let whitefx = Canvas.dim.ratios[safe][0]*Canvas.dim.width + Canvas.dim.fontXTranslate*Canvas.dim.shrinkFactor
        let whitefy = Canvas.dim.ratios[safe][1]*Canvas.dim.height + Canvas.dim.fontYTranslate*Canvas.dim.shrinkFactor
        Canvas.ctx.fillText(`x${multiple}`, blackfx-65*(fontSize/65-1)/2, blackfy+65*(fontSize/65-1)/2)
        Canvas.ctx.fillStyle = 'white'
        Canvas.ctx.fillText(`x${multiple}`, whitefx-65*(fontSize/65-1)/2,  whitefy+65*(fontSize/65-1)/2)
        Canvas.ctx.fillStyle = 'black'
    }

    public static rotateStar(star){
        let centerX = star.x + star.size*Canvas.dim.shrinkFactor/2
        let centerY = star.y + star.size*Canvas.dim.shrinkFactor/2
        Canvas.ctx.translate(centerX, centerY)
        Canvas.ctx.rotate(star.rotation)

        let gA = Math.sqrt(-star.distanceFromSource+200)/9 || 0.1
        gA > 1
            ? Canvas.ctx.globalAlpha = 1
            : Canvas.ctx.globalAlpha = gA

        Canvas.ctx.drawImage(Canvas.star, star.x - centerX,  star.y - centerY, star.size*Canvas.dim.shrinkFactor, star.size*Canvas.dim.shrinkFactor)
        Canvas.ctx.setTransform(1,0,0,1,0,0)
        Canvas.ctx.globalAlpha = 1
    }

    public static winSpin(increment, drawStars){
        Canvas.drawBackgroundAndSupport()
        Canvas.ctx.putImageData(Canvas.behindMarker, Canvas.dim.ratios["marker"][0]*Canvas.dim.width, Canvas.dim.ratios["marker"][1]*Canvas.dim.height)
        Canvas.ctx.drawImage(Canvas.marker, Canvas.marker.width/2, 0, Canvas.marker.width/2, Canvas.marker.height, Canvas.dim.ratios["marker"][0]*Canvas.dim.width,  Canvas.dim.ratios["marker"][1]*Canvas.dim.height, Canvas.marker.width*Canvas.dim.shrinkFactor/2, Canvas.marker.height*Canvas.dim.shrinkFactor)
        Canvas.currentRotation = Canvas.currentRotation + increment
        Canvas.rotate(Canvas.currentRotation, Canvas.dim.thirdDialWidth*2)
        if(drawStars)
            Canvas.drawStars(false)
    }

    public static redDial(counter){
        if (counter == 10){
            Canvas.glowInterval = setInterval(Canvas.generateSparks, 450)
            Canvas.flashInterval = setInterval(Canvas.flashSpin, 500)
        }
        else {
            Canvas.drawBackgroundAndSupport()
            if (counter % 2 == 0) {
                Canvas.rotate(Canvas.currentRotation, Canvas.dim.thirdDialWidth)
                // hard
                Canvas.ctx.drawImage(Canvas.marker, 0, 0, Canvas.marker.width/2, Canvas.marker.height, Canvas.dim.ratios["marker"][0]*Canvas.dim.width,  Canvas.dim.ratios["marker"][1]*Canvas.dim.height, Canvas.marker.width*Canvas.dim.shrinkFactor/2, Canvas.marker.height*Canvas.dim.shrinkFactor)
            }
            else {
                Canvas.ctx.putImageData(Canvas.behindMarker, Canvas.dim.ratios["marker"][0]*Canvas.dim.width, Canvas.dim.ratios["marker"][1]*Canvas.dim.height)
                Canvas.rotate(Canvas.currentRotation, 0)
            }
        counter ++;
        setTimeout(function(){Canvas.redDial(counter)}, 200)
        }
    }

    public static openSafe(result){
        let s = "safe" + result.toString()

        // need to scale for browser resize
        Canvas.ctx.putImageData(Canvas.behindSafes[s], Canvas.dim.ratios[s][0]*Canvas.dim.width, Canvas.dim.ratios[s][1]*Canvas.dim.height)

        Canvas.ctx.drawImage(Canvas.safeOpen, Canvas.dim.ratios[s][0]*Canvas.dim.width + Canvas.dim.openSafeXTranslate*Canvas.dim.shrinkFactor,  Canvas.dim.ratios[s][1]*Canvas.dim.height + Canvas.dim.openSafeYTranslate*Canvas.dim.shrinkFactor, 
                    Canvas.safeOpen.width*Canvas.dim.shrinkFactor, Canvas.safeOpen.height*Canvas.dim.shrinkFactor);
        
        let image = Canvas.mapMultiplierToImage(Canvas.game.boxes[result])
        // /2 once
        Canvas.ctx.drawImage(image, 0, 0, image.width/2, image.height, Canvas.dim.ratios[s][0]*Canvas.dim.width + Canvas.dim.priseXTranslate*Canvas.dim.shrinkFactor,  Canvas.dim.ratios[s][1]*Canvas.dim.height + Canvas.dim.priseYTranslate*Canvas.dim.shrinkFactor, 
            image.width*Canvas.dim.shrinkFactor/2, image.height*Canvas.dim.shrinkFactor);

        if(Canvas.game.state !== Canvas.game.states["WON"]) {
            Canvas.drawMultiplier(Canvas.game.boxes[result], s)
        }
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
        Canvas.ctx.translate(Canvas.dim.centerDial[0], Canvas.dim.centerDial[1])
        Canvas.ctx.rotate(rotation)
        Canvas.ctx.drawImage(this.dial, xTranslate, 0, Canvas.dim.thirdDialWidth, this.dial.height, Canvas.dim.ratios["dial"][0]*Canvas.dim.width-Canvas.dim.centerDial[0],  Canvas.dim.ratios["dial"][1]*Canvas.dim.height-Canvas.dim.centerDial[1], Canvas.dim.thirdDialWidth*Canvas.dim.shrinkFactor, this.dial.height*Canvas.dim.shrinkFactor); 
        Canvas.ctx.setTransform(1,0,0,1,0,0)
        if(Canvas.spinOn){
            Canvas.ctx.drawImage(this.spin, Canvas.dim.ratios["spin"][0]*Canvas.dim.width,  Canvas.dim.ratios["spin"][1]*Canvas.dim.height, this.spin.width*Canvas.dim.shrinkFactor, this.spin.height*Canvas.dim.shrinkFactor);
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
        let fontSize = fSize*Canvas.dim.shrinkFactor
        Canvas.ctx.font = `${fontSize}px instructions`
        switch (Canvas.game.state) {
            case Canvas.game.states["ZERO_SPINS"] :{
                Canvas.ctx.drawImage(this.screen, Canvas.dim.ratios["screen"][0]*Canvas.dim.width,  Canvas.dim.ratios["screen"][1]*Canvas.dim.height, this.screen.width*Canvas.dim.shrinkFactor, this.screen.height*Canvas.dim.shrinkFactor);
                Canvas.ctx.fillText('Match a pair of symbols for a safe busting multiplier!', Canvas.dim.ratios["instructionsTop"][0]*Canvas.dim.width, Canvas.dim.ratios["instructionsTop"][1]*Canvas.dim.height)
                Canvas.ctx.fillText('TOUCH THE DIAL TO SPIN YOUR 4 DIGIT COMBINATION', Canvas.dim.ratios["instructionsBottom"][0]*Canvas.dim.width, Canvas.dim.ratios["instructionsBottom"][1]*Canvas.dim.height)
                Canvas.ctx.font = `${fontSize}px unlocked`
                Canvas.ctx.fillText("-   -   -   -", Canvas.dim.ratios["unlockedSafes"][0]*Canvas.dim.width, Canvas.dim.ratios["unlockedSafes"][1]*Canvas.dim.height)
                break;
            }
            case Canvas.game.states["SPINNING"] :{
                Canvas.ctx.putImageData(this.behindInstructions, Canvas.dim.ratios["instructions"][0]*Canvas.dim.width, Canvas.dim.ratios["instructions"][1]*Canvas.dim.height)
                Canvas.ctx.fillText('SPINNING!', Canvas.dim.ratios["spinning"][0]*Canvas.dim.width, Canvas.dim.ratios["spinning"][1]*Canvas.dim.height)
                break;
            }
            case Canvas.game.states["SPUN"] :{
                Canvas.ctx.putImageData(this.behindInstructions, Canvas.dim.ratios["instructions"][0]*Canvas.dim.width, Canvas.dim.ratios["instructions"][1]*Canvas.dim.height)
                Canvas.ctx.drawImage(this.screen, Canvas.dim.ratios["screen"][0]*Canvas.dim.width,  Canvas.dim.ratios["screen"][1]*Canvas.dim.height, this.screen.width*Canvas.dim.shrinkFactor, this.screen.height*Canvas.dim.shrinkFactor);

                // hard and shrink
                Canvas.ctx.fillText("SAFE" + Canvas.game.result.toString(), Canvas.dim.ratios["spinning"][0]*Canvas.dim.width+63, Canvas.dim.ratios["spinning"][1]*Canvas.dim.height)
                // hard
                Canvas.ctx.font = `${45}px unlocked`
                Canvas.ctx.fillText(Canvas.game.getUnlockedSafesString(), Canvas.dim.ratios["unlockedSafes"][0]*Canvas.dim.width, Canvas.dim.ratios["unlockedSafes"][1]*Canvas.dim.height)
                break;
            }
            case Canvas.game.states["WON"] :{

                Canvas.ctx.drawImage(Canvas.winScreen, Canvas.dim.ratios["winScreen"][0]*Canvas.dim.width,  Canvas.dim.ratios["winScreen"][1]*Canvas.dim.height, Canvas.winScreen.width*Canvas.dim.shrinkFactor, Canvas.winScreen.height*Canvas.dim.shrinkFactor);
                Canvas.ctx.font = `${fontSize}px unlocked`
                // hard + shrinkFactor
                Canvas.ctx.fillText("WIN", Canvas.dim.ratios["unlockedSafes"][0]*Canvas.dim.width+20, Canvas.dim.ratios["unlockedSafes"][1]*Canvas.dim.height+10)
                Canvas.ctx.font = `${110}px instructions`
                let amountWon = Canvas.game.boxes[Canvas.game.winSafes[0]]*Canvas.game.bet
                Canvas.ctx.fillText(`YOU WIN £${amountWon}!`, Canvas.dim.ratios["spinning"][0]*Canvas.dim.width-65, Canvas.dim.ratios["spinning"][1]*Canvas.dim.height)
                break;
            }
        }
    }


    public static counter() {
        Canvas.count--
        if(Canvas.count === 0) {
            Canvas.dim.thirdLightsWidth = Canvas.lights.width/3
            Canvas.dim.thirdDialWidth = Canvas.dial.width/3
            Canvas.dim.sizeCanvas()
            Canvas.drawImages()
        }
    }
    public static drawImages(){

        Canvas.ctx.drawImage(this.background, 0, 0, Canvas.dim.width, Canvas.dim.height);

        const widthFactor = this.safe.width*Canvas.dim.shrinkFactor
        const heightFactor = this.safe.height*Canvas.dim.shrinkFactor

        // Make a loop?
        if(Canvas.initialDraw){
            // hard code and shrink
            Canvas.behindInstructions = Canvas.ctx.getImageData(Canvas.dim.ratios["instructions"][0]*Canvas.dim.width,  Canvas.dim.ratios["instructions"][1]*Canvas.dim.height, 800, 90)
            Canvas.behindSafes["safe1"] = Canvas.ctx.getImageData(Canvas.dim.ratios["safe1"][0]*Canvas.dim.width,  Canvas.dim.ratios["safe1"][1]*Canvas.dim.height, widthFactor, heightFactor)
            Canvas.behindSafes["safe2"] = Canvas.ctx.getImageData(Canvas.dim.ratios["safe2"][0]*Canvas.dim.width,  Canvas.dim.ratios["safe2"][1]*Canvas.dim.height, widthFactor, heightFactor)
            Canvas.behindSafes["safe3"] = Canvas.ctx.getImageData(Canvas.dim.ratios["safe3"][0]*Canvas.dim.width,  Canvas.dim.ratios["safe3"][1]*Canvas.dim.height, widthFactor, heightFactor)
            Canvas.behindSafes["safe4"] = Canvas.ctx.getImageData(Canvas.dim.ratios["safe4"][0]*Canvas.dim.width,  Canvas.dim.ratios["safe4"][1]*Canvas.dim.height, widthFactor, heightFactor)
            Canvas.behindSafes["safe5"] = Canvas.ctx.getImageData(Canvas.dim.ratios["safe5"][0]*Canvas.dim.width,  Canvas.dim.ratios["safe5"][1]*Canvas.dim.height, widthFactor, heightFactor)
            Canvas.behindSafes["safe6"] = Canvas.ctx.getImageData(Canvas.dim.ratios["safe6"][0]*Canvas.dim.width,  Canvas.dim.ratios["safe6"][1]*Canvas.dim.height, widthFactor, heightFactor)
            Canvas.behindSafes["safe7"] = Canvas.ctx.getImageData(Canvas.dim.ratios["safe7"][0]*Canvas.dim.width,  Canvas.dim.ratios["safe7"][1]*Canvas.dim.height, widthFactor, heightFactor)
            Canvas.behindSafes["safe8"] = Canvas.ctx.getImageData(Canvas.dim.ratios["safe8"][0]*Canvas.dim.width,  Canvas.dim.ratios["safe8"][1]*Canvas.dim.height, widthFactor, heightFactor)
            Canvas.behindSafes["safe9"] = Canvas.ctx.getImageData(Canvas.dim.ratios["safe9"][0]*Canvas.dim.width,  Canvas.dim.ratios["safe9"][1]*Canvas.dim.height, widthFactor, heightFactor)   
        }


        for (let i = 1; i <=9; i++){
            let s = "safe" + i.toString()
            Canvas.game.unlockedSafes.indexOf(i) === -1
                ? Canvas.ctx.drawImage(this.safe, Canvas.dim.ratios[s][0]*Canvas.dim.width,  Canvas.dim.ratios[s][1]*Canvas.dim.height, widthFactor, heightFactor)
                : Canvas.openSafe(i)
        }


        if(Canvas.game.state !== Canvas.game.states["WON"]){
            Canvas.ctx.drawImage(this.supportDial, Canvas.dim.ratios["supportDial"][0]*Canvas.dim.width,  Canvas.dim.ratios["supportDial"][1]*Canvas.dim.height, this.supportDial.width*Canvas.dim.shrinkFactor, this.supportDial.height*Canvas.dim.shrinkFactor);
            Canvas.ctx.drawImage(this.dial, 0, 0, Canvas.dim.thirdDialWidth, this.dial.height, Canvas.dim.ratios["dial"][0]*Canvas.dim.width,  Canvas.dim.ratios["dial"][1]*Canvas.dim.height, Canvas.dim.thirdDialWidth*Canvas.dim.shrinkFactor, this.dial.height*Canvas.dim.shrinkFactor);
        }

        if(Canvas.initialDraw){
            Canvas.behindLightsTwo = Canvas.ctx.getImageData(Canvas.dim.ratios["lights2"][0]*Canvas.dim.width,  Canvas.dim.ratios["lights2"][1]*Canvas.dim.height, Canvas.dim.thirdLightsWidth, this.lights.height)
            Canvas.behindLightsOne = Canvas.ctx.getImageData(Canvas.dim.ratios["lights1"][0]*Canvas.dim.width,  Canvas.dim.ratios["lights1"][1]*Canvas.dim.height, Canvas.dim.thirdLightsWidth, this.lights.height)    
            Canvas.behindSpin = Canvas.ctx.getImageData(Canvas.dim.ratios["spin"][0]*Canvas.dim.width,  Canvas.dim.ratios["spin"][1]*Canvas.dim.height, this.spin.width, this.spin.height)
            Canvas.behindMarker = Canvas.ctx.getImageData(Canvas.dim.ratios["marker"][0]*Canvas.dim.width,  Canvas.dim.ratios["marker"][1]*Canvas.dim.height, Canvas.marker.width/2, Canvas.marker.height)
        }

        if(Canvas.game.state !== Canvas.game.states["WON"]){
            Canvas.ctx.drawImage(this.spin, Canvas.dim.ratios["spin"][0]*Canvas.dim.width,  Canvas.dim.ratios["spin"][1]*Canvas.dim.height, this.spin.width*Canvas.dim.shrinkFactor, this.spin.height*Canvas.dim.shrinkFactor);
            Canvas.ctx.drawImage(this.lights, 0, 0, Canvas.dim.thirdLightsWidth, this.lights.height, Canvas.dim.ratios["lights1"][0]*Canvas.dim.width,  Canvas.dim.ratios["lights1"][1]*Canvas.dim.height, Canvas.dim.thirdLightsWidth*Canvas.dim.shrinkFactor, this.lights.height*Canvas.dim.shrinkFactor);
            Canvas.ctx.drawImage(this.lights, Canvas.dim.thirdLightsWidth, 0, Canvas.dim.thirdLightsWidth, this.lights.height, Canvas.dim.ratios["lights2"][0]*Canvas.dim.width,  Canvas.dim.ratios["lights2"][1]*Canvas.dim.height, Canvas.dim.thirdLightsWidth*Canvas.dim.shrinkFactor, this.lights.height*Canvas.dim.shrinkFactor);
        }

        if(Canvas.fontsLoaded) {Canvas.writeWords(45)} 

        if(Canvas.resizing || Canvas.initialDraw) {
            Canvas.dim.setDimensions(Canvas.supportDial.width, Canvas.supportDial.height, Canvas.dial.width, Canvas.dial.height, Canvas.spin.width)
            Canvas.initialDraw = false;
        }
    }


    public static drawLights(){
        Canvas.ctx.putImageData(Canvas.behindLightsOne, Canvas.dim.ratios["lights1"][0]*Canvas.dim.width, Canvas.dim.ratios["lights1"][1]*Canvas.dim.height)
        Canvas.ctx.putImageData(Canvas.behindLightsTwo, Canvas.dim.ratios["lights2"][0]*Canvas.dim.width, Canvas.dim.ratios["lights2"][1]*Canvas.dim.height)

        Canvas.ctx.drawImage(Canvas.lights, Canvas.dim.xLights1*Canvas.dim.thirdLightsWidth, 0, Canvas.dim.thirdLightsWidth, Canvas.lights.height, Canvas.dim.ratios["lights1"][0]*Canvas.dim.width,  Canvas.dim.ratios["lights1"][1]*Canvas.dim.height, Canvas.dim.thirdLightsWidth*Canvas.dim.shrinkFactor, Canvas.lights.height*Canvas.dim.shrinkFactor);
        Canvas.ctx.drawImage(Canvas.lights, Canvas.dim.xLights2*Canvas.dim.thirdLightsWidth, 0, Canvas.dim.thirdLightsWidth, Canvas.lights.height, Canvas.dim.ratios["lights2"][0]*Canvas.dim.width,  Canvas.dim.ratios["lights2"][1]*Canvas.dim.height, Canvas.dim.thirdLightsWidth*Canvas.dim.shrinkFactor, Canvas.lights.height*Canvas.dim.shrinkFactor);
    }



    // make it async?
    // Don't use hard numbers, save as constants 
    public static async generateSparks() {

        await Promise.all([Canvas.dim.getPoint(), Canvas.dim.getPoint(), Canvas.dim.getPoint(), Canvas.dim.getPoint(), Canvas.dim.getPoint(), Canvas.dim.getPoint(), Canvas.dim.getPoint(), Canvas.dim.getPoint()]).then(function(values){
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
                        Canvas.ctx.drawImage(Canvas.sparkSafe, Canvas.sparks[i].x-Canvas.sparks[i].size/2, Canvas.sparks[i].y-Canvas.sparks[i].size/2, Canvas.sparks[i].size, Canvas.sparks[i].size)
                    }
                    else {
                        Canvas.ctx.drawImage(Canvas.sparkSafe, Canvas.sparks[i].x-Canvas.sparks[i].size/2, Canvas.sparks[i].y-Canvas.sparks[i].size/2, Canvas.sparks[i].size, Canvas.sparks[i].size)
                    }
                }
            }
            if (Canvas.sparks[index].size == 55){
                Canvas.reduceSpark(index)
            }
            else {
                setTimeout(function(){Canvas.drawSparks(index)}, 60)
            }
        }
    }

    public static reduceSpark(index) {
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
                            Canvas.ctx.drawImage(Canvas.sparkSafe, Canvas.sparks[i].x-Canvas.sparks[i].size/2, Canvas.sparks[i].y-Canvas.sparks[i].size/2, Canvas.sparks[i].size, Canvas.sparks[i].size)
                        }
                        else {
                            Canvas.ctx.drawImage(Canvas.sparkSafe, Canvas.sparks[i].x-Canvas.sparks[i].size/2, Canvas.sparks[i].y-Canvas.sparks[i].size/2, Canvas.sparks[i].size, Canvas.sparks[i].size)
                        }
                    }
                }
                setTimeout(function(){Canvas.reduceSpark(index)}, 60)
            }
        }
    }

    // clip larger area so you don't get the line half way through
    public static drawBackgroundAndSupport(){
        // can implement DRY morE?
        // if change radius change increment
        // I shouldnt have to clip twice
        Canvas.drawLights()
        Canvas.ctx.save();
        Canvas.ctx.beginPath();
        Canvas.ctx.arc(Canvas.dim.centerSupport[0], Canvas.dim.centerSupport[1], Canvas.dim.radiusSupport+15, 0, Math.PI * 2);
        Canvas.ctx.clip();
        Canvas.ctx.drawImage(this.background, 0, 0, Canvas.dim.width, Canvas.dim.height);
        Canvas.ctx.drawImage(this.supportDial, Canvas.dim.ratios["supportDial"][0]*Canvas.dim.width,  Canvas.dim.ratios["supportDial"][1]*Canvas.dim.height, this.supportDial.width*Canvas.dim.shrinkFactor, this.supportDial.height*Canvas.dim.shrinkFactor);
        Canvas.ctx.restore();
    }

    // Method that flashes the "Spin" button. 
    // Called by a "setInterval"
    public static flashSpin(){
        Canvas.ctx.putImageData(Canvas.behindSpin, Canvas.dim.ratios["spin"][0]*Canvas.dim.width, Canvas.dim.ratios["spin"][1]*Canvas.dim.height)
        if(Canvas.spinOn){
            Canvas.spinOn = false
        }
        else {
            Canvas.ctx.drawImage(Canvas.spin, Canvas.dim.ratios["spin"][0]*Canvas.dim.width,  Canvas.dim.ratios["spin"][1]*Canvas.dim.height, Canvas.spin.width*Canvas.dim.shrinkFactor, Canvas.spin.height*Canvas.dim.shrinkFactor);
            Canvas.spinOn = true
        }
    }
}