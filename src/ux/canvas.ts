export abstract class Canvas {

    public static width: number;
    public static height: number;
    public static maxWidth: number = 916;
    public static maxHeight: number = 623;
    public static widthToHeightRatio: number = Canvas.maxWidth / Canvas.maxHeight
    public static heightToWidthRatio: number = Canvas.maxHeight / Canvas.maxWidth
    public static context: CanvasRenderingContext2D;
    // How far left is it, how far down, 
    // Do divisions once?
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
        "supportDial" : [(582/Canvas.maxWidth), (280/Canvas.maxHeight)]

    }

    public static init(el: HTMLCanvasElement) {
        Canvas.sizeCanvas(el)
        window.addEventListener('resize', function(){Canvas.sizeCanvas(el)}, false)
        Canvas.context = el.getContext("2d");
    }

    public static sizeCanvas(el: HTMLCanvasElement) {
        // If the browser is large enough scale the canvas to its maximum dimensions.
	    if(document.body.clientWidth > this.maxWidth && window.innerHeight > this.maxHeight) {
            el.width = Canvas.maxWidth;
            Canvas.width = Canvas.maxWidth
            el.height = Canvas.maxHeight;
            Canvas.height = Canvas.maxHeight
        }
        else {
            // If both width and height are smaller than max determine which ratio is smallest and rescale accordingly.
            // Else if its just width than scale to width otherwise its height and scale to height. 
            document.body.clientWidth < this.maxWidth && document.body.clientHeight < this.maxHeight 
                ? document.body.clientWidth/this.maxWidth <= document.body.clientHeight/this.maxHeight 
                    ? Canvas.scaleToWidth(el) 
                    : Canvas.scaleToHeight(el) 
                : document.body.clientWidth < this.maxWidth ? Canvas.scaleToWidth(el) : Canvas.scaleToHeight(el)
        }
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

    public static drawImages() {
        const shrinkFactor = Canvas.width/Canvas.maxWidth

        const background = new Image()
        background.src = '../../images/background_safe_minigame.png'
        background.onload = () => {
            Canvas.context.drawImage(background, 0, 0, Canvas.width, Canvas.height);
        }

        const safe = new Image()
        safe.src = '../../images/safe_minigame.png'
        safe.onload = () => {
            const widthFactor = safe.width*shrinkFactor
            const heightFactor = safe.height*shrinkFactor
            // Make a loop?
            Canvas.context.drawImage(safe, Canvas.ratios["safe1"][0]*Canvas.width,  Canvas.ratios["safe1"][1]*Canvas.height, widthFactor, heightFactor);
            Canvas.context.drawImage(safe, Canvas.ratios["safe2"][0]*Canvas.width,  Canvas.ratios["safe2"][1]*Canvas.height, widthFactor, heightFactor);
            Canvas.context.drawImage(safe, Canvas.ratios["safe3"][0]*Canvas.width,  Canvas.ratios["safe3"][1]*Canvas.height, widthFactor, heightFactor);
            Canvas.context.drawImage(safe, Canvas.ratios["safe4"][0]*Canvas.width,  Canvas.ratios["safe4"][1]*Canvas.height, widthFactor, heightFactor);
            Canvas.context.drawImage(safe, Canvas.ratios["safe5"][0]*Canvas.width,  Canvas.ratios["safe5"][1]*Canvas.height, widthFactor, heightFactor);
            Canvas.context.drawImage(safe, Canvas.ratios["safe6"][0]*Canvas.width,  Canvas.ratios["safe6"][1]*Canvas.height, widthFactor, heightFactor);
            Canvas.context.drawImage(safe, Canvas.ratios["safe7"][0]*Canvas.width,  Canvas.ratios["safe7"][1]*Canvas.height, widthFactor, heightFactor);
            Canvas.context.drawImage(safe, Canvas.ratios["safe8"][0]*Canvas.width,  Canvas.ratios["safe8"][1]*Canvas.height, widthFactor, heightFactor);
            Canvas.context.drawImage(safe, Canvas.ratios["safe9"][0]*Canvas.width,  Canvas.ratios["safe9"][1]*Canvas.height, widthFactor, heightFactor);
        }

        const screen = new Image()
        screen.src = '../../images/screen_safe_minigame.png'
        screen.onload = () => {
            Canvas.context.drawImage(screen, Canvas.ratios["screen"][0]*Canvas.width,  Canvas.ratios["screen"][1]*Canvas.height, screen.width*shrinkFactor, screen.height*shrinkFactor);
        }

        const supportDial = new Image()
        supportDial.src = '../../images/support_safe_dial_minigame.png'
        supportDial.onload = () => {
            Canvas.context.drawImage(supportDial, Canvas.ratios["supportDial"][0]*Canvas.width,  Canvas.ratios["supportDial"][1]*Canvas.height, supportDial.width*shrinkFactor, supportDial.height*shrinkFactor);
        }

        // const image2 = new Image()
        // image2.src = '../../images/safe_open_minigame.png'
        // image2.onload = () => {
        //     Canvas.context.drawImage(image2, unit*1.3,  unit*4, safe.width, safe.height);
        //     Canvas.context.drawImage(image2, unit*1.3,  unit*7);
        //     Canvas.context.drawImage(image2, unit*1.3,  unit*10);
        // }
    }

}