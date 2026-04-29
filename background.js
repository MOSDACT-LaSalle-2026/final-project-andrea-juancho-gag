/**
 *  This is AI transalted code from Processing to p5js
 *  based on the code in final_test folder, all credits to Juancho
 */

let img = []; // Array to hold images
let indexImage = 0; // foto actual
let listaPelotas = []; // Array for Pelota objects
let capaEsfera;
let bgGP; // Dedicated background render layer
let frameFondo = 3;

// --brush--
let esferaX = 0;
let esferaVel = 5;
let factorColor = 0;

// variables del ruido
let timer = 0, t = 0, xoffset = 0, yoffset = 0;

const sizeW = 300
const sizeH = 200

// NOTE: You must provide the Pelota class in your JS file as well.
// I have included a placeholder class at the bottom.

function preloadBg() {
    // In p5.js, it's best to load images before setup.
    // Warning: Loading 198 images might take time in a web browser.
    for (let i = 0; i < 198; i++) {
        // nf(i+1, 5) equivalent in JS
        let num = nf(i + 1, 5);
        img[i] = loadImage("final_test/data/frame_" + num + ".png");
    }
}

function setupBg() {
    // CRITICAL: Forces pixel array to behave 1:1 like Processing. 

    // Create an offscreen buffer at lower resolution to keep pixel loops fast
    bgGP = createGraphics(sizeW, sizeH, WEBGL);
    bgGP.pixelDensity(1);

    // --brush layer--
    capaEsfera = createGraphics(sizeW, sizeH);
    capaEsfera.pixelDensity(1);
    capaEsfera.clear(); // Makes it totally transparent

    // Resize images (doing this in setup ensures they are ready)
    for (let i = 0; i < img.length; i++) {
        img[i].resize(sizeW, sizeH);
        // Load pixels once for performance
        img[i].loadPixels();
    }
}

function drawBg(ballX, ballY) {
    if (frameCount % frameFondo === 0) {
        bkg(ballX, ballY)
    }
    // In p5.js, if we don't draw a background, it automatically keeps 
    // the previous pixels. No need to call updatePixels() in an 'else' block.

    // Rastro();

    // Scale the 600x400 offscreen background to fill the screen
    image(bgGP, 0, 0, width, height);
    image(capaEsfera, 0, 0, width, height);

    actexplosion();
}

function bkg(ballX, ballY) {
    indexImage = (indexImage + 1) % img.length;
    if (!img[indexImage]) return;

    bgGP.loadPixels();

    // Map mouse to the lower resolution
    let mX = map(ballX, 0, width, 0, sizeW);
    let mY = map(ballY, 0, height, 0, sizeH);

    let d = dist(mX, mY, sizeW / 2, sizeH / 2);
    let umbral = map(d, 0, sizeW / 2, 0.6, 0.4);

    for (let y = 0; y < sizeH; y++) {
        for (let x = 0; x < sizeW; x++) {
            let index = (x + y * sizeW) * 4;

            let r = img[indexImage].pixels[index];
            let g = img[indexImage].pixels[index + 1];
            let b = img[indexImage].pixels[index + 2];

            // --- GLITCH 1: The c/5 Topography Glitch ---
            // This is what generates the intense red/pink heat map
            let c_int = (255 << 24) | (r << 16) | (g << 8) | b;
            let c_glitch = Math.trunc(c_int / 5);

            let glitchR = (c_glitch >> 16) & 0xFF;
            let glitchG = (c_glitch >> 8) & 0xFF;
            let glitchB = c_glitch & 0xFF;
            // ---------------------------------------------

            let luminancia = (r + g + b) / 3;
            let finalR, finalG, finalB;

            if (luminancia < 60) {
                finalR = 0; finalG = 0; finalB = 0; // Pure Black
            } else {
                let nuevoR = lerp(r, factorColor, 0.5);
                let nuevoG = g * 0.1;
                let nuevoB = lerp(b, 255 - factorColor, 0.4);

                let divisor = floor(random(1, 3)); // Returns 1 or 2

                // --- GLITCH 2: The colorFinal Division Glitch ---
                // This generates the glitchy blue/purple background
                let r_int = floor(constrain(nuevoG, 0, 255));
                let g_int = floor(constrain(nuevoR, 0, 255));
                let b_int = floor(constrain(nuevoB, 0, 255));

                let javaColorInt = (255 << 24) | (r_int << 16) | (g_int << 8) | b_int;
                let dividedInt = Math.trunc(javaColorInt / divisor);

                finalR = (dividedInt >> 16) & 0xFF;
                finalG = (dividedInt >> 8) & 0xFF;
                finalB = dividedInt & 0xFF;
                // ---------------------------------------------
            }

            let n = noise(0.008 * x, 0.008 * y, 0.03 * t);

            if (n > umbral) {
                // Apply the c/5 glitch to the noise threshold
                bgGP.pixels[index] = glitchR;
                bgGP.pixels[index + 1] = glitchG;
                bgGP.pixels[index + 2] = glitchB;
                bgGP.pixels[index + 3] = 255;
            } else {
                // Apply the colorFinal glitch to the background
                bgGP.pixels[index] = finalR;
                bgGP.pixels[index + 1] = finalG;
                bgGP.pixels[index + 2] = finalB;
                bgGP.pixels[index + 3] = 255;
            }
        }
    }
    bgGP.updatePixels();

    t += map(mX, 0, sizeW, -1, 1) + 0.1;
}


function Rastro() {
    // 1. REMOVE ALPHA
    capaEsfera.loadPixels();
    // Loop only through the Alpha channels (every 4th index starting at 3)
    for (let i = 3; i < capaEsfera.pixels.length; i += 4) {
        if (capaEsfera.pixels[i] > 0) {
            capaEsfera.pixels[i] -= 2; // Bajamos el alpha gradualmente
        }
    }
    capaEsfera.updatePixels();

    // 2. Draw the new trail
    capaEsfera.stroke(255, factorColor, 150, 180);
    capaEsfera.strokeWeight(20);
    capaEsfera.strokeCap(ROUND);

    // Connect mapped brush points so they align properly with the 600x400 canvas
    let mX = map(mouseX, 0, width, 0, sizeW);
    let mY = map(mouseY, 0, height, 0, sizeH);
    let pmX = map(pmouseX, 0, width, 0, sizeW);
    let pmY = map(pmouseY, 0, height, 0, sizeH);

    capaEsfera.line(pmX, pmY, mX, mY);
}

function actexplosion() {
    // ---explosion---
    // Loop backwards just like in Java to safely remove items
    for (let i = listaPelotas.length - 1; i >= 0; i--) {
        let p = listaPelotas[i];
        p.update();
        p.display();

        if (p.muerte) {
            listaPelotas.splice(i, 1); // Remove from array in JS
        }
    }
}

