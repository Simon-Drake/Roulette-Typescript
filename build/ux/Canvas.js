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
import { Dimensions } from './Dimensions.js';
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
        Canvas.dim = new Dimensions(el);
        console.log(Canvas.dim);
        window.addEventListener('resize', function () {
            Canvas.resizing = true;
            clearInterval(Canvas.glowInterval);
            clearInterval(Canvas.flashInterval);
            Canvas.deleteSparks();
            Canvas.dim.sizeCanvas();
            Canvas.glowInterval = setInterval(Canvas.supportGlow, 450);
            Canvas.flashInterval = setInterval(Canvas.flashSpin, 500);
            setTimeout(function () { Canvas.resizing = false; }, 50);
        });
        // need to add if clicks again while spinning do nothing
        el.addEventListener('click', function (e) {
            if (Canvas.game.state == Canvas.game.states["ZERO_SPINS"] || Canvas.game.state == Canvas.game.states["SPUN"])
                Canvas.intersect(e.offsetX, e.offsetY);
        });
        Canvas.context = el.getContext("2d");
        this.background.onload = this.dial.onload = this.lights.onload = this.safe.onload = this.supportDial.onload = this.coin.onload =
            this.ring.onload = this.notes.onload = this.spin.onload = this.safeOpen.onload = this.screen.onload = this.sparkSafe.onload =
                this.gold.onload = this.diamond.onload = this.winScreen.onload = this.marker.onload = this.star.onload = Canvas.counter;
        setInterval(Canvas.changeLights, 1000);
        Canvas.glowInterval = setInterval(Canvas.supportGlow, 450);
        Canvas.flashInterval = setInterval(Canvas.flashSpin, 500);
        Canvas.game.state = Canvas.game.states["ZERO_SPINS"];
    }
    /// JUST A COMMMENT : need to play with radiuses still, some sparks is getting left ourside
    static intersect(x, y) {
        let inside = Math.sqrt(Math.pow((Canvas.dim.centerSupport[0] - x), 2) + Math.pow((Canvas.dim.centerSupport[1] - y), 2)) < Canvas.dim.radiusSpin;
        if (inside) {
            Canvas.game.state = Canvas.game.states["SPINNING"];
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
            Canvas.writeWords(110);
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
                if (rotation >= antiClockwise2) {
                    Canvas.rotate(antiClockwise2, 0);
                    Canvas.evaluateScore(antiClockwise2);
                }
                else {
                    Canvas.rotate(rotation, 0);
                    setTimeout(function () { Canvas.spinWheel(rotation, antiClockwise, clockwise, antiClockwise2, state); }, 20);
                }
                break;
            }
        }
    }
    static evaluateScore(rotation) {
        Canvas.game.state = Canvas.game.states["SPUN"];
        // Some DRY stuff to handle here 
        Canvas.currentRotation = rotation;
        let result = Canvas.getResult(rotation);
        Canvas.game.result = result;
        if (Canvas.game.unlockedSafes.indexOf(result) === -1) {
            Canvas.game.unlockedSafes.push(result);
            Canvas.openSafe(result);
            Canvas.assessWin(Canvas.game.boxes[result]);
        }
        else {
            Canvas.glowInterval = setInterval(Canvas.supportGlow, 450);
            Canvas.flashInterval = setInterval(Canvas.flashSpin, 500);
        }
        Canvas.writeWords(110);
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
            setTimeout(function () { Canvas.implementWin(m); }, 2000);
        }
        else {
            Canvas.game.unlockedMultipliers.add(m);
            Canvas.redDial(0);
        }
    }
    static implementWin(m) {
        Canvas.game.state = Canvas.game.states["WON"];
        Canvas.won = true;
        Canvas.handleWin();
        Canvas.game.winSafes = [Canvas.game.unlockedSafes[Canvas.game.unlockedSafes.length - 1], Canvas.returnBox(m, Canvas.game.unlockedSafes)];
        Canvas.game.winImage = Canvas.mapMultiplierToImage(Canvas.game.boxes[Canvas.game.winSafes[0]]);
        Canvas.starParticles();
        setInterval(function () { Canvas.drawStars(true); }, 100);
        setInterval(function () { Canvas.changeSX(); }, 500);
        setTimeout(function () { setInterval(function () { Canvas.changeScale(); }, 30); }, 3000);
        setInterval(function () { Canvas.starParticles(); }, 2500);
    }
    static changeSX() {
        Canvas.game.winImageSX == 0
            ? Canvas.game.winImageSX = Canvas.game.winImage.width / 2
            : Canvas.game.winImageSX = 0;
    }
    static changeScale() {
        Canvas.scale += 0.05 * Canvas.scaleDirection;
        if (Canvas.scale > 1.4)
            Canvas.scaleDirection = -1;
        if (Canvas.scale <= 1)
            Canvas.scaleDirection = +1;
    }
    static handleWin() {
        // better place to put i?
        Canvas.spinOn = false;
        Canvas.deleteSparks();
        clearInterval(Canvas.glowInterval);
        clearInterval(Canvas.flashInterval);
        // Canvas.writeWords(75)
        setInterval(function () { Canvas.winSpin(0.18, true); }, 35);
    }
    static starParticles() {
        // done twice
        let s1 = "safe" + Canvas.game.winSafes[0].toString();
        let s2 = "safe" + Canvas.game.winSafes[1].toString();
        for (let i = 0; i < 5; i++) {
            Canvas.stars.push(new Star(Canvas.dim.ratios[s1][0] * Canvas.dim.width + Canvas.dim.starXTranslate * Canvas.dim.shrinkFactor, Canvas.dim.ratios[s1][1] * Canvas.dim.height + Canvas.dim.starYTranslate * Canvas.dim.shrinkFactor, 20 + 80 * Math.random()));
            Canvas.stars.push(new Star(Canvas.dim.ratios[s2][0] * Canvas.dim.width + Canvas.dim.starXTranslate * Canvas.dim.shrinkFactor, Canvas.dim.ratios[s2][1] * Canvas.dim.height + Canvas.dim.starYTranslate * Canvas.dim.shrinkFactor, 20 + 80 * Math.random()));
        }
    }
    static fillCanvasColour() {
        Canvas.context.fillStyle = 'silver';
        Canvas.context.fillRect(0, 0, Canvas.dim.width, Canvas.dim.height);
        Canvas.context.fillStyle = 'black';
    }
    // might not need move if array is empty... 
    static drawStars(move) {
        // done twice
        let s1 = "safe" + Canvas.game.winSafes[0].toString();
        let s2 = "safe" + Canvas.game.winSafes[1].toString();
        let image = Canvas.game.winImage;
        Canvas.fillCanvasColour();
        Canvas.drawImages();
        Canvas.winSpin(0, false);
        Canvas.drawLights();
        Canvas.writeWords(75);
        for (let i = 0; i < Canvas.stars.length; i++) {
            if (Canvas.stars[i]) {
                if (Canvas.stars[i].distanceFromSource >= 200) {
                    delete Canvas.stars[i];
                }
                else {
                    if (move) {
                        Canvas.stars[i].x += Canvas.stars[i].dx;
                        Canvas.stars[i].y += Canvas.stars[i].dy;
                        Canvas.stars[i].rotation += Canvas.stars[i].drotation;
                        Canvas.stars[i].distanceFromSource = Math.sqrt(Math.pow((Canvas.stars[i].x - Canvas.stars[i].source[0]), 2) + Math.pow((Canvas.stars[i].y - Canvas.stars[i].source[1]), 2));
                    }
                    Canvas.rotateStar(Canvas.stars[i]);
                }
            }
        }
        let s1x = Canvas.dim.ratios[s1][0] * Canvas.dim.width + Canvas.dim.priseXTranslate * Canvas.dim.shrinkFactor;
        let s1y = Canvas.dim.ratios[s1][1] * Canvas.dim.height + Canvas.dim.priseYTranslate * Canvas.dim.shrinkFactor;
        let s2x = Canvas.dim.ratios[s2][0] * Canvas.dim.width + Canvas.dim.priseXTranslate * Canvas.dim.shrinkFactor;
        let s2y = Canvas.dim.ratios[s2][1] * Canvas.dim.height + Canvas.dim.priseYTranslate * Canvas.dim.shrinkFactor;
        let scale = Canvas.scale;
        Canvas.context.drawImage(image, Canvas.game.winImageSX, 0, image.width / 2, image.height, s1x - image.width * (scale - 1) / 4, s1y - image.height * (scale - 1) / 2, scale * image.width * Canvas.dim.shrinkFactor / 2, scale * image.height * Canvas.dim.shrinkFactor);
        Canvas.context.drawImage(image, Canvas.game.winImageSX, 0, image.width / 2, image.height, s2x - image.width * (scale - 1) / 4, s2y - image.height * (scale - 1) / 2, scale * image.width * Canvas.dim.shrinkFactor / 2, scale * image.height * Canvas.dim.shrinkFactor);
        if (Canvas.game.winImageSX > 0) {
            Canvas.drawMultiplier(Canvas.game.boxes[Canvas.game.winSafes[0]], s1);
            Canvas.drawMultiplier(Canvas.game.boxes[Canvas.game.winSafes[1]], s2);
        }
    }
    static drawMultiplier(multiple, safe) {
        // hard
        // all scaled
        let fontSize = 65 * Canvas.dim.shrinkFactor * Canvas.scale;
        Canvas.context.font = `${fontSize}px unlocked`;
        let blackfx = Canvas.dim.ratios[safe][0] * Canvas.dim.width + Canvas.dim.fontXTranslate * Canvas.dim.shrinkFactor - Canvas.dim.blackFont * Canvas.dim.shrinkFactor;
        let blackfy = Canvas.dim.ratios[safe][1] * Canvas.dim.height + Canvas.dim.fontYTranslate * Canvas.dim.shrinkFactor + Canvas.dim.blackFont * Canvas.dim.shrinkFactor;
        let whitefx = Canvas.dim.ratios[safe][0] * Canvas.dim.width + Canvas.dim.fontXTranslate * Canvas.dim.shrinkFactor;
        let whitefy = Canvas.dim.ratios[safe][1] * Canvas.dim.height + Canvas.dim.fontYTranslate * Canvas.dim.shrinkFactor;
        Canvas.context.fillText(`x${multiple}`, blackfx - 65 * (fontSize / 65 - 1) / 2, blackfy + 65 * (fontSize / 65 - 1) / 2);
        Canvas.context.fillStyle = 'white';
        Canvas.context.fillText(`x${multiple}`, whitefx - 65 * (fontSize / 65 - 1) / 2, whitefy + 65 * (fontSize / 65 - 1) / 2);
        Canvas.context.fillStyle = 'black';
    }
    static rotateStar(star) {
        let centerX = star.x + star.size * Canvas.dim.shrinkFactor / 2;
        let centerY = star.y + star.size * Canvas.dim.shrinkFactor / 2;
        Canvas.context.translate(centerX, centerY);
        Canvas.context.rotate(star.rotation);
        let gA = Math.sqrt(-star.distanceFromSource + 200) / 9 || 0.1;
        gA > 1
            ? Canvas.context.globalAlpha = 1
            : Canvas.context.globalAlpha = gA;
        Canvas.context.drawImage(Canvas.star, star.x - centerX, star.y - centerY, star.size * Canvas.dim.shrinkFactor, star.size * Canvas.dim.shrinkFactor);
        Canvas.context.setTransform(1, 0, 0, 1, 0, 0);
        Canvas.context.globalAlpha = 1;
    }
    static winSpin(increment, drawStars) {
        Canvas.drawBackgroundAndSupport();
        Canvas.context.putImageData(Canvas.behindMarker, Canvas.dim.ratios["marker"][0] * Canvas.dim.width, Canvas.dim.ratios["marker"][1] * Canvas.dim.height);
        Canvas.context.drawImage(Canvas.marker, Canvas.marker.width / 2, 0, Canvas.marker.width / 2, Canvas.marker.height, Canvas.dim.ratios["marker"][0] * Canvas.dim.width, Canvas.dim.ratios["marker"][1] * Canvas.dim.height, Canvas.marker.width * Canvas.dim.shrinkFactor / 2, Canvas.marker.height * Canvas.dim.shrinkFactor);
        Canvas.currentRotation = Canvas.currentRotation + increment;
        Canvas.rotate(Canvas.currentRotation, Canvas.dim.thirdDialWidth * 2);
        if (drawStars)
            Canvas.drawStars(false);
    }
    static redDial(counter) {
        if (counter == 10) {
            Canvas.glowInterval = setInterval(Canvas.supportGlow, 450);
            Canvas.flashInterval = setInterval(Canvas.flashSpin, 500);
        }
        else {
            Canvas.drawBackgroundAndSupport();
            if (counter % 2 == 0) {
                Canvas.rotate(Canvas.currentRotation, Canvas.dim.thirdDialWidth);
                // hard
                Canvas.context.drawImage(Canvas.marker, 0, 0, Canvas.marker.width / 2, Canvas.marker.height, Canvas.dim.ratios["marker"][0] * Canvas.dim.width, Canvas.dim.ratios["marker"][1] * Canvas.dim.height, Canvas.marker.width * Canvas.dim.shrinkFactor / 2, Canvas.marker.height * Canvas.dim.shrinkFactor);
            }
            else {
                Canvas.context.putImageData(Canvas.behindMarker, Canvas.dim.ratios["marker"][0] * Canvas.dim.width, Canvas.dim.ratios["marker"][1] * Canvas.dim.height);
                Canvas.rotate(Canvas.currentRotation, 0);
            }
            counter++;
            setTimeout(function () { Canvas.redDial(counter); }, 200);
        }
    }
    static openSafe(result) {
        let s = "safe" + result.toString();
        // need to scale for browser resize
        Canvas.context.putImageData(Canvas.behindSafes[s], Canvas.dim.ratios[s][0] * Canvas.dim.width, Canvas.dim.ratios[s][1] * Canvas.dim.height);
        Canvas.context.drawImage(Canvas.safeOpen, Canvas.dim.ratios[s][0] * Canvas.dim.width + Canvas.dim.openSafeXTranslate * Canvas.dim.shrinkFactor, Canvas.dim.ratios[s][1] * Canvas.dim.height + Canvas.dim.openSafeYTranslate * Canvas.dim.shrinkFactor, Canvas.safeOpen.width * Canvas.dim.shrinkFactor, Canvas.safeOpen.height * Canvas.dim.shrinkFactor);
        let image = Canvas.mapMultiplierToImage(Canvas.game.boxes[result]);
        // /2 once
        Canvas.context.drawImage(image, 0, 0, image.width / 2, image.height, Canvas.dim.ratios[s][0] * Canvas.dim.width + Canvas.dim.priseXTranslate * Canvas.dim.shrinkFactor, Canvas.dim.ratios[s][1] * Canvas.dim.height + Canvas.dim.priseYTranslate * Canvas.dim.shrinkFactor, image.width * Canvas.dim.shrinkFactor / 2, image.height * Canvas.dim.shrinkFactor);
        if (Canvas.game.state !== Canvas.game.states["WON"]) {
            Canvas.drawMultiplier(Canvas.game.boxes[result], s);
        }
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
        Canvas.context.translate(Canvas.dim.centerDial[0], Canvas.dim.centerDial[1]);
        Canvas.context.rotate(rotation);
        Canvas.context.drawImage(this.dial, xTranslate, 0, Canvas.dim.thirdDialWidth, this.dial.height, Canvas.dim.ratios["dial"][0] * Canvas.dim.width - Canvas.dim.centerDial[0], Canvas.dim.ratios["dial"][1] * Canvas.dim.height - Canvas.dim.centerDial[1], Canvas.dim.thirdDialWidth * Canvas.dim.shrinkFactor, this.dial.height * Canvas.dim.shrinkFactor);
        Canvas.context.setTransform(1, 0, 0, 1, 0, 0);
        if (Canvas.spinOn) {
            Canvas.context.drawImage(this.spin, Canvas.dim.ratios["spin"][0] * Canvas.dim.width, Canvas.dim.ratios["spin"][1] * Canvas.dim.height, this.spin.width * Canvas.dim.shrinkFactor, this.spin.height * Canvas.dim.shrinkFactor);
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
            // hard
            Canvas.writeWords(45);
        });
    }
    // 45 or 110 or 75
    static writeWords(fSize) {
        let fontSize = fSize * Canvas.dim.shrinkFactor;
        Canvas.context.font = `${fontSize}px instructions`;
        switch (Canvas.game.state) {
            case Canvas.game.states["ZERO_SPINS"]: {
                Canvas.context.drawImage(this.screen, Canvas.dim.ratios["screen"][0] * Canvas.dim.width, Canvas.dim.ratios["screen"][1] * Canvas.dim.height, this.screen.width * Canvas.dim.shrinkFactor, this.screen.height * Canvas.dim.shrinkFactor);
                Canvas.context.fillText('Match a pair of symbols for a safe busting multiplier!', Canvas.dim.ratios["instructionsTop"][0] * Canvas.dim.width, Canvas.dim.ratios["instructionsTop"][1] * Canvas.dim.height);
                Canvas.context.fillText('TOUCH THE DIAL TO SPIN YOUR 4 DIGIT COMBINATION', Canvas.dim.ratios["instructionsBottom"][0] * Canvas.dim.width, Canvas.dim.ratios["instructionsBottom"][1] * Canvas.dim.height);
                Canvas.context.font = `${fontSize}px unlocked`;
                Canvas.context.fillText("-   -   -   -", Canvas.dim.ratios["unlockedSafes"][0] * Canvas.dim.width, Canvas.dim.ratios["unlockedSafes"][1] * Canvas.dim.height);
                break;
            }
            case Canvas.game.states["SPINNING"]: {
                Canvas.context.putImageData(this.behindInstructions, Canvas.dim.ratios["instructions"][0] * Canvas.dim.width, Canvas.dim.ratios["instructions"][1] * Canvas.dim.height);
                Canvas.context.fillText('SPINNING!', Canvas.dim.ratios["spinning"][0] * Canvas.dim.width, Canvas.dim.ratios["spinning"][1] * Canvas.dim.height);
                break;
            }
            case Canvas.game.states["SPUN"]: {
                Canvas.context.putImageData(this.behindInstructions, Canvas.dim.ratios["instructions"][0] * Canvas.dim.width, Canvas.dim.ratios["instructions"][1] * Canvas.dim.height);
                Canvas.context.drawImage(this.screen, Canvas.dim.ratios["screen"][0] * Canvas.dim.width, Canvas.dim.ratios["screen"][1] * Canvas.dim.height, this.screen.width * Canvas.dim.shrinkFactor, this.screen.height * Canvas.dim.shrinkFactor);
                // hard and shrink
                Canvas.context.fillText("SAFE" + Canvas.game.result.toString(), Canvas.dim.ratios["spinning"][0] * Canvas.dim.width + 63, Canvas.dim.ratios["spinning"][1] * Canvas.dim.height);
                // hard
                Canvas.context.font = `${45}px unlocked`;
                Canvas.context.fillText(Canvas.getUnlockedSafesString(), Canvas.dim.ratios["unlockedSafes"][0] * Canvas.dim.width, Canvas.dim.ratios["unlockedSafes"][1] * Canvas.dim.height);
                break;
            }
            case Canvas.game.states["WON"]: {
                Canvas.context.drawImage(Canvas.winScreen, Canvas.dim.ratios["winScreen"][0] * Canvas.dim.width, Canvas.dim.ratios["winScreen"][1] * Canvas.dim.height, Canvas.winScreen.width * Canvas.dim.shrinkFactor, Canvas.winScreen.height * Canvas.dim.shrinkFactor);
                Canvas.context.font = `${fontSize}px unlocked`;
                // hard + shrinkFactor
                Canvas.context.fillText("WIN", Canvas.dim.ratios["unlockedSafes"][0] * Canvas.dim.width + 20, Canvas.dim.ratios["unlockedSafes"][1] * Canvas.dim.height + 10);
                Canvas.context.font = `${110}px instructions`;
                let amountWon = Canvas.game.boxes[Canvas.game.winSafes[0]] * Canvas.game.bet;
                Canvas.context.fillText(`YOU WIN £${amountWon}!`, Canvas.dim.ratios["spinning"][0] * Canvas.dim.width - 65, Canvas.dim.ratios["spinning"][1] * Canvas.dim.height);
                break;
            }
        }
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
            Canvas.dim.thirdLightsWidth = Canvas.lights.width / 3;
            Canvas.dim.thirdDialWidth = Canvas.dial.width / 3;
            Canvas.dim.sizeCanvas();
            Canvas.drawImages();
        }
    }
    static drawImages() {
        Canvas.context.drawImage(this.background, 0, 0, Canvas.dim.width, Canvas.dim.height);
        const widthFactor = this.safe.width * Canvas.dim.shrinkFactor;
        const heightFactor = this.safe.height * Canvas.dim.shrinkFactor;
        // Make a loop?
        if (Canvas.initialDraw) {
            // hard code and shrink
            Canvas.behindInstructions = Canvas.context.getImageData(Canvas.dim.ratios["instructions"][0] * Canvas.dim.width, Canvas.dim.ratios["instructions"][1] * Canvas.dim.height, 800, 90);
            Canvas.behindSafes["safe1"] = Canvas.context.getImageData(Canvas.dim.ratios["safe1"][0] * Canvas.dim.width, Canvas.dim.ratios["safe1"][1] * Canvas.dim.height, widthFactor, heightFactor);
            Canvas.behindSafes["safe2"] = Canvas.context.getImageData(Canvas.dim.ratios["safe2"][0] * Canvas.dim.width, Canvas.dim.ratios["safe2"][1] * Canvas.dim.height, widthFactor, heightFactor);
            Canvas.behindSafes["safe3"] = Canvas.context.getImageData(Canvas.dim.ratios["safe3"][0] * Canvas.dim.width, Canvas.dim.ratios["safe3"][1] * Canvas.dim.height, widthFactor, heightFactor);
            Canvas.behindSafes["safe4"] = Canvas.context.getImageData(Canvas.dim.ratios["safe4"][0] * Canvas.dim.width, Canvas.dim.ratios["safe4"][1] * Canvas.dim.height, widthFactor, heightFactor);
            Canvas.behindSafes["safe5"] = Canvas.context.getImageData(Canvas.dim.ratios["safe5"][0] * Canvas.dim.width, Canvas.dim.ratios["safe5"][1] * Canvas.dim.height, widthFactor, heightFactor);
            Canvas.behindSafes["safe6"] = Canvas.context.getImageData(Canvas.dim.ratios["safe6"][0] * Canvas.dim.width, Canvas.dim.ratios["safe6"][1] * Canvas.dim.height, widthFactor, heightFactor);
            Canvas.behindSafes["safe7"] = Canvas.context.getImageData(Canvas.dim.ratios["safe7"][0] * Canvas.dim.width, Canvas.dim.ratios["safe7"][1] * Canvas.dim.height, widthFactor, heightFactor);
            Canvas.behindSafes["safe8"] = Canvas.context.getImageData(Canvas.dim.ratios["safe8"][0] * Canvas.dim.width, Canvas.dim.ratios["safe8"][1] * Canvas.dim.height, widthFactor, heightFactor);
            Canvas.behindSafes["safe9"] = Canvas.context.getImageData(Canvas.dim.ratios["safe9"][0] * Canvas.dim.width, Canvas.dim.ratios["safe9"][1] * Canvas.dim.height, widthFactor, heightFactor);
        }
        for (let i = 1; i <= 9; i++) {
            let s = "safe" + i.toString();
            Canvas.game.unlockedSafes.indexOf(i) === -1
                ? Canvas.context.drawImage(this.safe, Canvas.dim.ratios[s][0] * Canvas.dim.width, Canvas.dim.ratios[s][1] * Canvas.dim.height, widthFactor, heightFactor)
                : Canvas.openSafe(i);
        }
        if (!Canvas.won) {
            Canvas.context.drawImage(this.supportDial, Canvas.dim.ratios["supportDial"][0] * Canvas.dim.width, Canvas.dim.ratios["supportDial"][1] * Canvas.dim.height, this.supportDial.width * Canvas.dim.shrinkFactor, this.supportDial.height * Canvas.dim.shrinkFactor);
            Canvas.context.drawImage(this.dial, 0, 0, Canvas.dim.thirdDialWidth, this.dial.height, Canvas.dim.ratios["dial"][0] * Canvas.dim.width, Canvas.dim.ratios["dial"][1] * Canvas.dim.height, Canvas.dim.thirdDialWidth * Canvas.dim.shrinkFactor, this.dial.height * Canvas.dim.shrinkFactor);
        }
        if (Canvas.initialDraw) {
            Canvas.behindLightsTwo = Canvas.context.getImageData(Canvas.dim.ratios["lights2"][0] * Canvas.dim.width, Canvas.dim.ratios["lights2"][1] * Canvas.dim.height, Canvas.dim.thirdLightsWidth, this.lights.height);
            Canvas.behindLightsOne = Canvas.context.getImageData(Canvas.dim.ratios["lights1"][0] * Canvas.dim.width, Canvas.dim.ratios["lights1"][1] * Canvas.dim.height, Canvas.dim.thirdLightsWidth, this.lights.height);
            Canvas.behindSpin = Canvas.context.getImageData(Canvas.dim.ratios["spin"][0] * Canvas.dim.width, Canvas.dim.ratios["spin"][1] * Canvas.dim.height, this.spin.width, this.spin.height);
            Canvas.behindMarker = Canvas.context.getImageData(Canvas.dim.ratios["marker"][0] * Canvas.dim.width, Canvas.dim.ratios["marker"][1] * Canvas.dim.height, Canvas.marker.width / 2, Canvas.marker.height);
        }
        if (!Canvas.won) {
            Canvas.context.drawImage(this.spin, Canvas.dim.ratios["spin"][0] * Canvas.dim.width, Canvas.dim.ratios["spin"][1] * Canvas.dim.height, this.spin.width * Canvas.dim.shrinkFactor, this.spin.height * Canvas.dim.shrinkFactor);
            Canvas.context.drawImage(this.lights, 0, 0, Canvas.dim.thirdLightsWidth, this.lights.height, Canvas.dim.ratios["lights1"][0] * Canvas.dim.width, Canvas.dim.ratios["lights1"][1] * Canvas.dim.height, Canvas.dim.thirdLightsWidth * Canvas.dim.shrinkFactor, this.lights.height * Canvas.dim.shrinkFactor);
            Canvas.context.drawImage(this.lights, Canvas.dim.thirdLightsWidth, 0, Canvas.dim.thirdLightsWidth, this.lights.height, Canvas.dim.ratios["lights2"][0] * Canvas.dim.width, Canvas.dim.ratios["lights2"][1] * Canvas.dim.height, Canvas.dim.thirdLightsWidth * Canvas.dim.shrinkFactor, this.lights.height * Canvas.dim.shrinkFactor);
        }
        if (Canvas.fontsLoaded) {
            Canvas.writeWords(45);
        }
        if (Canvas.resizing || Canvas.initialDraw) {
            Canvas.dim.setDimensions(Canvas.supportDial.width, Canvas.supportDial.height, Canvas.dial.width, Canvas.dial.height, Canvas.spin.width);
            Canvas.initialDraw = false;
        }
    }
    // Can we do change lights with save and restore? What is more expensive?
    static changeLights() {
        Canvas.drawLights();
        // Change the sx translation for both lights
        Canvas.dim.xLights1 < 2
            ? Canvas.dim.xLights1++
            : Canvas.dim.xLights1 = 0;
        Canvas.dim.xLights2 < 2
            ? Canvas.dim.xLights2++
            : Canvas.dim.xLights2 = 0;
    }
    static drawLights() {
        Canvas.context.putImageData(Canvas.behindLightsOne, Canvas.dim.ratios["lights1"][0] * Canvas.dim.width, Canvas.dim.ratios["lights1"][1] * Canvas.dim.height);
        Canvas.context.putImageData(Canvas.behindLightsTwo, Canvas.dim.ratios["lights2"][0] * Canvas.dim.width, Canvas.dim.ratios["lights2"][1] * Canvas.dim.height);
        Canvas.context.drawImage(Canvas.lights, Canvas.dim.xLights1 * Canvas.dim.thirdLightsWidth, 0, Canvas.dim.thirdLightsWidth, Canvas.lights.height, Canvas.dim.ratios["lights1"][0] * Canvas.dim.width, Canvas.dim.ratios["lights1"][1] * Canvas.dim.height, Canvas.dim.thirdLightsWidth * Canvas.dim.shrinkFactor, Canvas.lights.height * Canvas.dim.shrinkFactor);
        Canvas.context.drawImage(Canvas.lights, Canvas.dim.xLights2 * Canvas.dim.thirdLightsWidth, 0, Canvas.dim.thirdLightsWidth, Canvas.lights.height, Canvas.dim.ratios["lights2"][0] * Canvas.dim.width, Canvas.dim.ratios["lights2"][1] * Canvas.dim.height, Canvas.dim.thirdLightsWidth * Canvas.dim.shrinkFactor, Canvas.lights.height * Canvas.dim.shrinkFactor);
    }
    // decrease radius. some are on outer grip
    static getPoint() {
        return __awaiter(this, void 0, void 0, function* () {
            const a = Math.random() * 2 * Math.PI;
            // hardcode
            const r = (Canvas.dim.radiusSupport - 5) * Math.sqrt(Math.random());
            if (Math.sqrt(Math.pow((r * Math.cos(a)), 2) + Math.pow((r * Math.sin(a)), 2)) > Canvas.dim.radiusDial) {
                return [r * Math.cos(a) + Canvas.dim.centerSupport[0], r * Math.sin(a) + Canvas.dim.centerSupport[1]];
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
        if (Canvas.game.state == Canvas.game.states["ZERO_SPINS"] || Canvas.game.state == Canvas.game.states["SPUN"] && !Canvas.resizing) {
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
        if (Canvas.game.state == Canvas.game.states["ZERO_SPINS"] || Canvas.game.state == Canvas.game.states["SPUN"] && !Canvas.resizing) {
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
        Canvas.context.arc(Canvas.dim.centerSupport[0], Canvas.dim.centerSupport[1], Canvas.dim.radiusSupport + 15, 0, Math.PI * 2);
        Canvas.context.clip();
        Canvas.context.drawImage(this.background, 0, 0, Canvas.dim.width, Canvas.dim.height);
        Canvas.context.drawImage(this.supportDial, Canvas.dim.ratios["supportDial"][0] * Canvas.dim.width, Canvas.dim.ratios["supportDial"][1] * Canvas.dim.height, this.supportDial.width * Canvas.dim.shrinkFactor, this.supportDial.height * Canvas.dim.shrinkFactor);
        Canvas.context.restore();
    }
    // Method that flashes the "Spin" button. 
    // Called by a "setInterval"
    static flashSpin() {
        Canvas.context.putImageData(Canvas.behindSpin, Canvas.dim.ratios["spin"][0] * Canvas.dim.width, Canvas.dim.ratios["spin"][1] * Canvas.dim.height);
        if (Canvas.spinOn) {
            Canvas.spinOn = false;
        }
        else {
            Canvas.context.drawImage(Canvas.spin, Canvas.dim.ratios["spin"][0] * Canvas.dim.width, Canvas.dim.ratios["spin"][1] * Canvas.dim.height, Canvas.spin.width * Canvas.dim.shrinkFactor, Canvas.spin.height * Canvas.dim.shrinkFactor);
            Canvas.spinOn = true;
        }
    }
}
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
Canvas.scale = 1;
Canvas.fontsLoaded = false;
Canvas.spinOn = true;
Canvas.won = false;
Canvas.spinning = false;
Canvas.initialDraw = true;
Canvas.resizing = false;
Canvas.behindSafes = {};
// do i need center support?
Canvas.sparks = [];
Canvas.stars = [];
Canvas.currentRotation = 0;
Canvas.scaleDirection = 1;
