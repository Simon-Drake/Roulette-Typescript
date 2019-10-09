export class Canvas {
    static init(el) {
        Canvas.sizeCanvas(el);
        window.addEventListener('resize', function () { Canvas.sizeCanvas(el); }, false);
        Canvas.context = el.getContext("2d");
    }
    static sizeCanvas(el) {
        // If the browser is large enough scale the canvas to its maximum dimensions.
        if (document.body.clientWidth > this.maxWidth && window.innerHeight > this.maxHeight) {
            el.width = Canvas.maxWidth;
            Canvas.width = Canvas.maxWidth;
            el.height = Canvas.maxHeight;
            Canvas.height = Canvas.maxHeight;
        }
        else {
            // If both width and height are smaller than max determine which ratio is smallest and rescale accordingly.
            // Else if its just width than scale to width otherwise its height and scale to height. 
            document.body.clientWidth < this.maxWidth && document.body.clientHeight < this.maxHeight
                ? document.body.clientWidth / this.maxWidth <= document.body.clientHeight / this.maxHeight
                    ? Canvas.scaleToWidth(el)
                    : Canvas.scaleToHeight(el)
                : document.body.clientWidth < this.maxWidth ? Canvas.scaleToWidth(el) : Canvas.scaleToHeight(el);
        }
        Canvas.drawImages();
    }
    static scaleToWidth(el) {
        el.width = document.body.clientWidth * 0.95;
        Canvas.width = document.body.clientWidth * 0.95;
        el.height = Canvas.width * this.heightToWidthRatio;
        Canvas.height = Canvas.width * this.heightToWidthRatio;
    }
    static scaleToHeight(el) {
        el.height = document.body.clientHeight * 0.95;
        Canvas.height = document.body.clientHeight * 0.95;
        el.width = Canvas.height * this.widthToHeightRatio;
        Canvas.width = Canvas.height * this.widthToHeightRatio;
    }
    static drawImages() {
        var image = new Image();
        image.src = '../../images/background_safe_minigame.png';
        image.onload = () => {
            Canvas.context.drawImage(image, 0, 0, Canvas.width, Canvas.height);
        };
        const safe = new Image();
        safe.src = '../../images/safe_minigame.png';
        console.log(Canvas.ratios["safe1"][0] * Canvas.width);
        safe.onload = () => {
            Canvas.context.drawImage(safe, Canvas.ratios["safe1"][0] * Canvas.width, Canvas.ratios["safe1"][1] * Canvas.height);
            // Canvas.context.drawImage(safe, unit*1.3,  unit*7);
            // Canvas.context.drawImage(safe, unit*1.3,  unit*10);
            // Canvas.context.drawImage(safe, unit*4.9,  unit*4);
            // Canvas.context.drawImage(safe, unit*4.9,  unit*7);
            // Canvas.context.drawImage(safe, unit*4.9,  unit*10);
            // Canvas.context.drawImage(safe, unit*8.5,  unit*4);
            // Canvas.context.drawImage(safe, unit*8.5,  unit*7);
            // Canvas.context.drawImage(safe, unit*8.5,  unit*10);
        };
        // const image2 = new Image()
        // image2.src = '../../images/safe_open_minigame.png'
        // image2.onload = () => {
        //     Canvas.context.drawImage(image2, unit*1.3,  unit*4, safe.width, safe.height);
        //     Canvas.context.drawImage(image2, unit*1.3,  unit*7);
        //     Canvas.context.drawImage(image2, unit*1.3,  unit*10);
        // }
    }
}
Canvas.maxWidth = 916;
Canvas.maxHeight = 623;
Canvas.widthToHeightRatio = Canvas.maxWidth / Canvas.maxHeight;
Canvas.heightToWidthRatio = Canvas.maxHeight / Canvas.maxWidth;
// How far left is it, how far down, 
Canvas.ratios = {
    "safe1": [(50 / Canvas.maxWidth), (180 / Canvas.maxHeight)]
};
