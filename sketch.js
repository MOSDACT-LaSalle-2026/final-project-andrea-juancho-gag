const width = window.innerWidth
const height = window.innerHeight

let playersGP //= createGraphics(width, height) 
let ballsGP

let player1
let player2
const playerDistance = 50

const balls = []
const ballSize = 50
const ballInitSpeed = 10
const ballOpacity = 150
const ballSpawnDistance = 100
const maxBallsCount = 20

let pelotas = [] // Array to hold the explosions
let bgSound, hitSound, dieSound, dupSound // Audio variables

let player1Tilt = 'still'
let player2Tilt = 'still'

let gameState = 'START' // 'START' or 'PLAYING'

let maxSimultaneousSounds = 10 // Limit for sound effects
let currentSoundCount = 0

function preload() {
    preloadBg()
    bgSound = loadSound('sounds/background.wav')
    hitSound = loadSound('sounds/hit.wav')
    dieSound = loadSound('sounds/die.wav')
    dupSound = loadSound('sounds/dup.wav')
}

function setup() {
    createCanvas(width, height)
    frameRate(60)

    setupBg()

    hitSound.setVolume(0.3)
    dieSound.setVolume(0.1)
    dupSound.setVolume(0.1)

    playersGP = createGraphics(width, height)
    playersGP.noStroke()

    ballsGP = createGraphics(width, height)
    ballsGP.pixelDensity(1)
    ballsGP.noStroke()

    const pong1 = "Nu\nll\nP\n01n\nter\n3xc\nep\nti\n0n";
    const pong2 = "Ty\np\n3\nrror:\nCa\nnno\nt\nre\nad\np\nop\ner\nty";

    player1 = new Player(60, height / 2, color(255), pong1, RIGHT)
    player2 = new Player(width - 60, height / 2, color(255), pong2, LEFT)


    balls.push(new Ball(ballSpawnDistance, centerY, ballSize, color(255), ballInitSpeed))
    balls[0].spawn()

    const bridge1 = createBridge().connect("101")
    const bridge2 = createBridge().connect("102")

    bridge1.on("pong-gyro", (e) => {
        console.log(e.values)
        player1Tilt = e.values.state
    })

    bridge2.on("pong-gyro", (e) => {
        player2Tilt = e.values.state
    })

    bridge1.on("btn-up", (e) => {
        if (e.values) {
            player1Tilt = "forward"
        }
        else {
            player1Tilt = "still"
        }
    })

    bridge1.on("btn-down", (e) => {
        if (e.values) {
            player1Tilt = "backward"
        }
        else {
            player1Tilt = "still"
        }
    })

    bridge2.on("btn-up", (e) => {
        if (e.values) {
            player2Tilt = "forward"
        }
        else {
            player2Tilt = "still"
        }
    })

    bridge2.on("btn-down", (e) => {
        if (e.values) {
            player2Tilt = "backward"
        }
        else {
            player2Tilt = "still"
        }
    })
}

const centerX = width / 2
const centerY = height / 2
const starRadius = Math.min(width, height) * 0.45


function draw() {

    // Controls
    if (keyIsDown(87) || player1Tilt === "forward") { // W
        player1.setY(player1.y - 10)
    }
    if (keyIsDown(83) || player1Tilt === "backward") { // S
        player1.setY(player1.y + 10)
    }
    if (keyIsDown(38) || player2Tilt === "forward") { // ArrowUp
        player2.setY(player2.y - 10)
    }
    if (keyIsDown(40) || player2Tilt === "backward") { // ArrowDown
        player2.setY(player2.y + 10)
    }


    playersGP.clear()

    if (gameState === 'START') {
        background(0)
        player1.draw(playersGP)
        player2.draw(playersGP)

        image(playersGP, 0, 0)

        // Instruction text
        fill(255)
        textAlign(CENTER, CENTER)
        textSize(40)
        text("PRESS 'P' TO START", width / 2, height / 2)

    } else if (gameState === 'PLAYING') {
        fadeBall(ballsGP)

        for (let i = 0; i < balls.length; i++) {
            balls[i].update()
            const coll1 = balls[i].checkCollision(player1)
            const coll2 = balls[i].checkCollision(player2, true)
            balls[i].checkOutOfBounds()
            balls[i].draw(ballsGP)

            if (coll1 || coll2) {

                if (balls.length < maxBallsCount) {
                    const ball2 = new Ball(centerX, random(height - ballSize * 2), ballSize, color(random(0, 255), random(0, 255), random(0, 255)), ballInitSpeed)
                    const ball1 = new Ball(centerX, random(height - ballSize * 2), ballSize, color(random(0, 255), random(0, 255), random(0, 255)), ballInitSpeed)
                    ball1.spawn()
                    ball2.spawn()
                    balls.push(ball1, ball2)
                }
            }

            if (balls[i].dead) {
                balls.splice(i, 1)

                if (balls.length == 0) {
                    balls.push(new Ball(ballSpawnDistance, centerY, ballSize, color(random(0, 255), 255, 255), ballInitSpeed))
                    balls[0].spawn()
                }
            }
        }

        player1.draw(playersGP)
        player2.draw(playersGP)

        drawBg(map(balls[0].x, 0, width, 0, width * 0.5), map(balls[0].y, 0, height, 0, height * 0.5))

        for (let i = pelotas.length - 1; i >= 0; i--) {
            const p = pelotas[i]
            p.update()
            p.display(playersGP) // Draw to the clearable layer!

            if (p.muerte) {
                pelotas.splice(i, 1) // Remove dead explosions
            }
        }

        image(ballsGP, 0, 0)
        image(playersGP, 0, 0)
    }
}

function keyPressed() {
    if (key === 'p' || key === 'P') {
        if (gameState === 'START') {
            gameState = 'PLAYING'
            if (!bgSound.isPlaying()) {
                bgSound.loop()
            }
        }
    }
    if (key === 'r' || key === 'R') {
        resetGame()
    }
}

function resetGame() {
    gameState = 'START'
    bgSound.stop()
    balls.length = 0
    balls.push(new Ball(ballSpawnDistance, centerY, ballSize, color(255), ballInitSpeed))
    balls[0].spawn()
    pelotas.length = 0
    ballsGP.clear()

    // Reset player positions to center
    player1.y = height / 2 - player1.height / 2
    player2.y = height / 2 - player2.height / 2
}

function mousePressed() {
    // Requires a user action to initiate Audio Context in modern browsers sometimes
    userStartAudio()
}

function fadeBall(graphicsLayer) {
    // 1. Tell the canvas we want to "erase" instead of "draw"
    graphicsLayer.drawingContext.globalCompositeOperation = 'destination-out';

    // 2. Draw a semi-transparent rectangle over the entire layer.
    // The color (255) doesn't matter in this mode, ONLY the alpha matters.
    // The '10' is your fade speed. A higher number = faster fade.
    graphicsLayer.noStroke();
    graphicsLayer.fill(255, 10);
    graphicsLayer.rect(0, 0, graphicsLayer.width, graphicsLayer.height);

    // 3. CRITICAL: Switch the blend mode back to normal so the next balls draw correctly!
    graphicsLayer.drawingContext.globalCompositeOperation = 'source-over';
}

class Player {
    width = 0
    height = 250

    constructor(x, y, color, textContent, alignment) {
        this.x = x
        this.textContent = textContent
        this.alignment = alignment

        const lines = textContent.split('\n').length
        this.height = lines * 28 // Estimated height based on textSize 24

        this.y = y - this.height / 2
        this.color = color
    }

    setY(y) {
        this.y = y

        if (this.y < 0) {
            this.y = 0
        }

        if (this.y + this.height > height) {
            this.y = height - this.height
        }
    }

    draw(graphics) {
        graphics.fill(255)
        graphics.textAlign(this.alignment, TOP)
        graphics.textSize(24)
        graphics.text(this.textContent, this.x, this.y)
    }
}

class Ball {

    speed
    angle
    lifedFrames = 0

    constructor(x, y, radius, color, speed) {
        this.x = x
        this.y = y

        this.radius = radius
        this.color = color
        this.speed = speed
    }

    spawn() {
        let side = Math.random() > 0.5 ? 0 : PI
        this.x = side == 0 ? ballSpawnDistance : width - ballSpawnDistance

        let spread = PI / 6
        this.angle = side + random(-spread, spread)
        this.velX = cos(this.angle) * this.speed
        this.velY = sin(this.angle) * this.speed
    }

    update() {
        this.x += this.velX
        this.y += this.velY

        // Wall collisions (Top and Bottom only)
        if (this.y < 0 || this.y > height) {
            this.velY = -this.velY
            this.createExplosion(hitSound)
        }

        this.lifedFrames++
    }

    createExplosion(sound) {
        if (sound && currentSoundCount < maxSimultaneousSounds) {
            currentSoundCount++
            // Calculate stereo pan based on X position (-1.0 = left, 1.0 = right)
            let panValue = map(this.x, 0, width, -1.0, 1.0)
            sound.pan(panValue) // Apply stereo panning dynamically
            sound.play() // Play the collision/hit sound

            setTimeout(() => {
                currentSoundCount--
            }, sound.duration() * 1000)
        }
        pelotas.push(new Pelota(this.x, this.y, 15, this.radius, this.color))
    }

    checkCollision(player, isSecondPlayer = false) {
        const playerFront = isSecondPlayer ? player.x : player.x + player.width
        const playerTop = player.y
        const playerBottom = player.y + player.height

        if (!isSecondPlayer) {
            if (this.x <= playerFront &&
                this.y + this.radius / 2 > playerTop &&
                this.y - this.radius / 2 < playerBottom) {
                this.velX = -this.velX
                this.speed += 1
                const currentAngle = Math.atan2(this.velY, this.velX)
                this.velX = Math.cos(currentAngle) * this.speed
                this.velY = Math.sin(currentAngle) * this.speed

                this.createExplosion(dupSound)
                return true
            }
        } else {
            if (this.x + this.radius / 2 >= playerFront &&
                this.y + this.radius / 2 > playerTop &&
                this.y - this.radius / 2 < playerBottom) {
                this.velX = -this.velX
                this.speed += 1
                const currentAngle = Math.atan2(this.velY, this.velX)
                this.velX = Math.cos(currentAngle) * this.speed
                this.velY = Math.sin(currentAngle) * this.speed

                this.createExplosion(dupSound)
                return true
            }
        }
    }

    checkOutOfBounds() {
        if (this.x < 0 || this.x > width) {
            this.dead = true

            if (currentSoundCount < maxSimultaneousSounds) {
                currentSoundCount++
                let panValue = map(this.x, 0, width, -1.0, 1.0)
                dieSound.pan(panValue) // Apply stereo panning dynamically
                dieSound.play() // Play the collision/hit sound

                setTimeout(() => {
                    currentSoundCount--
                }, dieSound.duration() * 1000)
            }
        }
    }

    draw(graphics) {

        let x = this.x
        let y = this.y

        graphics.colorMode(graphics.HSB)

        graphics.stroke(this.color)
        graphics.strokeWeight(3)
        graphics.circle(x, y, this.radius)

        graphics.noStroke()
        graphics.colorMode(graphics.RGB)

    }
}

class Pelota {
    constructor(x, y, v, d, c) {
        this.posx = x
        this.posy = y
        this.velocidad = v
        this.dimension = d
        this.colorr = c
        this.vida = 255
        this.muerte = false
    }

    update() {
        this.dimension += this.velocidad
        this.velocidad *= 0.98

        this.vida -= 5
        if (this.vida <= 0) {
            this.muerte = true
        }
    }

    display(graphics) {
        if (this.vida <= 0) return

        graphics.noFill()
        let radio = this.dimension / 2

        for (let r = radio; r > radio - 20; r -= 3) {
            if (r < 0) break

            let distanciaAlBorde = radio - r
            let intensidad = map(distanciaAlBorde, 0, 20, 1, 0)
            intensidad = pow(intensidad, 2)

            let alphaFinal = this.vida * intensidad

            let rCol = red(this.colorr)
            let gCol = green(this.colorr)
            let bCol = blue(this.colorr)

            graphics.stroke(rCol, gCol, bCol, alphaFinal)
            graphics.strokeWeight(map(intensidad, 0, 1, 0.5, 3))

            graphics.ellipse(this.posx, this.posy, r * 2, r * 2)
        }

        graphics.noStroke()
    }
}