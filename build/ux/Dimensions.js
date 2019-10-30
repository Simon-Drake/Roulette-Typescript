var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class Dimensions {
    constructor(el) {
        this.maxWidth = 916;
        this.maxHeight = 623;
        this.widthToHeightRatio = this.maxWidth / this.maxHeight;
        this.heightToWidthRatio = this.maxHeight / this.maxWidth;
        this.openSafeXTrans = -35;
        this.openSafeYTrans = -25;
        this.priseXTrans = this.openSafeXTrans + 10;
        this.priseYTrans = this.openSafeYTrans + 6;
        this.fontXTrans = this.priseXTrans + 65;
        this.fontYTrans = this.priseYTrans + 110;
        this.starXTrans = this.fontXTrans - 15;
        this.starYTrans = this.fontYTrans - 70;
        this.blackFont = 4;
        this.winImageSX = 0;
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
            "panelBackground": [(31 / this.maxWidth), (12 / this.maxHeight)],
            "screenBackground": [(600 / this.maxWidth), (186 / this.maxHeight)],
            "unlockedSafes": [(642 / this.maxWidth), (243 / this.maxHeight)]
        };
        this.canvasEl = el;
    }
    sizeCanvas() {
        // If the browser is large enough scale the canvas to its maximum dimensions.
        if (document.body.clientWidth > this.maxWidth && window.innerHeight > this.maxHeight) {
            this.canvasEl.width = this.maxWidth;
            this.width = this.maxWidth;
            this.canvasEl.height = this.maxHeight;
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
        this.shrink = this.width / this.maxWidth;
    }
    changeSX(width) {
        this.winImageSX == 0
            ? this.winImageSX = width / 2
            : this.winImageSX = 0;
    }
    scaleToWidth() {
        this.canvasEl.width = document.body.clientWidth * 0.95;
        this.width = document.body.clientWidth * 0.95;
        this.canvasEl.height = this.width * this.heightToWidthRatio;
        this.height = this.width * this.heightToWidthRatio;
    }
    scaleToHeight() {
        this.canvasEl.height = document.body.clientHeight * 0.95;
        this.height = document.body.clientHeight * 0.95;
        this.canvasEl.width = this.height * this.widthToHeightRatio;
        this.width = this.height * this.widthToHeightRatio;
    }
    setDimensions(supportWidth, supportHeight, dialWidth, dialHeight, spinWidth) {
        this.radiusSupport = (supportWidth - 15) / 2 * this.shrink;
        this.radiusSpin = spinWidth / 2 * this.shrink;
        this.radiusDial = this.radiusSupport * 0.9;
        // plus 30 on the height for marker, hard coded?
        this.centerSupport = [this.ratios["supportDial"][0] * this.width + supportWidth / 2 * this.shrink, this.ratios["supportDial"][1] * this.height + 30 * this.shrink + (supportHeight - 30 * this.shrink) / 2 * this.shrink];
        this.centerDial = [this.ratios["dial"][0] * this.width + dialWidth / 6 * this.shrink, this.ratios["dial"][1] * this.height + dialHeight / 2 * this.shrink];
    }
    // decrease radius. some are on outer grip
    getPoint() {
        return __awaiter(this, void 0, void 0, function* () {
            const a = Math.random() * 2 * Math.PI;
            // hardcode
            const r = (this.radiusSupport - 5) * Math.sqrt(Math.random());
            if (Math.sqrt(Math.pow((r * Math.cos(a)), 2) + Math.pow((r * Math.sin(a)), 2)) > this.radiusDial) {
                return [r * Math.cos(a) + this.centerSupport[0], r * Math.sin(a) + this.centerSupport[1]];
            }
            else {
                return this.getPoint();
            }
        });
    }
    // Can we do change lights with save and restore? What is more expensive?
    changeLights() {
        // Change the sx translation for both lights
        this.xLights1 < 2
            ? this.xLights1++
            : this.xLights1 = 0;
        this.xLights2 < 2
            ? this.xLights2++
            : this.xLights2 = 0;
    }
}
