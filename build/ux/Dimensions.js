export class Dimensions {
    constructor(el) {
        this.maxWidth = 916;
        this.maxHeight = 623;
        this.widthToHeightRatio = this.maxWidth / this.maxHeight;
        this.heightToWidthRatio = this.maxHeight / this.maxWidth;
        this.openSafeXTranslate = -35;
        this.openSafeYTranslate = -25;
        this.priseXTranslate = this.openSafeXTranslate + 10;
        this.priseYTranslate = this.openSafeYTranslate + 6;
        this.fontXTranslate = this.priseXTranslate + 65;
        this.fontYTranslate = this.priseYTranslate + 110;
        this.starXTranslate = this.fontXTranslate - 15;
        this.starYTranslate = this.fontYTranslate - 70;
        this.blackFont = 4;
        // May be able to do this better
        this.xLights1 = 0;
        this.xLights2 = 1;
        // How far left and how far down as a ratio of the size of the Canvas
        // Needed for browser resizing 
        this.ratios = {
            "safe1": [(50 / this.maxWidth), (173 / this.maxHeight)],
            "safe2": [(220 / this.maxWidth), (173 / this.maxHeight)],
            "safe3": [(390 / this.maxWidth), (173 / this.maxHeight)],
            "safe4": [(50 / this.maxWidth), (320 / this.maxHeight)],
            "safe5": [(220 / this.maxWidth), (320 / this.maxHeight)],
            "safe6": [(390 / this.maxWidth), (320 / this.maxHeight)],
            "safe7": [(50 / this.maxWidth), (467 / this.maxHeight)],
            "safe8": [(220 / this.maxWidth), (467 / this.maxHeight)],
            "safe9": [(390 / this.maxWidth), (467 / this.maxHeight)],
            "screen": [(578 / this.maxWidth), (183 / this.maxHeight)],
            "winScreen": [(600 / this.maxWidth), (183 / this.maxHeight)],
            "supportDial": [(582 / this.maxWidth), (280 / this.maxHeight)],
            "dial": [(593 / this.maxWidth), (318 / this.maxHeight)],
            "marker": [(709 / this.maxWidth), (270 / this.maxHeight)],
            "spin": [(695 / this.maxWidth), (420 / this.maxHeight)],
            "lights1": [(582 / this.maxWidth), (270 / this.maxHeight)],
            "lights2": [(758 / this.maxWidth), (270 / this.maxHeight)],
            "spinning": [(270 / this.maxWidth), (115 / this.maxHeight)],
            "instructions": [(65 / this.maxWidth), (30 / this.maxHeight)],
            "instructionsTop": [(68 / this.maxWidth), (65 / this.maxHeight)],
            "instructionsBottom": [(68 / this.maxWidth), (110 / this.maxHeight)],
            "unlockedSafes": [(642 / this.maxWidth), (243 / this.maxHeight)]
        };
        this.canvasElement = el;
    }
    sizeCanvas() {
        // If the browser is large enough scale the canvas to its maximum dimensions.
        if (document.body.clientWidth > this.maxWidth && window.innerHeight > this.maxHeight) {
            this.canvasElement.width = this.maxWidth;
            this.width = this.maxWidth;
            this.canvasElement.height = this.maxHeight;
            this.height = this.maxHeight;
        }
        else {
            // If both width and height are smaller than max determine which ratio is smallest and rescale accordingly.
            // Else if its just width than scale to width otherwise its height and scale to height. 
            document.body.clientWidth < this.maxWidth && document.body.clientHeight < this.maxHeight
                ? document.body.clientWidth / this.maxWidth <= document.body.clientHeight / this.maxHeight
                    ? this.scaleToWidth()
                    : this.scaleToHeight()
                : document.body.clientWidth < this.maxWidth
                    ? this.scaleToWidth()
                    : this.scaleToHeight();
        }
        this.shrinkFactor = this.width / this.maxWidth;
    }
    scaleToWidth() {
        this.canvasElement.width = document.body.clientWidth * 0.95;
        this.width = document.body.clientWidth * 0.95;
        this.canvasElement.height = this.width * this.heightToWidthRatio;
        this.height = this.width * this.heightToWidthRatio;
    }
    scaleToHeight() {
        this.canvasElement.height = document.body.clientHeight * 0.95;
        this.height = document.body.clientHeight * 0.95;
        this.canvasElement.width = this.height * this.widthToHeightRatio;
        this.width = this.height * this.widthToHeightRatio;
    }
    setDimensions(supportWidth, supportHeight, dialWidth, dialHeight, spinWidth) {
        this.radiusSupport = (supportWidth - 15) / 2 * this.shrinkFactor;
        this.radiusSpin = spinWidth / 2 * this.shrinkFactor;
        this.radiusDial = this.radiusSupport * 0.9;
        // plus 30 on the height for marker, hard coded?
        this.centerSupport = [this.ratios["supportDial"][0] * this.width + supportWidth / 2 * this.shrinkFactor, this.ratios["supportDial"][1] * this.height + 30 * this.shrinkFactor + (supportHeight - 30 * this.shrinkFactor) / 2 * this.shrinkFactor];
        this.centerDial = [this.ratios["dial"][0] * this.width + dialWidth / 6 * this.shrinkFactor, this.ratios["dial"][1] * this.height + dialHeight / 2 * this.shrinkFactor];
    }
}
