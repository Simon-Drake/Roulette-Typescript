import {Spark} from './Spark.js'
export abstract class Canvas {

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
    public static images: HTMLElement[] = [Canvas.lights, Canvas.background, Canvas.safe, 
        Canvas.sparkSafe, Canvas.screen, Canvas.supportDial]
    

    // Runtime state variables
    public static count: number = Canvas.images.length;
    public static fontsLoaded: boolean = false;
    public static behindLightsOne: ImageData;
    public static behindLightsTwo: ImageData;
    public static radiusSupport: number;
    public static radiusDial: number;
    public static centerSupport: [number,number];
    public static lastID: number = 0;
    public static sparks: object = {};


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

        this.canvasElement = el

        window.addEventListener('resize', function(){Canvas.sizeCanvas()}, false)
        Canvas.context = el.getContext("2d");

        this.background.onload = this.lights.onload = this.safe.onload = this.supportDial.onload = this.screen.onload = this.sparkSafe.onload = Canvas.counter
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

    public static setDimensions(){

        Canvas.radiusSupport = (this.supportDial.width-6)/2*Canvas.shrinkFactor
        Canvas.radiusDial = Canvas.radiusSupport*0.8
        // plus 30 on the height for marker
        Canvas.centerSupport = [Canvas.ratios["supportDial"][0]*Canvas.width+this.supportDial.width/2*Canvas.shrinkFactor, Canvas.ratios["supportDial"][1]*Canvas.height+30*Canvas.shrinkFactor+(Canvas.supportDial.height-30*Canvas.shrinkFactor)/2*Canvas.shrinkFactor]


        Canvas.supportGlow()

        // good for loop?
        for (let i = 0; i < 20; i ++){
            // Canvas.supportGlow()
        }
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

    public static async getPoint(){
        const a = Math.random() * 2 * Math.PI
        const r = Canvas.radiusSupport * Math.sqrt(Math.random())
        console.log(Canvas.centerSupport)

        if(Math.sqrt((r*Math.cos(a))**2 + (r*Math.sin(a))**2) > Canvas.radiusDial) {
            return [r*Math.cos(a)+Canvas.centerSupport[0], r*Math.sin(a)+Canvas.centerSupport[1]]
        }
        else {
            return Canvas.getPoint()
        }

    }

    // make it async?
    // Don't use hard numbers, save as constants 
    public static supportGlow() {
        Canvas.getPoint().then(function(values){

            let spark = new Spark(values, 1)
            Canvas.sparks[Canvas.lastID] = spark
            Canvas.lastID ++;

            // const imageData = Canvas.context.getImageData(values[0]-25, values[1]-25, 50 , 50)
            for(let i = 1; i <= 20; i++) {
                setTimeout(function(){Canvas.drawSpark(values, i*1)}, 1000+i*100)
            }

            // set in 100 ms timeslots, don't call every 3 ms
            for(let i = 20; i >= 1; i--) {
                setTimeout(function(){Canvas.removeSpark(values, i*1)}, 5100-i*100)
            }

            console.log(Canvas.sparks)


        })
    }

    public static drawSpark(values, radius) {

        Canvas.context.save();
        Canvas.context.beginPath();
        Canvas.context.arc(values[0], values[1], radius, 0, Math.PI * 2);
        Canvas.context.clip();
        Canvas.context.drawImage(Canvas.sparkSafe, values[0]-radius, values[1]-radius, 2*radius , 2*radius)
        Canvas.context.restore();
    }
    public static removeSpark(values, radius) {
        console.log(Date.now())

        // Try without save and restore
        Canvas.context.save();
        Canvas.context.beginPath();
        Canvas.context.arc(values[0], values[1], radius+1, 0, Math.PI * 2);
        Canvas.context.clip();
        Canvas.context.drawImage(this.background, 0, 0, Canvas.width, Canvas.height);
        Canvas.context.restore();

        Canvas.context.save();
        Canvas.context.beginPath();
        Canvas.context.arc(values[0], values[1], radius+2, 0, Math.PI * 2);
        Canvas.context.clip();
        Canvas.context.drawImage(this.supportDial, Canvas.ratios["supportDial"][0]*Canvas.width,  Canvas.ratios["supportDial"][1]*Canvas.height, this.supportDial.width*Canvas.shrinkFactor, this.supportDial.height*Canvas.shrinkFactor);
        Canvas.context.restore();

        Canvas.context.save();
        Canvas.context.beginPath();
        Canvas.context.arc(values[0], values[1], radius-1, 0, Math.PI * 2);
        Canvas.context.clip();
        Canvas.context.drawImage(Canvas.sparkSafe, values[0]-25, values[1]-25,50 ,50)
        Canvas.context.restore();

        console.log(Date.now())
    }
}

        // //Testing custom event making
        // this.supportDial.addEventListener('redraw', function(e){
        //     console.log("triggered i think")
        // })
        // let event = new CustomEvent('redraw')
        // this.supportDial.dispatchEvent(event)