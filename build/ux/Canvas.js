var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Spark } from './Spark.js';
import { Star } from './Star.js';
// done in 2 classes
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
export class Canvas {
    static init(el, game) {
        Canvas.game = game;
        Canvas.loadFonts();
        this.lights.src = '../../images/leds_safe_dial_minigame.png';
        this.background.src = '../../images/background_safe_minigame.png';
        this.safe.src = '../../images/safe_minigame.png';
        this.screen.src = '../../images/screen_safe_minigame.png';
        this.supportDial.src = '../../images/support_safe_dial_minigame.png';
        this.sparkSafe.src = '../../images/spark_safe.png';
        this.dial.src = '../../images/safe_dial_minigame.png';
        this.spin.src = '../../images/text_spin_safe_dial_minigame.png';
        this.safeOpen.src = '../../images/safe_open_minigame.png';
        this.coin.src = '../../images/coins.png';
        this.marker.src = '../../images/marker.png';
        this.ring.src = '../../images/ring.png';
        this.notes.src = '../../images/notes.png';
        this.gold.src = '../../images/gold.png';
        this.diamond.src = '../../images/diamond.png';
        this.winScreen.src = '../../images/screen_safe_win.png';
        this.star.src = '../../images/star.png';
        this.canvasElement = el;
        // need false?
        window.addEventListener('resize', function () {
            Canvas.resizing = true;
            clearInterval(Canvas.glowInterval);
            clearInterval(Canvas.flashInterval);
            Canvas.deleteSparks();
            Canvas.sizeCanvas();
            Canvas.glowInterval = setInterval(Canvas.supportGlow, 450);
            Canvas.flashInterval = setInterval(Canvas.flashSpin, 500);
            setTimeout(function () { Canvas.resizing = false; }, 50);
        });
        // need to add if clicks again while spinning do nothing
        el.addEventListener('click', function (e) {
            if (!Canvas.spinning)
                Canvas.intersect(e.offsetX, e.offsetY);
        });
        Canvas.context = el.getContext("2d");
        this.background.onload = this.dial.onload = this.lights.onload = this.safe.onload = this.supportDial.onload = this.coin.onload =
            this.ring.onload = this.notes.onload = this.spin.onload = this.safeOpen.onload = this.screen.onload = this.sparkSafe.onload =
                this.gold.onload = this.diamond.onload = this.winScreen.onload = this.marker.onload = this.star.onload = Canvas.counter;
        setInterval(Canvas.changeLights, 1000);
        Canvas.glowInterval = setInterval(Canvas.supportGlow, 450);
        Canvas.flashInterval = setInterval(Canvas.flashSpin, 500);
    }
    /// JUST A COMMMENT : need to play with radiuses still, some sparks is getting left ourside
    static intersect(x, y) {
        let inside = Math.sqrt(Math.pow((Canvas.centerSupport[0] - x), 2) + Math.pow((Canvas.centerSupport[1] - y), 2)) < Canvas.radiusSpin;
        if (inside) {
            Canvas.spinning = true;
            Canvas.spinOn = false;
            Canvas.game.spins += 1;
            // delete all current sparks
            Canvas.deleteSparks();
            clearInterval(Canvas.glowInterval);
            clearInterval(Canvas.flashInterval);
            Canvas.drawBackgroundAndSupport();
            // dont need to rotate here, right?
            let state;
            let antiClockwise = Math.round(Math.random()) * Math.random() * Math.PI;
            antiClockwise
                ? state = 0
                : state = 1;
            Canvas.spinWheel(Canvas.currentRotation, antiClockwise, -Canvas.degToRadians(360 / 9 * getRandomInt(9)), Canvas.degToRadians(360 / 9 * getRandomInt(9)), state);
        }
    }
    // should be static
    static degToRadians(deg) {
        return deg * Math.PI / 180;
    }
    static getResult(rotation) {
        // hard
        return Canvas.ifZeroReturn9((2 - Math.round(rotation / 0.7) + 9) % 9);
    }
    static ifZeroReturn9(n) {
        return n == 0 ? 9 : n;
    }
    // 0.7 is one slice
    // put in a state variable
    // shouldnt be static?
    static spinWheel(rotation, antiClockwise, clockwise, antiClockwise2, state) {
        switch (state) {
            case 0: {
                rotation += 0.05;
                Canvas.rotate(rotation, 0);
                rotation >= antiClockwise
                    ? setTimeout(function () { Canvas.spinWheel(rotation, antiClockwise, clockwise, antiClockwise2, state + 1); }, 20)
                    : setTimeout(function () { Canvas.spinWheel(rotation, antiClockwise, clockwise, antiClockwise2, state); }, 20);
                break;
            }
            case 1: {
                rotation -= 0.05;
                Canvas.rotate(rotation, 0);
                rotation <= clockwise
                    ? setTimeout(function () { Canvas.spinWheel(rotation, antiClockwise, clockwise, antiClockwise2, state + 1); }, 20)
                    : setTimeout(function () { Canvas.spinWheel(rotation, antiClockwise, clockwise, antiClockwise2, state); }, 20);
                break;
            }
            case 2: {
                rotation += 0.05;
                Canvas.rotate(rotation, 0);
                rotation >= (antiClockwise2 + clockwise - 0.01)
                    ? Canvas.evaluateScore(rotation)
                    : setTimeout(function () { Canvas.spinWheel(rotation, antiClockwise, clockwise, antiClockwise2, state); }, 20);
                break;
            }
        }
    }
    static evaluateScore(rotation) {
        // Some DRY stuff to handle here 
        Canvas.currentRotation = rotation;
        let result = Canvas.getResult(rotation);
        if (Canvas.game.unlockedSafes.indexOf(result) === -1) {
            Canvas.game.unlockedSafes.push(result);
            Canvas.openSafe(result);
            Canvas.assessWin(Canvas.game.boxes[result]);
        }
        else {
            Canvas.glowInterval = setInterval(Canvas.supportGlow, 450);
            Canvas.flashInterval = setInterval(Canvas.flashSpin, 500);
            Canvas.spinning = false;
        }
    }
    // may be better way to do this, new dict?
    static returnBox(m, boxes) {
        for (let i = 0; i < boxes.length; i++) {
            if (Canvas.game.boxes[boxes[i]] == m)
                return boxes[i];
        }
    }
    static assessWin(m) {
        if (Canvas.game.unlockedMultipliers.has(m)) {
            Canvas.won = true;
            Canvas.handleWin();
            Canvas.game.winSafes = [Canvas.game.unlockedSafes[Canvas.game.unlockedSafes.length - 1], Canvas.returnBox(m, Canvas.game.unlockedSafes.splice(0, Canvas.game.unlockedSafes.length - 1))];
            Canvas.game.winImage = Canvas.mapMultiplierToImage(Canvas.game.boxes[Canvas.game.winSafes[0]]);
            Canvas.starParticles();
        }
        else {
            Canvas.game.unlockedMultipliers.add(m);
            Canvas.writeWords();
            Canvas.redDial(0);
        }
    }
    static handleWin() {
        // better place to put i?
        Canvas.spinOn = false;
        Canvas.deleteSparks();
        clearInterval(Canvas.glowInterval);
        clearInterval(Canvas.flashInterval);
        Canvas.context.drawImage(Canvas.winScreen, Canvas.ratios["winScreen"][0] * Canvas.width, Canvas.ratios["winScreen"][1] * Canvas.height, Canvas.winScreen.width * Canvas.shrinkFactor, Canvas.winScreen.height * Canvas.shrinkFactor);
        let fontSize = 75 * Canvas.shrinkFactor;
        Canvas.context.font = `${fontSize}px unlocked`;
        // hard
        Canvas.context.fillText("WIN", Canvas.ratios["unlockedSafes"][0] * Canvas.width + 20, Canvas.ratios["unlockedSafes"][1] * Canvas.height + 10);
        setInterval(function () { Canvas.winSpin(0.18, true); }, 35);
    }
    static starParticles() {
        // done twice
        let s1 = "safe" + Canvas.game.winSafes[0].toString();
        let s2 = "safe" + Canvas.game.winSafes[1].toString();
        for (let i = 0; i < 10; i++) {
            Canvas.stars.push(new Star(Canvas.ratios[s1][0] * Canvas.width + Canvas.starXTranslate * Canvas.shrinkFactor, Canvas.ratios[s1][1] * Canvas.height + Canvas.starYTranslate * Canvas.shrinkFactor, 20 + 80 * Math.random()));
            Canvas.stars.push(new Star(Canvas.ratios[s2][0] * Canvas.width + Canvas.starXTranslate * Canvas.shrinkFactor, Canvas.ratios[s2][1] * Canvas.height + Canvas.starYTranslate * Canvas.shrinkFactor, 20 + 80 * Math.random()));
        }
        // better way to do this?
        setInterval(function () { Canvas.drawStars(true); }, 100);
    }
    static drawStars(move) {
        // done twice
        let s1 = "safe" + Canvas.game.winSafes[0].toString();
        let s2 = "safe" + Canvas.game.winSafes[1].toString();
        let image = Canvas.game.winImage;
        Canvas.drawImages();
        Canvas.winSpin(0, false);
        for (let i = 0; i < Canvas.stars.length; i++) {
            if (move) {
                Canvas.stars[i].x += Canvas.stars[i].dx;
                Canvas.stars[i].y += Canvas.stars[i].dy;
            }
            Canvas.context.drawImage(Canvas.star, Canvas.stars[i].x, Canvas.stars[i].y, Canvas.stars[i].size * Canvas.shrinkFactor, Canvas.stars[i].size * Canvas.shrinkFactor);
        }
        Canvas.context.drawImage(image, 0, 0, image.width / 2, image.height, Canvas.ratios[s1][0] * Canvas.width + Canvas.priseXTranslate * Canvas.shrinkFactor, Canvas.ratios[s1][1] * Canvas.height + Canvas.priseYTranslate * Canvas.shrinkFactor, image.width * Canvas.shrinkFactor / 2, image.height * Canvas.shrinkFactor);
        Canvas.context.drawImage(image, 0, 0, image.width / 2, image.height, Canvas.ratios[s2][0] * Canvas.width + Canvas.priseXTranslate * Canvas.shrinkFactor, Canvas.ratios[s2][1] * Canvas.height + Canvas.priseYTranslate * Canvas.shrinkFactor, image.width * Canvas.shrinkFactor / 2, image.height * Canvas.shrinkFactor);
    }
    static winSpin(increment, drawStars) {
        Canvas.drawBackgroundAndSupport();
        Canvas.context.putImageData(Canvas.behindMarker, Canvas.ratios["marker"][0] * Canvas.width, Canvas.ratios["marker"][1] * Canvas.height);
        Canvas.context.drawImage(Canvas.marker, Canvas.marker.width / 2, 0, Canvas.marker.width / 2, Canvas.marker.height, Canvas.ratios["marker"][0] * Canvas.width, Canvas.ratios["marker"][1] * Canvas.height, Canvas.marker.width * Canvas.shrinkFactor / 2, Canvas.marker.height * Canvas.shrinkFactor);
        Canvas.currentRotation = Canvas.currentRotation + increment;
        Canvas.rotate(Canvas.currentRotation, Canvas.thirdDialWidth * 2);
        if (drawStars)
            Canvas.drawStars(false);
    }
    static redDial(counter) {
        if (counter == 10) {
            Canvas.glowInterval = setInterval(Canvas.supportGlow, 450);
            Canvas.flashInterval = setInterval(Canvas.flashSpin, 500);
            Canvas.spinning = false;
        }
        else {
            Canvas.drawBackgroundAndSupport();
            if (counter % 2 == 0) {
                Canvas.rotate(Canvas.currentRotation, Canvas.thirdDialWidth);
                // hard
                Canvas.context.drawImage(Canvas.marker, 0, 0, Canvas.marker.width / 2, Canvas.marker.height, Canvas.ratios["marker"][0] * Canvas.width, Canvas.ratios["marker"][1] * Canvas.height, Canvas.marker.width * Canvas.shrinkFactor / 2, Canvas.marker.height * Canvas.shrinkFactor);
            }
            else {
                Canvas.context.putImageData(Canvas.behindMarker, Canvas.ratios["marker"][0] * Canvas.width, Canvas.ratios["marker"][1] * Canvas.height);
                Canvas.rotate(Canvas.currentRotation, 0);
            }
            counter++;
            setTimeout(function () { Canvas.redDial(counter); }, 200);
        }
    }
    static openSafe(result) {
        let s = "safe" + result.toString();
        // need to scale for browser resize
        Canvas.context.putImageData(Canvas.behindSafes[s], Canvas.ratios[s][0] * Canvas.width, Canvas.ratios[s][1] * Canvas.height);
        Canvas.context.drawImage(Canvas.safeOpen, Canvas.ratios[s][0] * Canvas.width + Canvas.openSafeXTranslate * Canvas.shrinkFactor, Canvas.ratios[s][1] * Canvas.height + Canvas.openSafeYTranslate * Canvas.shrinkFactor, Canvas.safeOpen.width * Canvas.shrinkFactor, Canvas.safeOpen.height * Canvas.shrinkFactor);
        let image = Canvas.mapMultiplierToImage(Canvas.game.boxes[result]);
        // /2 once
        Canvas.context.drawImage(image, 0, 0, image.width / 2, image.height, Canvas.ratios[s][0] * Canvas.width + Canvas.priseXTranslate * Canvas.shrinkFactor, Canvas.ratios[s][1] * Canvas.height + Canvas.priseYTranslate * Canvas.shrinkFactor, image.width * Canvas.shrinkFactor / 2, image.height * Canvas.shrinkFactor);
        let fontSize = 65 * Canvas.shrinkFactor;
        Canvas.context.font = `${fontSize}px unlocked`;
        Canvas.context.fillText(`x${Canvas.game.boxes[result]}`, Canvas.ratios[s][0] * Canvas.width + Canvas.fontXTranslate * Canvas.shrinkFactor - 3 * Canvas.shrinkFactor, Canvas.ratios[s][1] * Canvas.height + Canvas.fontYTranslate * Canvas.shrinkFactor + 3 * Canvas.shrinkFactor);
        Canvas.context.fillStyle = 'white';
        // hard
        Canvas.context.fillText(`x${Canvas.game.boxes[result]}`, Canvas.ratios[s][0] * Canvas.width + Canvas.fontXTranslate * Canvas.shrinkFactor, Canvas.ratios[s][1] * Canvas.height + Canvas.fontYTranslate * Canvas.shrinkFactor);
        Canvas.context.fillStyle = 'black';
    }
    static mapMultiplierToImage(multiplier) {
        // need all square brackets?
        switch (multiplier) {
            case 15: {
                return Canvas.coin;
            }
            case 16: {
                return Canvas.ring;
            }
            case 17: {
                return Canvas.notes;
            }
            case 18: {
                return Canvas.gold;
            }
            case 19: {
                return Canvas.diamond;
            }
        }
    }
    static rotate(rotation, xTranslate) {
        Canvas.context.translate(this.centerDial[0], this.centerDial[1]);
        Canvas.context.rotate(rotation);
        Canvas.context.drawImage(this.dial, xTranslate, 0, Canvas.thirdDialWidth, this.dial.height, Canvas.ratios["dial"][0] * Canvas.width - this.centerDial[0], Canvas.ratios["dial"][1] * Canvas.height - this.centerDial[1], Canvas.thirdDialWidth * Canvas.shrinkFactor, this.dial.height * Canvas.shrinkFactor);
        Canvas.context.setTransform(1, 0, 0, 1, 0, 0);
        if (Canvas.spinOn) {
            Canvas.context.drawImage(this.spin, Canvas.ratios["spin"][0] * Canvas.width, Canvas.ratios["spin"][1] * Canvas.height, this.spin.width * Canvas.shrinkFactor, this.spin.height * Canvas.shrinkFactor);
        }
    }
    static loadFonts() {
        return __awaiter(this, void 0, void 0, function* () {
            const unl = new FontFace('unlocked', 'url(../../src/fonts/TitanOne-Regular.ttf)');
            const inst = new FontFace('instructions', 'url(../../src/fonts/Dimbo-Italic.ttf)');
            yield Promise.all([unl.load(), inst.load()]);
            document.fonts.add(unl);
            document.fonts.add(inst);
            Canvas.fontsLoaded = true;
            Canvas.writeWords();
        });
    }
    static writeWords() {
        Canvas.context.drawImage(this.screen, Canvas.ratios["screen"][0] * Canvas.width, Canvas.ratios["screen"][1] * Canvas.height, this.screen.width * Canvas.shrinkFactor, this.screen.height * Canvas.shrinkFactor);
        let fontSize = 45 * Canvas.shrinkFactor;
        Canvas.context.font = `${fontSize}px instructions`;
        Canvas.context.fillText('Match a pair of symbols for a safe busting multiplier!', Canvas.ratios["instructionsTop"][0] * Canvas.width, Canvas.ratios["instructionsTop"][1] * Canvas.height);
        Canvas.context.fillText('TOUCH THE DIAL TO SPIN YOUR 4 DIGIT COMBINATION', Canvas.ratios["instructionsBottom"][0] * Canvas.width, Canvas.ratios["instructionsBottom"][1] * Canvas.height);
        Canvas.context.font = `${fontSize}px unlocked`;
        Canvas.context.fillText(Canvas.getUnlockedSafesString(), Canvas.ratios["unlockedSafes"][0] * Canvas.width, Canvas.ratios["unlockedSafes"][1] * Canvas.height);
    }
    static getUnlockedSafesString() {
        let s = '';
        for (let i = 0; i < Canvas.game.unlockedSafes.length; i++) {
            s += `${Canvas.game.unlockedSafes[i]}   `;
        }
        while (s.length < 16) {
            s += "-   ";
        }
        return s.substr(0, s.length - 3);
    }
    static counter() {
        Canvas.count--;
        if (Canvas.count === 0) {
            Canvas.thirdLightsWidth = Canvas.lights.width / 3;
            Canvas.thirdDialWidth = Canvas.dial.width / 3;
            Canvas.sizeCanvas();
        }
    }
    static sizeCanvas() {
        // If the browser is large enough scale the canvas to its maximum dimensions.
        if (document.body.clientWidth > this.maxWidth && window.innerHeight > this.maxHeight) {
            Canvas.canvasElement.width = Canvas.maxWidth;
            Canvas.width = Canvas.maxWidth;
            Canvas.canvasElement.height = Canvas.maxHeight;
            Canvas.height = Canvas.maxHeight;
        }
        else {
            // If both width and height are smaller than max determine which ratio is smallest and rescale accordingly.
            // Else if its just width than scale to width otherwise its height and scale to height. 
            document.body.clientWidth < this.maxWidth && document.body.clientHeight < this.maxHeight
                ? document.body.clientWidth / this.maxWidth <= document.body.clientHeight / this.maxHeight
                    ? Canvas.scaleToWidth(Canvas.canvasElement)
                    : Canvas.scaleToHeight(Canvas.canvasElement)
                : document.body.clientWidth < this.maxWidth
                    ? Canvas.scaleToWidth(Canvas.canvasElement)
                    : Canvas.scaleToHeight(Canvas.canvasElement);
        }
        Canvas.shrinkFactor = Canvas.width / Canvas.maxWidth;
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
        Canvas.context.drawImage(this.background, 0, 0, Canvas.width, Canvas.height);
        const widthFactor = this.safe.width * Canvas.shrinkFactor;
        const heightFactor = this.safe.height * Canvas.shrinkFactor;
        // Make a loop?
        if (Canvas.initialDraw) {
            Canvas.behindSafes["safe1"] = Canvas.context.getImageData(Canvas.ratios["safe1"][0] * Canvas.width, Canvas.ratios["safe1"][1] * Canvas.height, widthFactor, heightFactor);
            Canvas.behindSafes["safe2"] = Canvas.context.getImageData(Canvas.ratios["safe2"][0] * Canvas.width, Canvas.ratios["safe2"][1] * Canvas.height, widthFactor, heightFactor);
            Canvas.behindSafes["safe3"] = Canvas.context.getImageData(Canvas.ratios["safe3"][0] * Canvas.width, Canvas.ratios["safe3"][1] * Canvas.height, widthFactor, heightFactor);
            Canvas.behindSafes["safe4"] = Canvas.context.getImageData(Canvas.ratios["safe4"][0] * Canvas.width, Canvas.ratios["safe4"][1] * Canvas.height, widthFactor, heightFactor);
            Canvas.behindSafes["safe5"] = Canvas.context.getImageData(Canvas.ratios["safe5"][0] * Canvas.width, Canvas.ratios["safe5"][1] * Canvas.height, widthFactor, heightFactor);
            Canvas.behindSafes["safe6"] = Canvas.context.getImageData(Canvas.ratios["safe6"][0] * Canvas.width, Canvas.ratios["safe6"][1] * Canvas.height, widthFactor, heightFactor);
            Canvas.behindSafes["safe7"] = Canvas.context.getImageData(Canvas.ratios["safe7"][0] * Canvas.width, Canvas.ratios["safe7"][1] * Canvas.height, widthFactor, heightFactor);
            Canvas.behindSafes["safe8"] = Canvas.context.getImageData(Canvas.ratios["safe8"][0] * Canvas.width, Canvas.ratios["safe8"][1] * Canvas.height, widthFactor, heightFactor);
            Canvas.behindSafes["safe9"] = Canvas.context.getImageData(Canvas.ratios["safe9"][0] * Canvas.width, Canvas.ratios["safe9"][1] * Canvas.height, widthFactor, heightFactor);
        }
        for (let i = 1; i <= 9; i++) {
            let s = "safe" + i.toString();
            Canvas.game.unlockedSafes.indexOf(i) === -1
                ? Canvas.context.drawImage(this.safe, Canvas.ratios[s][0] * Canvas.width, Canvas.ratios[s][1] * Canvas.height, widthFactor, heightFactor)
                : Canvas.openSafe(i);
        }
        if (!Canvas.won) {
            Canvas.context.drawImage(this.supportDial, Canvas.ratios["supportDial"][0] * Canvas.width, Canvas.ratios["supportDial"][1] * Canvas.height, this.supportDial.width * Canvas.shrinkFactor, this.supportDial.height * Canvas.shrinkFactor);
            Canvas.context.drawImage(this.dial, 0, 0, Canvas.thirdDialWidth, this.dial.height, Canvas.ratios["dial"][0] * Canvas.width, Canvas.ratios["dial"][1] * Canvas.height, Canvas.thirdDialWidth * Canvas.shrinkFactor, this.dial.height * Canvas.shrinkFactor);
        }
        if (Canvas.initialDraw) {
            Canvas.behindLightsTwo = Canvas.context.getImageData(Canvas.ratios["lights2"][0] * Canvas.width, Canvas.ratios["lights2"][1] * Canvas.height, Canvas.thirdLightsWidth, this.lights.height);
            Canvas.behindLightsOne = Canvas.context.getImageData(Canvas.ratios["lights1"][0] * Canvas.width, Canvas.ratios["lights1"][1] * Canvas.height, Canvas.thirdLightsWidth, this.lights.height);
            Canvas.behindSpin = Canvas.context.getImageData(Canvas.ratios["spin"][0] * Canvas.width, Canvas.ratios["spin"][1] * Canvas.height, this.spin.width, this.spin.height);
            Canvas.behindMarker = Canvas.context.getImageData(Canvas.ratios["marker"][0] * Canvas.width, Canvas.ratios["marker"][1] * Canvas.height, Canvas.marker.width / 2, Canvas.marker.height);
        }
        if (!Canvas.won) {
            Canvas.context.drawImage(this.spin, Canvas.ratios["spin"][0] * Canvas.width, Canvas.ratios["spin"][1] * Canvas.height, this.spin.width * Canvas.shrinkFactor, this.spin.height * Canvas.shrinkFactor);
            Canvas.context.drawImage(this.lights, 0, 0, Canvas.thirdLightsWidth, this.lights.height, Canvas.ratios["lights1"][0] * Canvas.width, Canvas.ratios["lights1"][1] * Canvas.height, Canvas.thirdLightsWidth * Canvas.shrinkFactor, this.lights.height * Canvas.shrinkFactor);
            Canvas.context.drawImage(this.lights, Canvas.thirdLightsWidth, 0, Canvas.thirdLightsWidth, this.lights.height, Canvas.ratios["lights2"][0] * Canvas.width, Canvas.ratios["lights2"][1] * Canvas.height, Canvas.thirdLightsWidth * Canvas.shrinkFactor, this.lights.height * Canvas.shrinkFactor);
        }
        if (Canvas.fontsLoaded) {
            Canvas.writeWords();
        }
        if (Canvas.resizing || Canvas.initialDraw) {
            Canvas.setDimensions();
            Canvas.initialDraw = false;
        }
    }
    static setDimensions() {
        Canvas.radiusSupport = (this.supportDial.width - 15) / 2 * Canvas.shrinkFactor;
        Canvas.radiusSpin = this.spin.width / 2 * Canvas.shrinkFactor;
        Canvas.radiusDial = Canvas.radiusSupport * 0.9;
        // plus 30 on the height for marker, hard coded?
        Canvas.centerSupport = [Canvas.ratios["supportDial"][0] * Canvas.width + this.supportDial.width / 2 * Canvas.shrinkFactor, Canvas.ratios["supportDial"][1] * Canvas.height + 30 * Canvas.shrinkFactor + (Canvas.supportDial.height - 30 * Canvas.shrinkFactor) / 2 * Canvas.shrinkFactor];
        Canvas.centerDial = [Canvas.ratios["dial"][0] * Canvas.width + this.dial.width / 6 * Canvas.shrinkFactor, Canvas.ratios["dial"][1] * Canvas.height + Canvas.dial.height / 2 * Canvas.shrinkFactor];
    }
    // Can we do change lights with save and restore? What is more expensive?
    static changeLights() {
        Canvas.drawLights();
        // Change the sx translation for both lights
        Canvas.xLights1 < 2
            ? Canvas.xLights1++
            : Canvas.xLights1 = 0;
        Canvas.xLights2 < 2
            ? Canvas.xLights2++
            : Canvas.xLights2 = 0;
    }
    static drawLights() {
        Canvas.context.putImageData(Canvas.behindLightsOne, Canvas.ratios["lights1"][0] * Canvas.width, Canvas.ratios["lights1"][1] * Canvas.height);
        Canvas.context.putImageData(Canvas.behindLightsTwo, Canvas.ratios["lights2"][0] * Canvas.width, Canvas.ratios["lights2"][1] * Canvas.height);
        Canvas.context.drawImage(Canvas.lights, Canvas.xLights1 * Canvas.thirdLightsWidth, 0, Canvas.thirdLightsWidth, Canvas.lights.height, Canvas.ratios["lights1"][0] * Canvas.width, Canvas.ratios["lights1"][1] * Canvas.height, Canvas.thirdLightsWidth * Canvas.shrinkFactor, Canvas.lights.height * Canvas.shrinkFactor);
        Canvas.context.drawImage(Canvas.lights, Canvas.xLights2 * Canvas.thirdLightsWidth, 0, Canvas.thirdLightsWidth, Canvas.lights.height, Canvas.ratios["lights2"][0] * Canvas.width, Canvas.ratios["lights2"][1] * Canvas.height, Canvas.thirdLightsWidth * Canvas.shrinkFactor, Canvas.lights.height * Canvas.shrinkFactor);
    }
    // decrease radius. some are on outer grip
    static getPoint() {
        return __awaiter(this, void 0, void 0, function* () {
            const a = Math.random() * 2 * Math.PI;
            // hardcode
            const r = (Canvas.radiusSupport - 5) * Math.sqrt(Math.random());
            if (Math.sqrt(Math.pow((r * Math.cos(a)), 2) + Math.pow((r * Math.sin(a)), 2)) > Canvas.radiusDial) {
                return [r * Math.cos(a) + Canvas.centerSupport[0], r * Math.sin(a) + Canvas.centerSupport[1]];
            }
            else {
                return Canvas.getPoint();
            }
        });
    }
    // make it async?
    // Don't use hard numbers, save as constants 
    static supportGlow() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([Canvas.getPoint(), Canvas.getPoint(), Canvas.getPoint(), Canvas.getPoint(), Canvas.getPoint(), Canvas.getPoint(), Canvas.getPoint(), Canvas.getPoint()]).then(function (values) {
                for (let x in values) {
                    let spark = new Spark(values[x][0], values[x][1], 10);
                    Canvas.sparks.push(spark);
                }
                Canvas.drawSparks(Canvas.sparks.length - values.length);
            });
        });
    }
    static drawSparks(index) {
        if (!Canvas.spinning && !Canvas.resizing) {
            const set = new Set([index, index + 1, index + 2, index + 3, index + 4, index + 5, index + 6, index + 7]);
            Canvas.drawBackgroundAndSupport();
            Canvas.rotate(Canvas.currentRotation, 0);
            for (let i = 0; i < Canvas.sparks.length; i++) {
                if (Canvas.sparks[i]) {
                    if (set.has(i)) {
                        Canvas.sparks[i].size += 5;
                        Canvas.context.drawImage(Canvas.sparkSafe, Canvas.sparks[i].x - Canvas.sparks[i].size / 2, Canvas.sparks[i].y - Canvas.sparks[i].size / 2, Canvas.sparks[i].size, Canvas.sparks[i].size);
                    }
                    else {
                        Canvas.context.drawImage(Canvas.sparkSafe, Canvas.sparks[i].x - Canvas.sparks[i].size / 2, Canvas.sparks[i].y - Canvas.sparks[i].size / 2, Canvas.sparks[i].size, Canvas.sparks[i].size);
                    }
                }
            }
            if (Canvas.sparks[index].size == 55) {
                Canvas.removeSpark(index);
            }
            else {
                setTimeout(function () { Canvas.drawSparks(index); }, 60);
            }
        }
    }
    static deleteSparks() {
        // not better to just Canvas.sparks = []?
        Canvas.sparks = [];
        // for (let i = 0; i < Canvas.sparks.length; i++){ 
        //     delete Canvas.sparks[i]
        // }
    }
    static removeSpark(index) {
        if (!Canvas.spinning && !Canvas.resizing) {
            const set = new Set([index, index + 1, index + 2, index + 3, index + 4, index + 5, index + 6, index + 7]);
            if (Canvas.sparks[index].size == 0) {
                for (let i = index; i <= index + 7; i++) {
                    delete Canvas.sparks[i];
                }
            }
            else {
                Canvas.drawBackgroundAndSupport();
                Canvas.rotate(Canvas.currentRotation, 0);
                for (let i = 0; i < Canvas.sparks.length; i++) {
                    if (Canvas.sparks[i]) {
                        if (set.has(i)) {
                            Canvas.sparks[i].size -= 5;
                            Canvas.context.drawImage(Canvas.sparkSafe, Canvas.sparks[i].x - Canvas.sparks[i].size / 2, Canvas.sparks[i].y - Canvas.sparks[i].size / 2, Canvas.sparks[i].size, Canvas.sparks[i].size);
                        }
                        else {
                            Canvas.context.drawImage(Canvas.sparkSafe, Canvas.sparks[i].x - Canvas.sparks[i].size / 2, Canvas.sparks[i].y - Canvas.sparks[i].size / 2, Canvas.sparks[i].size, Canvas.sparks[i].size);
                        }
                    }
                }
                setTimeout(function () { Canvas.removeSpark(index); }, 60);
            }
        }
    }
    // clip larger area so you don't get the line half way through
    static drawBackgroundAndSupport() {
        // can implement DRY morE?
        // if change radius change increment
        // I shouldnt have to clip twice
        Canvas.drawLights();
        Canvas.context.save();
        Canvas.context.beginPath();
        Canvas.context.arc(Canvas.centerSupport[0], Canvas.centerSupport[1], Canvas.radiusSupport + 15, 0, Math.PI * 2);
        Canvas.context.clip();
        Canvas.context.drawImage(this.background, 0, 0, Canvas.width, Canvas.height);
        Canvas.context.drawImage(this.supportDial, Canvas.ratios["supportDial"][0] * Canvas.width, Canvas.ratios["supportDial"][1] * Canvas.height, this.supportDial.width * Canvas.shrinkFactor, this.supportDial.height * Canvas.shrinkFactor);
        Canvas.context.restore();
    }
    // Method that flashes the "Spin" button. 
    // Called by a "setInterval"
    static flashSpin() {
        Canvas.context.putImageData(Canvas.behindSpin, Canvas.ratios["spin"][0] * Canvas.width, Canvas.ratios["spin"][1] * Canvas.height);
        if (Canvas.spinOn) {
            Canvas.spinOn = false;
        }
        else {
            Canvas.context.drawImage(Canvas.spin, Canvas.ratios["spin"][0] * Canvas.width, Canvas.ratios["spin"][1] * Canvas.height, Canvas.spin.width * Canvas.shrinkFactor, Canvas.spin.height * Canvas.shrinkFactor);
            Canvas.spinOn = true;
        }
    }
}
Canvas.maxWidth = 916;
Canvas.maxHeight = 623;
Canvas.widthToHeightRatio = Canvas.maxWidth / Canvas.maxHeight;
Canvas.heightToWidthRatio = Canvas.maxHeight / Canvas.maxWidth;
Canvas.openSafeXTranslate = -35;
Canvas.openSafeYTranslate = -25;
Canvas.priseXTranslate = Canvas.openSafeXTranslate + 10;
Canvas.priseYTranslate = Canvas.openSafeYTranslate + 6;
Canvas.fontXTranslate = Canvas.priseXTranslate + 65;
Canvas.fontYTranslate = Canvas.priseYTranslate + 110;
Canvas.starXTranslate = Canvas.fontXTranslate - 15;
Canvas.starYTranslate = Canvas.fontYTranslate - 70;
// How far left and how far down as a ratio of the size of the Canvas
// Needed for browser resizing 
Canvas.ratios = {
    "safe1": [(50 / Canvas.maxWidth), (173 / Canvas.maxHeight)],
    "safe2": [(220 / Canvas.maxWidth), (173 / Canvas.maxHeight)],
    "safe3": [(390 / Canvas.maxWidth), (173 / Canvas.maxHeight)],
    "safe4": [(50 / Canvas.maxWidth), (320 / Canvas.maxHeight)],
    "safe5": [(220 / Canvas.maxWidth), (320 / Canvas.maxHeight)],
    "safe6": [(390 / Canvas.maxWidth), (320 / Canvas.maxHeight)],
    "safe7": [(50 / Canvas.maxWidth), (467 / Canvas.maxHeight)],
    "safe8": [(220 / Canvas.maxWidth), (467 / Canvas.maxHeight)],
    "safe9": [(390 / Canvas.maxWidth), (467 / Canvas.maxHeight)],
    "screen": [(578 / Canvas.maxWidth), (183 / Canvas.maxHeight)],
    "winScreen": [(600 / Canvas.maxWidth), (183 / Canvas.maxHeight)],
    "supportDial": [(582 / Canvas.maxWidth), (280 / Canvas.maxHeight)],
    "dial": [(593 / Canvas.maxWidth), (318 / Canvas.maxHeight)],
    "marker": [(709 / Canvas.maxWidth), (270 / Canvas.maxHeight)],
    "spin": [(695 / Canvas.maxWidth), (420 / Canvas.maxHeight)],
    "lights1": [(582 / Canvas.maxWidth), (270 / Canvas.maxHeight)],
    "lights2": [(758 / Canvas.maxWidth), (270 / Canvas.maxHeight)],
    "instructionsTop": [(68 / Canvas.maxWidth), (65 / Canvas.maxHeight)],
    "instructionsBottom": [(68 / Canvas.maxWidth), (110 / Canvas.maxHeight)],
    "unlockedSafes": [(642 / Canvas.maxWidth), (243 / Canvas.maxHeight)]
};
// Image cache references
Canvas.lights = new Image();
Canvas.background = new Image();
Canvas.safe = new Image();
Canvas.safeOpen = new Image();
Canvas.screen = new Image();
Canvas.supportDial = new Image();
Canvas.sparkSafe = new Image();
Canvas.dial = new Image();
Canvas.spin = new Image();
Canvas.coin = new Image();
Canvas.diamond = new Image();
Canvas.gold = new Image();
Canvas.notes = new Image();
Canvas.ring = new Image();
Canvas.winScreen = new Image();
Canvas.marker = new Image();
Canvas.star = new Image();
Canvas.images = [Canvas.lights, Canvas.background, Canvas.safe, Canvas.safeOpen, Canvas.gold, Canvas.diamond,
    Canvas.coin, Canvas.ring, Canvas.notes, Canvas.sparkSafe, Canvas.screen, Canvas.supportDial, Canvas.dial, Canvas.spin, Canvas.marker,
    Canvas.winScreen, Canvas.star];
// Runtime state variables
Canvas.count = Canvas.images.length;
Canvas.fontsLoaded = false;
Canvas.spinOn = true;
Canvas.won = false;
Canvas.spinning = false;
Canvas.initialDraw = true;
Canvas.resizing = false;
Canvas.behindSafes = {};
Canvas.sparks = [];
Canvas.stars = [];
Canvas.currentRotation = 0;
// May be able to do this better
Canvas.xLights1 = 0;
Canvas.xLights2 = 1;
