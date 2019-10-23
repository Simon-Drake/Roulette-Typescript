import {Spark} from './Spark.js'


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export abstract class Canvas {

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
    public static screen: HTMLImageElement = new Image()
    public static supportDial: HTMLImageElement = new Image()
    public static sparkSafe: HTMLImageElement = new Image()
    public static dial: HTMLImageElement = new Image()
    public static spin: HTMLImageElement = new Image()
    public static images: HTMLElement[] = [Canvas.lights, Canvas.background, Canvas.safe, 
        Canvas.sparkSafe, Canvas.screen, Canvas.supportDial, Canvas.dial, Canvas.spin]
    

    // Runtime state variables
    public static count: number = Canvas.images.length;
    public static fontsLoaded: boolean = false;
    public static spinOn: boolean = true;
    public static spinning: boolean = false;
    public static behindLightsOne: ImageData;
    public static behindLightsTwo: ImageData;
    public static behindSpin: ImageData;
    public static radiusSupport: number;
    public static radiusSpin: number;
    public static radiusDial: number;
    public static centerSupport: [number,number];
    public static lastID: number = 0;
    public static sparks: Spark[] = [];
    public static batch: number = 0
    public static glowInterval: number;
    public static currentRouletteN: number = 2;



    // May be able to do this better
    public static xLights1: number = 1;
    public static xLights2: number = 2;

    public static init(el: HTMLCanvasElement) {

        Canvas.loadFonts()

        this.lights.src = '../../images/leds_safe_dial_minigame.png'
        this.background.src = '../../images/background_safe_minigame.png'
        this.safe.src = '../../images/safe_minigame.png'
        this.screen.src = '../../images/screen_safe_minigame.png'
        this.supportDial.src = '../../images/support_safe_dial_minigame.png'
        this.sparkSafe.src = '../../images/spark_safe.png'
        this.dial.src = '../../images/safe_dial_minigame.png'
        this.spin.src = '../../images/text_spin_safe_dial_minigame.png'



        this.canvasElement = el

        // need false?
        window.addEventListener('resize', function(){Canvas.sizeCanvas()}, false)
        // need to add if clicks again while spinning do nothing
        el.addEventListener('click', function(e){Canvas.intersect(e.offsetX, e.offsetY)}, false)

        Canvas.context = el.getContext("2d");

        this.background.onload = this.dial.onload = this.lights.onload = this.safe.onload = this.supportDial.onload = 
                this.spin.onload = this.screen.onload = this.sparkSafe.onload = Canvas.counter

        setInterval(Canvas.changeLights, 1000)
        Canvas.glowInterval = setInterval(Canvas.supportGlow, 450)
        setInterval(Canvas.flashSpin, 500)
    }


    public static intersect(x, y){
        let inside = Math.sqrt((Canvas.centerSupport[0]-x)**2 + (Canvas.centerSupport[1]-y)**2) < Canvas.radiusSpin
        if(inside){
            Canvas.spinning = true;
            // delete all current sparks
            clearInterval(Canvas.glowInterval)
            Canvas.drawBackgroundAndDial()
            let state
            let antiClockwise = Math.round(Math.random())*Math.random()*Math.PI
            antiClockwise
            ? state = 0
            : state = 1
            Canvas.spinWheel(0, antiClockwise, -Canvas.degToRadians(360/9*getRandomInt(9)), Canvas.degToRadians(360/9*getRandomInt(9)), state)
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
                Canvas.rotate(rotation)
                rotation >= antiClockwise
                ? setTimeout(function(){Canvas.spinWheel(rotation, antiClockwise, clockwise, antiClockwise2, state+1)}, 40)
                : setTimeout(function(){Canvas.spinWheel(rotation, antiClockwise, clockwise, antiClockwise2, state)}, 40)
                break;
            }
            case 1: {
                rotation -= 0.05;
                Canvas.rotate(rotation)
                rotation <= clockwise
                ? setTimeout(function(){Canvas.spinWheel(rotation, antiClockwise, clockwise, antiClockwise2, state+1)}, 40)
                : setTimeout(function(){Canvas.spinWheel(rotation, antiClockwise, clockwise, antiClockwise2, state)}, 40)
                break;
            }
            case 2 : {
                rotation += 0.05;
                Canvas.rotate(rotation)
                rotation >= (antiClockwise2 + clockwise)
                ? console.log(Canvas.getResult(rotation))
                : setTimeout(function(){Canvas.spinWheel(rotation, antiClockwise, clockwise, antiClockwise2, state)}, 40)
                break;
            }
        }
    }

    public static rotate(rotation){
        Canvas.context.translate(this.centerSupport[0], this.centerSupport[1])
        Canvas.context.rotate(rotation)
        Canvas.context.drawImage(this.dial, 0, 0, this.dial.width/3, this.dial.height, Canvas.ratios["dial"][0]*Canvas.width-this.centerSupport[0],  Canvas.ratios["dial"][1]*Canvas.height-this.centerSupport[1], this.dial.width*Canvas.shrinkFactor/3, this.dial.height*Canvas.shrinkFactor); 
        Canvas.context.setTransform(1,0,0,1,0,0)
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
        let fontSize = 45*Canvas.shrinkFactor
        Canvas.context.font = `${fontSize}px instructions`
        Canvas.context.fillText('Match a pair of symbols for a safe busting multiplier!', Canvas.ratios["instructionsTop"][0]*Canvas.width, Canvas.ratios["instructionsTop"][1]*Canvas.height)
        Canvas.context.fillText('TOUCH THE DIAL TO SPIN YOUR 4 DIGIT COMBINATION', Canvas.ratios["instructionsBottom"][0]*Canvas.width, Canvas.ratios["instructionsBottom"][1]*Canvas.height)
        Canvas.context.font = `${fontSize}px unlocked`
        Canvas.context.fillText('-   -   -   -', Canvas.ratios["unlockedSafes"][0]*Canvas.width, Canvas.ratios["unlockedSafes"][1]*Canvas.height)
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
                : document.body.clientWidth < this.maxWidth ? Canvas.scaleToWidth(Canvas.canvasElement) : Canvas.scaleToHeight(Canvas.canvasElement)
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
        Canvas.context.drawImage(this.safe, Canvas.ratios["safe1"][0]*Canvas.width,  Canvas.ratios["safe1"][1]*Canvas.height, widthFactor, heightFactor);
        Canvas.context.drawImage(this.safe, Canvas.ratios["safe2"][0]*Canvas.width,  Canvas.ratios["safe2"][1]*Canvas.height, widthFactor, heightFactor);
        Canvas.context.drawImage(this.safe, Canvas.ratios["safe3"][0]*Canvas.width,  Canvas.ratios["safe3"][1]*Canvas.height, widthFactor, heightFactor);
        Canvas.context.drawImage(this.safe, Canvas.ratios["safe4"][0]*Canvas.width,  Canvas.ratios["safe4"][1]*Canvas.height, widthFactor, heightFactor);
        Canvas.context.drawImage(this.safe, Canvas.ratios["safe5"][0]*Canvas.width,  Canvas.ratios["safe5"][1]*Canvas.height, widthFactor, heightFactor);
        Canvas.context.drawImage(this.safe, Canvas.ratios["safe6"][0]*Canvas.width,  Canvas.ratios["safe6"][1]*Canvas.height, widthFactor, heightFactor);
        Canvas.context.drawImage(this.safe, Canvas.ratios["safe7"][0]*Canvas.width,  Canvas.ratios["safe7"][1]*Canvas.height, widthFactor, heightFactor);
        Canvas.context.drawImage(this.safe, Canvas.ratios["safe8"][0]*Canvas.width,  Canvas.ratios["safe8"][1]*Canvas.height, widthFactor, heightFactor);
        Canvas.context.drawImage(this.safe, Canvas.ratios["safe9"][0]*Canvas.width,  Canvas.ratios["safe9"][1]*Canvas.height, widthFactor, heightFactor);

        Canvas.context.drawImage(this.screen, Canvas.ratios["screen"][0]*Canvas.width,  Canvas.ratios["screen"][1]*Canvas.height, this.screen.width*Canvas.shrinkFactor, this.screen.height*Canvas.shrinkFactor);

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
            Canvas.drawBackgroundAndDial()
            for (let i = 0; i < Canvas.sparks.length; i++){ 
                if (set.has(i)) {
                    Canvas.sparks[i].size += 5;
                    Canvas.context.drawImage(Canvas.sparkSafe, Canvas.sparks[i].x-Canvas.sparks[i].size/2, Canvas.sparks[i].y-Canvas.sparks[i].size/2, Canvas.sparks[i].size, Canvas.sparks[i].size)
                }
                else {
                    Canvas.context.drawImage(Canvas.sparkSafe, Canvas.sparks[i].x-Canvas.sparks[i].size/2, Canvas.sparks[i].y-Canvas.sparks[i].size/2, Canvas.sparks[i].size, Canvas.sparks[i].size)
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

    public static removeSpark(index) {
        if (!Canvas.spinning){
            const set = new Set([index, index+1, index+2, index+3, index+4, index+5, index+6, index+7])
            if (Canvas.sparks[index].size == 0) {
                console.log("done")
                // delete sparks
            }
            else{
                Canvas.drawBackgroundAndDial()
                for (let i = 0; i < Canvas.sparks.length; i++){ 
                    if (set.has(i)) {
                        Canvas.sparks[i].size -= 5;
                        Canvas.context.drawImage(Canvas.sparkSafe, Canvas.sparks[i].x-Canvas.sparks[i].size/2, Canvas.sparks[i].y-Canvas.sparks[i].size/2, Canvas.sparks[i].size, Canvas.sparks[i].size)
                    }
                    else {
                        Canvas.context.drawImage(Canvas.sparkSafe, Canvas.sparks[i].x-Canvas.sparks[i].size/2, Canvas.sparks[i].y-Canvas.sparks[i].size/2, Canvas.sparks[i].size, Canvas.sparks[i].size)
                    }
                }
                setTimeout(function(){Canvas.removeSpark(index)}, 60)
            }
        }
    }

    public static drawBackgroundAndDial(){
        // can implement DRY morE?
        // if change radius change increment
        // I shouldnt have to clip twice
        Canvas.context.save();
        Canvas.context.beginPath();
        // hard code?
        Canvas.context.arc(Canvas.centerSupport[0], Canvas.centerSupport[1], Canvas.radiusSupport+15, 0, Math.PI * 2);
        Canvas.context.clip();
        Canvas.context.drawImage(this.background, 0, 0, Canvas.width, Canvas.height);
        Canvas.context.restore();

        Canvas.context.save();
        Canvas.context.beginPath();
        Canvas.context.arc(Canvas.centerSupport[0], Canvas.centerSupport[1], Canvas.radiusSupport+15, 0, Math.PI * 2);
        Canvas.context.clip();
        Canvas.context.drawImage(this.supportDial, Canvas.ratios["supportDial"][0]*Canvas.width,  Canvas.ratios["supportDial"][1]*Canvas.height, this.supportDial.width*Canvas.shrinkFactor, this.supportDial.height*Canvas.shrinkFactor);
        Canvas.context.drawImage(this.dial, 0, 0, this.dial.width/3, this.dial.height, Canvas.ratios["dial"][0]*Canvas.width,  Canvas.ratios["dial"][1]*Canvas.height, this.dial.width*Canvas.shrinkFactor/3, this.dial.height*Canvas.shrinkFactor);
        if(Canvas.spinOn){
            Canvas.context.drawImage(this.spin, Canvas.ratios["spin"][0]*Canvas.width,  Canvas.ratios["spin"][1]*Canvas.height, this.spin.width*Canvas.shrinkFactor, this.spin.height*Canvas.shrinkFactor);
        }
        Canvas.context.restore();
    }
}