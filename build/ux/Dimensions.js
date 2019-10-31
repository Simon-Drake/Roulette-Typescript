var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class Dim {
    constructor(el) {
        this.widthToHeightRatio = Dim.maxWidth / Dim.maxHeight;
        this.heightToWidthRatio = Dim.maxHeight / Dim.maxWidth;
        this.winImageSX = 0;
        this.xLights1 = 0;
        this.xLights2 = 1;
        // How far left and how far down as a ratio of the size of the Canvas
        // Needed for browser resizing 
        this.ratios = {
            "safe1": [(50 / Dim.maxWidth), (173 / Dim.maxHeight)],
            "safe2": [(220 / Dim.maxWidth), (173 / Dim.maxHeight)],
            "safe3": [(390 / Dim.maxWidth), (173 / Dim.maxHeight)],
            "safe4": [(50 / Dim.maxWidth), (320 / Dim.maxHeight)],
            "safe5": [(220 / Dim.maxWidth), (320 / Dim.maxHeight)],
            "safe6": [(390 / Dim.maxWidth), (320 / Dim.maxHeight)],
            "safe7": [(50 / Dim.maxWidth), (467 / Dim.maxHeight)],
            "safe8": [(220 / Dim.maxWidth), (467 / Dim.maxHeight)],
            "safe9": [(390 / Dim.maxWidth), (467 / Dim.maxHeight)],
            "screen": [(578 / Dim.maxWidth), (183 / Dim.maxHeight)],
            "winScreen": [(600 / Dim.maxWidth), (183 / Dim.maxHeight)],
            "supportDial": [(582 / Dim.maxWidth), (280 / Dim.maxHeight)],
            "dial": [(593 / Dim.maxWidth), (318 / Dim.maxHeight)],
            "marker": [(709 / Dim.maxWidth), (270 / Dim.maxHeight)],
            "spin": [(695 / Dim.maxWidth), (420 / Dim.maxHeight)],
            "lights1": [(582 / Dim.maxWidth), (270 / Dim.maxHeight)],
            "lights2": [(758 / Dim.maxWidth), (270 / Dim.maxHeight)],
            "spinning": [(270 / Dim.maxWidth), (115 / Dim.maxHeight)],
            "noLuckText": [(100 / Dim.maxWidth), (115 / Dim.maxHeight)],
            "safeText": [(333 / Dim.maxWidth), (115 / Dim.maxHeight)],
            "replayText": [(290 / Dim.maxWidth), (330 / Dim.maxHeight)],
            "instructions": [(65 / Dim.maxWidth), (30 / Dim.maxHeight)],
            "instructionsTop": [(68 / Dim.maxWidth), (65 / Dim.maxHeight)],
            "instructionsBottom": [(68 / Dim.maxWidth), (110 / Dim.maxHeight)],
            "panelBackground": [(31 / Dim.maxWidth), (12 / Dim.maxHeight)],
            "screenBackground": [(600 / Dim.maxWidth), (186 / Dim.maxHeight)],
            "unlockedSafes": [(642 / Dim.maxWidth), (243 / Dim.maxHeight)],
            "winText": [(662 / Dim.maxWidth), (253 / Dim.maxHeight)]
        };
        Dim.canvasEl = el;
    }
    sizeCanvas() {
        // If the browser is large enough scale the canvas to its maximum dimensions.
        if (document.body.clientWidth > Dim.maxWidth && window.innerHeight > Dim.maxHeight) {
            Dim.canvasEl.width = Dim.maxWidth;
            this.width = Dim.maxWidth;
            Dim.canvasEl.height = Dim.maxHeight;
            this.height = Dim.maxHeight;
        }
        else {
            // If both width and height are smaller than max determine which ratio is smallest and rescale accordingly.
            // Else if its just width than scale to width otherwise its height and scale to height. 
            document.body.clientWidth < Dim.maxWidth && document.body.clientHeight < Dim.maxHeight
                ? document.body.clientWidth / Dim.maxWidth <= document.body.clientHeight / Dim.maxHeight
                    ? this.scaleToWidth()
                    : this.scaleToHeight()
                : document.body.clientWidth < Dim.maxWidth
                    ? this.scaleToWidth()
                    : this.scaleToHeight();
        }
        this.shrink = this.width / Dim.maxWidth;
    }
    changeSX(width) {
        this.winImageSX == 0
            ? this.winImageSX = width / 2
            : this.winImageSX = 0;
    }
    scaleToWidth() {
        Dim.canvasEl.width = document.body.clientWidth * 0.95;
        this.width = document.body.clientWidth * 0.95;
        Dim.canvasEl.height = this.width * this.heightToWidthRatio;
        this.height = this.width * this.heightToWidthRatio;
    }
    scaleToHeight() {
        Dim.canvasEl.height = document.body.clientHeight * 0.95;
        this.height = document.body.clientHeight * 0.95;
        Dim.canvasEl.width = this.height * this.widthToHeightRatio;
        this.width = this.height * this.widthToHeightRatio;
    }
    setDimensions(supportWidth, supportHeight, dialWidth, dialHeight, spinWidth) {
        this.radiusSupport = (supportWidth - 15) / 2 * this.shrink;
        this.radiusSpin = spinWidth / 2 * this.shrink;
        this.radiusDial = this.radiusSupport * 0.9;
        this.centrDial = [this.ratios["dial"][0] * this.width + dialWidth / 6 * this.shrink, this.ratios["dial"][1] * this.height + dialHeight / 2 * this.shrink];
    }
    // decrease radius. some are on outer grip
    getPoint() {
        return __awaiter(this, void 0, void 0, function* () {
            const a = Math.random() * 2 * Math.PI;
            // hardcode
            const r = (this.radiusSupport - 5 * this.shrink) * Math.sqrt(Math.random());
            if (Math.sqrt(Math.pow((r * Math.cos(a)), 2) + Math.pow((r * Math.sin(a)), 2)) > this.radiusDial) {
                return [r * Math.cos(a) + this.centrDial[0], r * Math.sin(a) + this.centrDial[1]];
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
Dim.maxWidth = 916;
Dim.maxHeight = 623;
Dim.openSafeXTrans = -35;
Dim.openSafeYTrans = -25;
Dim.priseXTrans = Dim.openSafeXTrans + 10;
Dim.priseYTrans = Dim.openSafeYTrans + 6;
Dim.fontXTrans = Dim.priseXTrans + 65;
Dim.fontYTrans = Dim.priseYTrans + 110;
Dim.starXTrans = Dim.fontXTrans - 15;
Dim.starYTrans = Dim.fontYTrans - 70;
Dim.instFontSize = 45;
Dim.headrFontSize = 110;
Dim.winScrnFontSize = 75;
Dim.replayFontSize = 75;
Dim.maxStarDistance = 200;
Dim.blackFont = 4;
