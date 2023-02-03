// select canvas elements
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext("2d");

// add audio to the game
const audio = new Audio("./sources/music.mp3");

const winImage = new Image()
winImage.src = "./sources/win.png"

const startButton = document.getElementById('btnStart')
const restartButton = document.getElementById('btnRestart')

let frameId = null

// bricks colors
let colors = ["#d5d31d", "#091e65", "#a10808", "#104906"]
let griffindor = "#a10808"
let slytherin = "#104906"
let hufflepuff = "#d5d31d"
let ravenclaw = "#091e65"
let goldenSnatch = "#eac102"

// movement of the ball
let x = canvas.width / 2
let y = canvas.height -30
let dx = 3 * (Math.random() *2 - 1)
let dy = -3

// setting up game variables and constants
const paddleHeight = 10
const paddleWidth = 75
const ballRadius = 10
let paddleX = (canvas.width - paddleWidth) / 2
let score = 0
let lives = 3
let level = 1
const maxLevel = 7
let levelMaxAchieved = false
let brickRowCount = 3;
const brickColumnCount = 4;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let speedBall = 20
let isLevelDone = true

if (lives > 0) {
    restartButton.classList.add('hidden')
} else {
    restartButton.classList.remove('hidden')
    startButton.classList.add('hidden')
}

// moving the paddle
let rightPressed = false;
let leftPressed = false;

// add events for keyboard, mouse and touch control
document.addEventListener("keydown", keyDownHandler, false)
document.addEventListener("keyup", keyUpHandler, false)
document.addEventListener("mousemove", mouseMoveHandler, false)
document.addEventListener("touchmove", touchMoveHandler, false)
document.addEventListener("click", startGame, false)

// Manage sound
const soundElement = document.getElementById("sound")
soundElement.addEventListener("click", audioControl);
function audioControl() {
    let imgSrc = soundElement.getAttribute("src")
    let soundImg = imgSrc == "./sources/sound_on.svg" ? "./sources/sound_off.svg" : "./sources/sound_on.svg"

    soundElement.setAttribute("src", soundImg)

    audio.muted = audio.muted ? false : true
}

// create bricks
let bricks = []

function createBricks() {
    bricks = []
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = []
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: Math.floor(Math.random() * 4) +1 }
        }
    }  
}

function keyDownHandler (e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true
    }
}

function keyUpHandler (e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false
    }
}

function mouseMoveHandler (e) {
    const relativeX = e.clientX - canvas.offsetLeft
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2
    }
}

function touchMoveHandler(e){
    const relativeX = e.clientX - canvas.offsetLeft
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2
    }
}


function startGame (e) {
    startButton.addEventListener("click", () => {
        createBricks()
        draw()
        audio.play();
        restartButton.classList.remove('hidden')
        startButton.classList.add('hidden')
    })
}

restartButton.addEventListener("click", () => {
        location.reload()
    })

function collisionDetection () {
    for (let c = 0; c < brickColumnCount; c++){
        for (let r = 0; r < bricks[c].length; r++) {
            const b = bricks[c][r]
            if (b.status >= 1) {
                const ball = {
                    right: x + ballRadius,
                    left: x,
                    top: y,
                    bottom: y + ballRadius
                }
                const brick = {
                    right: b.x + brickWidth + brickPadding,
                    left: b.x - brickPadding,
                    top: b.y - brickPadding,
                    bottom: b.y + brickHeight + brickPadding
                }
                const isInX = ball.right > brick.left && ball.left < brick.right
                const isInY = ball.top < brick.bottom && ball.bottom > brick.top

                if (isInX && isInY) {
                    dy = -dy
                    if(b.status === 4) {
                        score += 10
                    } else if (b.status === 3) {
                        score += 5
                    } else if (b.status === 2) {
                        score += 3
                    } else {
                        score++
                    }

                    b.status = 0
                    bricks[c].splice(r, 1)

                    const levelFinished = bricks.every(arr => {
                        return arr.length === 0
                    })

                    if(levelFinished) {
                        console.log(level)
                        if(level >= maxLevel){
                            cancelAnimationFrame(frameId)
                            levelMaxAchieved = true
                            gameFinished()
                            return
                        } 
                        brickRowCount++
                        createBricks()
                        level++
                        speedBall = 20
                        x = canvas.width / 2;
                        y = canvas.height - 30;
                        dx = 3 * (Math.random() *2 - 1)
                        dy = -3
                        paddleX = (canvas.width - paddleWidth) / 2
                        draw()
                    }
                }
            }
        }
    }
}

function gameFinished() {
    ctx.font = "40px harryFont"
    ctx.fillStyle = ravenclaw
    ctx.fillText("YOU WIN!", 120, 300)
    ctx.drawImage(winImage, 140, 80, 118, 175)
}
function drawScore () {
    ctx.font = "20px harryFont"
    ctx.fillStyle = griffindor
    ctx.fillText(`Score: ${score}`, 8, 20)
}

function drawLevel () {
    ctx.font = "20px harryFont"
    ctx.fillStyle = griffindor
    ctx.fillText(`Level: ${level}`, canvas.width/2-25, 20)
}

function drawLives () {
    ctx.font = "20px harryFont"
    ctx.fillStyle = griffindor
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20)
}

function drawBall () {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = goldenSnatch;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle () {
    ctx.beginPath()
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
    ctx.fillStyle= "brown"
    ctx.fill()
    ctx.closePath()
}

function drawBricks () {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < bricks[c].length; r++){
            if (bricks[c][r].status >= 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath()
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = colors[bricks[c][r].status - 1]
                ctx.fill()
                ctx.closePath()  
            }
        } 
    }
}

function gameOver () {
    ctx.font = "40px harryFont"
    ctx.fillStyle = griffindor
    ctx.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2)
}

function draw () {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBricks()
    drawBall()
    drawPaddle()
    drawScore()
    drawLevel()
    drawLives()
    collisionDetection()
    x += dx;
    y += dy;
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - paddleHeight - ballRadius) {
        if(x  > paddleX && x < paddleX + paddleWidth) {
            let collidePoint = x - (paddleX + paddleWidth/2);
            // normalize the values
            collidePoint = collidePoint/ (paddleWidth/2);
            // calculate the angle
            let angle = collidePoint * Math.PI/3

            dx = (speedBall/5) * Math.sin(angle);
            dy = - (speedBall/5) * Math.cos(angle);
        } else {
            lives--;
            if (lives <= 0) {
                cancelAnimationFrame(frameId)
                gameOver()
                return
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2
                dy = -2
                paddleX = (canvas.width - paddleWidth) / 2
            }
        } 
    }
    
    if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
        dx = -dx
    }

    if (rightPressed) {
        paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth)
    } else if (leftPressed) {
        paddleX -= 7;
        if (paddleX < 0){
            paddleX = 0;
        }
    }

    if(!levelMaxAchieved){
        frameId = requestAnimationFrame(draw)
    }
    
}