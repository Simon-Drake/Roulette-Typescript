import {Spark} from './Spark.js'
import {Game} from './Game.js'


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
        "supportDial" : [(582/Canvas.maxWidth), (280/Canvas.maxHeight)],
        "dial" : [(593/Canvas.maxWidth), (318/Canvas.maxHeight)],
        "spin" : [(695/Canvas.maxWidth), (420/Canvas.maxHeight)],
        "lights1" : [(582/Canvas.maxWidth), (270/Canvas.maxHeight)],
        "lights2" : [(758/Canvas.maxWidth), (270/Canvas.maxHeight)],
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
    public static images: HTMLElement[] = [Canvas.lights, Canvas.background, Canvas.safe, Canvas.safeOpen, Canvas.gold, Canvas.diamond,
        Canvas.coin, Canvas.ring, Canvas.notes, Canvas.sparkSafe, Canvas.screen, Canvas.supportDial, Canvas.dial, Canvas.spin, Canvas.winScreen]


        // Runtime state variables
    public static count: number = Canvas.images.length;
    public static fontsLoaded: boolean = false;
    public static spinOn: boolean = true;
    public static spinning: boolean = false;

    public static behindLightsOne: ImageData;
    public static behindLightsTwo: ImageData;
    public static behindSpin: ImageData;
    public static behindSafes: object = {}
    public static centerSupport: [number,number];
    public static centerDial: [number,number];
    public static sparks: Spark[] = [];
    public static currentRotation: number = 0;
    public static game: Game;


    // in app?
    public static glowInterval: number;
    public static flashInterval: number;
    



    // May be able to do this better
    public static xLights1: number = 1;
    public static xLights2: number = 2;

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
        this.ring.src =  '../../images/ring.png'
        this.notes.src =  '../../images/notes.png'
        this.gold.src =  '../../images/gold.png'
        this.diamond.src =  '../../images/diamond.png'
        this.winScreen.src =  '../../images/screen_safe_win.png'


        this.canvasElement = el

        // need false?
        window.addEventListener('resize', function(){Canvas.sizeCanvas()})
        // need to add if clicks again while spinning do nothing
        el.addEventListener('click', function(e){
            if(!Canvas.spinning)
                Canvas.intersect(e.offsetX, e.offsetY)
        })

        Canvas.context = el.getContext("2d");

        this.background.onload = this.dial.onload = this.lights.onload = this.safe.onload = this.supportDial.onload = this.coin.onload =
                this.ring.onload = this.notes.onload = this.spin.onload = this.safeOpen.onload = this.screen.onload = this.sparkSafe.onload = 
                this.gold.onload = this.diamond.onload = this.winScreen.onload = Canvas.counter

        setInterval(Canvas.changeLights, 1000)
        Canvas.glowInterval = setInterval(Canvas.supportGlow, 450)
        Canvas.flashInterval = setInterval(Canvas.flashSpin, 500)
    }


    public static intersect(x, y){
        let inside = Math.sqrt((Canvas.centerSupport[0]-x)**2 + (Canvas.centerSupport[1]-y)**2) < Canvas.radiusSpin
        if(inside){
            Canvas.spinning = true;
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
                rotation += 0.03;
                Canvas.rotate(rotation, 0)
                rotation >= antiClockwise
                ? setTimeout(function(){Canvas.spinWheel(rotation, antiClockwise, clockwise, antiClockwise2, state+1)}, 15)
                : setTimeout(function(){Canvas.spinWheel(rotation, antiClockwise, clockwise, antiClockwise2, state)}, 15)
                break;
            }
            case 1: {
                rotation -= 0.03;
                Canvas.rotate(rotation, 0)
                rotation <= clockwise
                ? setTimeout(function(){Canvas.spinWheel(rotation, antiClockwise, clockwise, antiClockwise2, state+1)}, 15)
                : setTimeout(function(){Canvas.spinWheel(rotation, antiClockwise, clockwise, antiClockwise2, state)}, 15)
                break;
            }
            case 2 : {
                rotation += 0.03;
                Canvas.rotate(rotation, 0)
                rotation >= (antiClockwise2 + clockwise)
                ? Canvas.evaluateScore(rotation)
                : setTimeout(function(){Canvas.spinWheel(rotation, antiClockwise, clockwise, antiClockwise2, state)}, 15)
                break;
            }
        }
    }
    
    public static evaluateScore(rotation){
        Canvas.currentRotation = rotation
        let result = Canvas.getResult(rotation)
        if(Canvas.game.unlockedSafes.indexOf(result) === -1) {
            Canvas.game.unlockedSafes.push(result)
            Canvas.openSafe(result)
            Canvas.assessWin(Canvas.game.boxes[result])
        }
    }

    public static assessWin(m){
        if (Canvas.game.unlockedMultipliers.has(m)) {
            Canvas.handleWin()
        }
        else {
            Canvas.game.unlockedMultipliers.add(m)
            Canvas.writeWords()
            Canvas.redDial(0)
        }
    }
    public static handleWin(){
        Canvas.deleteSparks()
        clearInterval(Canvas.glowInterval)
        clearInterval(Canvas.flashInterval)
        Canvas.context.drawImage(Canvas.winScreen, Canvas.ratios["screen"][0]*Canvas.width,  Canvas.ratios["screen"][1]*Canvas.height, Canvas.screen.width*Canvas.shrinkFactor, Canvas.screen.height*Canvas.shrinkFactor);

    }

    public static redDial(counter){
        if (counter == 10){
            Canvas.glowInterval = setInterval(Canvas.supportGlow, 450)
            Canvas.flashInterval = setInterval(Canvas.flashSpin, 500)
            Canvas.spinning = false;
        }
        else {
            Canvas.drawBackgroundAndSupport()
            counter % 2 == 0
            ? Canvas.rotate(Canvas.currentRotation, Canvas.dial.width/3)
            : Canvas.rotate(Canvas.currentRotation, 0)
        counter ++;
        setTimeout(function(){Canvas.redDial(counter)}, 200)
        }
    }

    public static openSafe(result){
        let s = "safe" + result.toString()

        Canvas.context.putImageData(Canvas.behindSafes[s], Canvas.ratios[s][0]*Canvas.width, Canvas.ratios[s][1]*Canvas.height)

        Canvas.context.drawImage(Canvas.safeOpen, Canvas.ratios[s][0]*Canvas.width + Canvas.openSafeXTranslate,  Canvas.ratios[s][1]*Canvas.height + Canvas.openSafeYTranslate, 
                    Canvas.safeOpen.width*Canvas.shrinkFactor, Canvas.safeOpen.height*Canvas.shrinkFactor);
        
        let image = Canvas.mapMultiplierToImage(Canvas.game.boxes[result])
        // /2 once
        Canvas.context.drawImage(image, 0, 0, image.width/2, image.height, Canvas.ratios[s][0]*Canvas.width + Canvas.priseXTranslate,  Canvas.ratios[s][1]*Canvas.height + Canvas.priseYTranslate, 
            image.width*Canvas.shrinkFactor/2, image.height*Canvas.shrinkFactor);
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
        Canvas.context.drawImage(this.dial, xTranslate, 0, this.dial.width/3, this.dial.height, Canvas.ratios["dial"][0]*Canvas.width-this.centerDial[0],  Canvas.ratios["dial"][1]*Canvas.height-this.centerDial[1], this.dial.width*Canvas.shrinkFactor/3, this.dial.height*Canvas.shrinkFactor); 
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
        Canvas.writeWords()
    }

    public static writeWords() {
        Canvas.context.drawImage(this.screen, Canvas.ratios["screen"][0]*Canvas.width,  Canvas.ratios["screen"][1]*Canvas.height, this.screen.width*Canvas.shrinkFactor, this.screen.height*Canvas.shrinkFactor);
        let fontSize = 45*Canvas.shrinkFactor
        Canvas.context.font = `${fontSize}px instructions`
        Canvas.context.fillText('Match a pair of symbols for a safe busting multiplier!', Canvas.ratios["instructionsTop"][0]*Canvas.width, Canvas.ratios["instructionsTop"][1]*Canvas.height)
        Canvas.context.fillText('TOUCH THE DIAL TO SPIN YOUR 4 DIGIT COMBINATION', Canvas.ratios["instructionsBottom"][0]*Canvas.width, Canvas.ratios["instructionsBottom"][1]*Canvas.height)
        Canvas.context.font = `${fontSize}px unlocked`
        Canvas.context.fillText(Canvas.getUnlockedSafesString(), Canvas.ratios["unlockedSafes"][0]*Canvas.width, Canvas.ratios["unlockedSafes"][1]*Canvas.height)
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
        if(Canvas.count === 0) {Canvas.sizeCanvas()}
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
        Canvas.behindSafes["safe1"] = Canvas.context.getImageData(Canvas.ratios["safe1"][0]*Canvas.width,  Canvas.ratios["safe1"][1]*Canvas.height, widthFactor, heightFactor)
        Canvas.behindSafes["safe2"] = Canvas.context.getImageData(Canvas.ratios["safe2"][0]*Canvas.width,  Canvas.ratios["safe2"][1]*Canvas.height, widthFactor, heightFactor)
        Canvas.behindSafes["safe3"] = Canvas.context.getImageData(Canvas.ratios["safe3"][0]*Canvas.width,  Canvas.ratios["safe3"][1]*Canvas.height, widthFactor, heightFactor)
        Canvas.behindSafes["safe4"] = Canvas.context.getImageData(Canvas.ratios["safe4"][0]*Canvas.width,  Canvas.ratios["safe4"][1]*Canvas.height, widthFactor, heightFactor)
        Canvas.behindSafes["safe5"] = Canvas.context.getImageData(Canvas.ratios["safe5"][0]*Canvas.width,  Canvas.ratios["safe5"][1]*Canvas.height, widthFactor, heightFactor)
        Canvas.behindSafes["safe6"] = Canvas.context.getImageData(Canvas.ratios["safe6"][0]*Canvas.width,  Canvas.ratios["safe6"][1]*Canvas.height, widthFactor, heightFactor)
        Canvas.behindSafes["safe7"] = Canvas.context.getImageData(Canvas.ratios["safe7"][0]*Canvas.width,  Canvas.ratios["safe7"][1]*Canvas.height, widthFactor, heightFactor)
        Canvas.behindSafes["safe8"] = Canvas.context.getImageData(Canvas.ratios["safe8"][0]*Canvas.width,  Canvas.ratios["safe8"][1]*Canvas.height, widthFactor, heightFactor)
        Canvas.behindSafes["safe9"] = Canvas.context.getImageData(Canvas.ratios["safe9"][0]*Canvas.width,  Canvas.ratios["safe9"][1]*Canvas.height, widthFactor, heightFactor)

        Canvas.context.drawImage(this.safe, Canvas.ratios["safe1"][0]*Canvas.width,  Canvas.ratios["safe1"][1]*Canvas.height, widthFactor, heightFactor);
        Canvas.context.drawImage(this.safe, Canvas.ratios["safe2"][0]*Canvas.width,  Canvas.ratios["safe2"][1]*Canvas.height, widthFactor, heightFactor);
        Canvas.context.drawImage(this.safe, Canvas.ratios["safe3"][0]*Canvas.width,  Canvas.ratios["safe3"][1]*Canvas.height, widthFactor, heightFactor);
        Canvas.context.drawImage(this.safe, Canvas.ratios["safe4"][0]*Canvas.width,  Canvas.ratios["safe4"][1]*Canvas.height, widthFactor, heightFactor);
        Canvas.context.drawImage(this.safe, Canvas.ratios["safe5"][0]*Canvas.width,  Canvas.ratios["safe5"][1]*Canvas.height, widthFactor, heightFactor);
        Canvas.context.drawImage(this.safe, Canvas.ratios["safe6"][0]*Canvas.width,  Canvas.ratios["safe6"][1]*Canvas.height, widthFactor, heightFactor);
        Canvas.context.drawImage(this.safe, Canvas.ratios["safe7"][0]*Canvas.width,  Canvas.ratios["safe7"][1]*Canvas.height, widthFactor, heightFactor);
        Canvas.context.drawImage(this.safe, Canvas.ratios["safe8"][0]*Canvas.width,  Canvas.ratios["safe8"][1]*Canvas.height, widthFactor, heightFactor);
        Canvas.context.drawImage(this.safe, Canvas.ratios["safe9"][0]*Canvas.width,  Canvas.ratios["safe9"][1]*Canvas.height, widthFactor, heightFactor);

        // Canvas.context.drawImage(this.screen, Canvas.ratios["screen"][0]*Canvas.width,  Canvas.ratios["screen"][1]*Canvas.height, this.screen.width*Canvas.shrinkFactor, this.screen.height*Canvas.shrinkFactor);

        Canvas.context.drawImage(this.supportDial, Canvas.ratios["supportDial"][0]*Canvas.width,  Canvas.ratios["supportDial"][1]*Canvas.height, this.supportDial.width*Canvas.shrinkFactor, this.supportDial.height*Canvas.shrinkFactor);

        Canvas.context.drawImage(this.dial, 0, 0, this.dial.width/3, this.dial.height, Canvas.ratios["dial"][0]*Canvas.width,  Canvas.ratios["dial"][1]*Canvas.height, this.dial.width*Canvas.shrinkFactor/3, this.dial.height*Canvas.shrinkFactor);

        Canvas.behindSpin = Canvas.context.getImageData(Canvas.ratios["spin"][0]*Canvas.width,  Canvas.ratios["spin"][1]*Canvas.height, this.spin.width, this.spin.height)
        Canvas.context.drawImage(this.spin, Canvas.ratios["spin"][0]*Canvas.width,  Canvas.ratios["spin"][1]*Canvas.height, this.spin.width*Canvas.shrinkFactor, this.spin.height*Canvas.shrinkFactor);

        // Do once
        // draw image under support dial?
        Canvas.behindLightsOne = Canvas.context.getImageData(Canvas.ratios["lights1"][0]*Canvas.width,  Canvas.ratios["lights1"][1]*Canvas.height, this.lights.width/3, this.lights.height)
        Canvas.context.drawImage(this.lights, 0, 0, this.lights.width/3, this.lights.height, Canvas.ratios["lights1"][0]*Canvas.width,  Canvas.ratios["lights1"][1]*Canvas.height, this.lights.width*Canvas.shrinkFactor/3, this.lights.height*Canvas.shrinkFactor);

        // Do /3 once
        Canvas.behindLightsTwo = Canvas.context.getImageData(Canvas.ratios["lights2"][0]*Canvas.width,  Canvas.ratios["lights2"][1]*Canvas.height, this.lights.width/3, this.lights.height)
        Canvas.context.drawImage(this.lights, this.lights.width/3, 0, this.lights.width/3, this.lights.height, Canvas.ratios["lights2"][0]*Canvas.width,  Canvas.ratios["lights2"][1]*Canvas.height, this.lights.width*Canvas.shrinkFactor/3, this.lights.height*Canvas.shrinkFactor);

        if(Canvas.fontsLoaded) {Canvas.writeWords()} 

        // Right place?
        Canvas.setDimensions()

    }

    public static flashSpin(){
        if(Canvas.spinOn){
            Canvas.context.putImageData(Canvas.behindSpin, Canvas.ratios["spin"][0]*Canvas.width, Canvas.ratios["spin"][1]*Canvas.height)
            Canvas.spinOn = false
        }
        else {
            Canvas.context.putImageData(Canvas.behindSpin, Canvas.ratios["spin"][0]*Canvas.width, Canvas.ratios["spin"][1]*Canvas.height)
            Canvas.context.drawImage(Canvas.spin, Canvas.ratios["spin"][0]*Canvas.width,  Canvas.ratios["spin"][1]*Canvas.height, Canvas.spin.width*Canvas.shrinkFactor, Canvas.spin.height*Canvas.shrinkFactor);
            Canvas.spinOn = true
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
        Canvas.context.putImageData(Canvas.behindLightsOne, Canvas.ratios["lights1"][0]*Canvas.width, Canvas.ratios["lights1"][1]*Canvas.height)
        Canvas.context.putImageData(Canvas.behindLightsTwo, Canvas.ratios["lights2"][0]*Canvas.width, Canvas.ratios["lights2"][1]*Canvas.height)


        Canvas.context.drawImage(Canvas.lights, Canvas.xLights1*Canvas.lights.width/3, 0, Canvas.lights.width/3, Canvas.lights.height, Canvas.ratios["lights1"][0]*Canvas.width,  Canvas.ratios["lights1"][1]*Canvas.height, Canvas.lights.width*Canvas.shrinkFactor/3, Canvas.lights.height*Canvas.shrinkFactor);

        Canvas.context.drawImage(Canvas.lights, Canvas.xLights2*Canvas.lights.width/3, 0, Canvas.lights.width/3, Canvas.lights.height, Canvas.ratios["lights2"][0]*Canvas.width,  Canvas.ratios["lights2"][1]*Canvas.height, Canvas.lights.width*Canvas.shrinkFactor/3, Canvas.lights.height*Canvas.shrinkFactor);


        Canvas.xLights1 < 2 
            ? Canvas.xLights1 ++ 
            : Canvas.xLights1 = 0

        // probably dont need this one
        Canvas.xLights2 < 2 
            ? Canvas.xLights2 ++ 
            : Canvas.xLights2 = 0
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
        if (!Canvas.spinning){
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
        for (let i = 0; i < Canvas.sparks.length; i++){ 
            delete Canvas.sparks[i]
        }
    }

    public static removeSpark(index) {
        if (!Canvas.spinning){
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

    public static drawBackgroundAndSupport(){
        // can implement DRY morE?
        // if change radius change increment
        // I shouldnt have to clip twice
        Canvas.context.save();
        Canvas.context.beginPath();
        Canvas.context.arc(Canvas.centerSupport[0], Canvas.centerSupport[1], Canvas.radiusSupport+15, 0, Math.PI * 2);
        Canvas.context.clip();
        Canvas.context.drawImage(this.background, 0, 0, Canvas.width, Canvas.height);
        Canvas.context.drawImage(this.supportDial, Canvas.ratios["supportDial"][0]*Canvas.width,  Canvas.ratios["supportDial"][1]*Canvas.height, this.supportDial.width*Canvas.shrinkFactor, this.supportDial.height*Canvas.shrinkFactor);
        Canvas.context.restore();
    }
}