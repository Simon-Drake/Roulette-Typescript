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
        if (window.innerWidth > this.maxWidth && window.innerHeight > this.maxHeight) {
            el.width = Canvas.maxWidth;
            console.log("passing here2");
            Canvas.width = Canvas.maxWidth;
            el.height = Canvas.maxHeight;
            Canvas.height = Canvas.maxHeight;
        }
        else {
            el.width = window.innerWidth;
            Canvas.width = window.innerWidth;
            el.height = window.innerHeight;
            Canvas.height = window.innerHeight;
        }
    }
    static drawImages() {
        console.log(Canvas.ratios);
        const unit = 38;
        console.log(unit * 1.3);
        console.log(unit * 4.9);
        console.log(unit * 8.5);
        var image = new Image();
        image.src = '../../images/background_safe_minigame.png';
        image.onload = () => {
            Canvas.context.drawImage(image, 0, 0);
        };
        const safe = new Image();
        safe.src = '../../images/safe_minigame.png';
        safe.onload = () => {
            Canvas.context.drawImage(safe, Canvas.ratios["safe1"][0] * Canvas.width, Canvas.ratios["safe1"][1] * Canvas.height);
            Canvas.context.drawImage(safe, unit * 1.3, unit * 7);
            Canvas.context.drawImage(safe, unit * 1.3, unit * 10);
            Canvas.context.drawImage(safe, unit * 4.9, unit * 4);
            Canvas.context.drawImage(safe, unit * 4.9, unit * 7);
            Canvas.context.drawImage(safe, unit * 4.9, unit * 10);
            Canvas.context.drawImage(safe, unit * 8.5, unit * 4);
            Canvas.context.drawImage(safe, unit * 8.5, unit * 7);
            Canvas.context.drawImage(safe, unit * 8.5, unit * 10);
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
Canvas.ratios = {
    "safe1": [(50 / Canvas.maxWidth) * 100, (180 / Canvas.maxHeight) * 100]
};
