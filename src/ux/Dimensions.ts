export class Dim{

        public static canvasEl: HTMLCanvasElement;

        public static maxWidth: number = 916;
        public static maxHeight: number = 623;
        public static openSafeXTrans: number = -35
        public static openSafeYTrans: number = -25
        public static priseXTrans: number = Dim.openSafeXTrans + 10
        public static priseYTrans: number = Dim.openSafeYTrans + 6
        public static fontXTrans: number = Dim.priseXTrans + 65
        public static fontYTrans: number = Dim.priseYTrans + 110
        public static starXTrans: number = Dim.fontXTrans - 15
        public static starYTrans: number = Dim.fontYTrans - 70

        public static instFontSize = 45
        public static headrFontSize = 110
        public static winScrnFontSize = 75
        public static replayFontSize = 75
        public static maxStarDistance = 200
        public static blackFont = 4

        // Dimensions
        public width: number;
        public height: number;
        public widthToHeightRatio: number = Dim.maxWidth / Dim.maxHeight
        public heightToWidthRatio: number = Dim.maxHeight / Dim.maxWidth
        public shrink: number;
        public radiusSupport: number;
        public radiusSpin: number;
        public radiusDial: number;
        public centrDial: [number,number];

        public thirdLightsW: number;
        public thirdDialW: number;
        public winImageSX: number = 0;    
        public xLights1: number = 0;
        public xLights2: number = 1;
        public scale: number = 1
        public scaleDir: number = 1





    
        // How far left and how far down as a ratio of the size of the Canvas
        // Needed for browser resizing 
        public ratios: object = {
            "safe1" : [(50/Dim.maxWidth), (173/Dim.maxHeight)],
            "safe2" : [(220/Dim.maxWidth), (173/Dim.maxHeight)],
            "safe3" : [(390/Dim.maxWidth), (173/Dim.maxHeight)],
            "safe4" : [(50/Dim.maxWidth), (320/Dim.maxHeight)],
            "safe5" : [(220/Dim.maxWidth), (320/Dim.maxHeight)],
            "safe6" : [(390/Dim.maxWidth), (320/Dim.maxHeight)],
            "safe7" : [(50/Dim.maxWidth), (467/Dim.maxHeight)],
            "safe8" : [(220/Dim.maxWidth), (467/Dim.maxHeight)],
            "safe9" : [(390/Dim.maxWidth), (467/Dim.maxHeight)],
            "screen" : [(578/Dim.maxWidth), (183/Dim.maxHeight)],
            "winScreen" : [(600/Dim.maxWidth), (183/Dim.maxHeight)],
            "supportDial" : [(582/Dim.maxWidth), (280/Dim.maxHeight)],
            "dial" : [(593/Dim.maxWidth), (318/Dim.maxHeight)],
            "marker" : [(709/Dim.maxWidth), (270/Dim.maxHeight)],
            "spin" : [(695/Dim.maxWidth), (420/Dim.maxHeight)],
            "lights1" : [(582/Dim.maxWidth), (270/Dim.maxHeight)],
            "lights2" : [(758/Dim.maxWidth), (270/Dim.maxHeight)],
            "spinning" : [(270/Dim.maxWidth), (115/Dim.maxHeight)],
            "noLuckText" : [(100/Dim.maxWidth), (115/Dim.maxHeight)],
            "safeText" : [(333/Dim.maxWidth), (115/Dim.maxHeight)],
            "replayText" : [(290/Dim.maxWidth), (330/Dim.maxHeight)],
            "instructions" : [(65/Dim.maxWidth), (30/Dim.maxHeight)],
            "instructionsTop" : [(68/Dim.maxWidth), (65/Dim.maxHeight)],
            "instructionsBottom" : [(68/Dim.maxWidth), (110/Dim.maxHeight)],
            "panelBackground" : [(31/Dim.maxWidth), (12/Dim.maxHeight)],
            "screenBackground" : [(600/Dim.maxWidth), (186/Dim.maxHeight)],
            "unlockedSafes" : [(642/Dim.maxWidth), (243/Dim.maxHeight)],
            "winText" : [(662/Dim.maxWidth), (253/Dim.maxHeight)]
        }

    constructor(el){
        Dim.canvasEl = el
    }

    public sizeCanvas() {
        // If the browser is large enough scale the canvas to its maximum dimensions.
	    if(document.body.clientWidth > Dim.maxWidth && window.innerHeight > Dim.maxHeight) {
            Dim.canvasEl.width = Dim.maxWidth;
            this.width = Dim.maxWidth
            Dim.canvasEl.height = Dim.maxHeight;
            this.height = Dim.maxHeight
        }
        else {
            // If both width and height are smaller than max determine which ratio is smallest and rescale accordingly.
            // Else if its just width than scale to width otherwise its height and scale to height. 
            document.body.clientWidth < Dim.maxWidth && document.body.clientHeight < Dim.maxHeight 
                ? document.body.clientWidth/Dim.maxWidth <= document.body.clientHeight/Dim.maxHeight 
                    ? this.scaleToWidth() 
                    : this.scaleToHeight() 
                : document.body.clientWidth < Dim.maxWidth 
                    ? this.scaleToWidth() 
                    : this.scaleToHeight()
        }
        this.shrink = this.width/Dim.maxWidth
    }


    public changeSX(width){
        this.winImageSX == 0
            ? this.winImageSX = width/2
            : this.winImageSX = 0
    }

    private scaleToWidth() {
        Dim.canvasEl.width = document.body.clientWidth*0.95;
        this.width = document.body.clientWidth*0.95;
        Dim.canvasEl.height = this.width*this.heightToWidthRatio;
        this.height = this.width*this.heightToWidthRatio;
    }

    private scaleToHeight() {
        Dim.canvasEl.height = document.body.clientHeight*0.95;
        this.height = document.body.clientHeight*0.95;
        Dim.canvasEl.width = this.height*this.widthToHeightRatio;
        this.width = this.height*this.widthToHeightRatio;
    }


    public setDimensions(supportWidth, supportHeight, dialWidth, dialHeight, spinWidth){
        this.radiusSupport = (supportWidth-15)/2*this.shrink
        this.radiusSpin = spinWidth/2*this.shrink
        this.radiusDial = this.radiusSupport*0.9
        this.centrDial = [this.ratios["dial"][0]*this.width+dialWidth/6*this.shrink, this.ratios["dial"][1]*this.height+dialHeight/2*this.shrink]

    }

    // decrease radius. some are on outer grip
    public async getPoint(){
        const a = Math.random() * 2 * Math.PI
        // hardcode
        const r = (this.radiusSupport-5*this.shrink) * Math.sqrt(Math.random())

        if(Math.sqrt((r*Math.cos(a))**2 + (r*Math.sin(a))**2) > this.radiusDial) {
            return [r*Math.cos(a)+this.centrDial[0], r*Math.sin(a)+this.centrDial[1]]
        }
        else {
            return this.getPoint()
        }
    }

    // Can we do change lights with save and restore? What is more expensive?
    public changeLights() {
        // Change the sx translation for both lights
        this.xLights1 < 2 
            ? this.xLights1 ++ 
            : this.xLights1 = 0

        this.xLights2 < 2 
            ? this.xLights2 ++ 
            : this.xLights2 = 0
    }

    public changeScale(){
        this.scale += 0.05 * this.scaleDir

        if(this.scale > 1.4)
            this.scaleDir = -1

        if(this.scale <= 1)
            this.scaleDir = +1
    }

}