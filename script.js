const canvas = document.getElementById('canvas')
const ctx = canvas.getContext("2d");

const startButton = document.getElementById('btnStart')
const restartButton = document.getElementById('btnRestart')

// ball size
const ballRadius = 10

// bricks colors
let colors = ["#a10808", "#104906", "d5d31d", "#091e65"]
let griffindor = "#a10808"
let slytherin = "#104906"
let hufflepuff = "d5d31d"
let ravenclaw = "#091e65"
let goldenSnatch = "#eac102"

// movement of the ball
let x = canvas.width / 2
let y = canvas.height -30
let dx = 2
let dy = -2

// paddle
const paddleHeight = 10
const paddleWidth = 75
let paddleX = (canvas.width - paddleWidth) / 2

// moving the paddle
let rightPressed = false;
let leftPressed = false;

let speedBall = 15

// score
let score = 0

// lives
let lives = 3

if (lives) {
    restartButton.classList.add('hidden')
} else {
    restartButton.classList.remove('hidden')
    startButton.classList.add('hidden')
}

// add events for keyboard, mouse and touch control
document.addEventListener("keydown", keyDownHandler, false)
document.addEventListener("keyup", keyUpHandler, false)
document.addEventListener("mousemove", mouseMoveHandler, false)
document.addEventListener("touchmove", mouseMoveHandler, false)

document.addEventListener("click", startGame, false)
document.addEventListener("click", restartGame, false)


// setting up bricks variables
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const bricks = []
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = []
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 }
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

function startGame (e) {
    startButton.addEventListener("click", () => {
        draw()
        restartButton.classList.remove('hidden')
        startButton.classList.add('hidden')
    })
}

function restartGame (e) {
    restartButton.addEventListener("click", () => {
        // document.location.reload()
        draw()
        speedBall-=5
    })
}

function collisionDetection () {
    for (let c = 0; c < brickColumnCount; c++){
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r]
            if (b.status === 1) {
                if (x > b.x && 
                x < b.x + brickWidth && 
                y > b.y && 
                y < b.y + brickHeight) {
                dy = -dy
                b.status = 0
                score++
                if (score === brickRowCount * brickColumnCount) {
                    alert("YOU WIN, CONGRATULATIONS!")
                    document.location.reload()
                }
                }
            }
            
        }
    }
}

function drawScore () {
    ctx.font = "20px harryFont"
    ctx.fillStyle = griffindor
    ctx.fillText(`Score: ${score}`, 8, 20)
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
        for (let r = 0; r < brickRowCount; r++){
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath()
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = griffindor
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
    drawLives()
    collisionDetection()
    x += dx;
    y += dy;
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            if (lives === 0) {
                gameOver()
                setIntervals(document.location.reload(), 3000)
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

    requestAnimationFrame(draw)
}

// draw()



