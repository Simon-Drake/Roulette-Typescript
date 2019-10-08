export class Canvas {
    // Do I need el?
    static init(el) {
        Canvas.resizeCanvas(el);
        window.addEventListener('resize', function () { Canvas.resizeCanvas(el); }, false);
        Canvas.context = el.getContext("2d");
    }
    static resizeCanvas(el) {
        console.log("passing here");
        // ? things
        if (document.body.clientWidth > this.maxWidth && window.innerHeight > this.maxHeight) {
            el.width = Canvas.maxWidth;
            console.log("passing here2");
            Canvas.width = Canvas.maxWidth;
            el.height = Canvas.maxHeight;
            Canvas.height = Canvas.maxHeight;
        }
        else {
            //change canvas to this ? or this to canvas?
            // find smallest ratio - which one you have to scale to
            // Save as constants
            if (document.body.clientWidth < this.maxWidth) {
                el.width = document.body.clientWidth * 0.95;
                Canvas.width = document.body.clientWidth * 0.95;
                el.height = Canvas.width * 0.68;
                Canvas.height = Canvas.width * 0.68;
            }
            else {
                el.height = document.body.clientHeight * 0.95;
                Canvas.height = document.body.clientHeight * 0.95;
                el.width = Canvas.height * 1.47;
                Canvas.width = Canvas.height * 1.47;
            }
        }
        Canvas.drawImages();
        console.log(document.body.clientWidth);
    }
    static drawImages() {
        console.log("passing here3");
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
// How far left is it, how far down, 
Canvas.ratios = {
    "safe1": [(50 / Canvas.maxWidth), (180 / Canvas.maxHeight)]
};
