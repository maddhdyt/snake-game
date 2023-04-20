const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".highscore");
const controls = document.querySelectorAll(".controls .ctrl-box");


let gameOver = false;
let foodX, foodY;
let snakeX, snakeY;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;

// Getting highscore
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const changeFoodPosition = () => {
    // Passing a random 0 - 40 value as food position
    foodX = Math.floor(Math.random() * 35) + 1;
    foodY = Math.floor(Math.random() * 35) + 1;
}

const changeSnakePosition = () => {
    // Passing a random 0 - 40 value as food position
    snakeX = Math.floor(Math.random() * 35) + 1;
    snakeY = Math.floor(Math.random() * 35) + 1;
}

const handleGameOver = () => {
    // Celaring the timer and reloading the page on game over
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to restart...");
    location.reload();

}

// const changeDirection = (e) => {
//     // Changing velocity value based on key press
//     if (e.key === "w" || e.key === "ArrowUp" && velocityY != 1) {
//         velocityX = 0;
//         velocityY = -1;
//     } else if (e.key === "s" || e.key === "ArrowDown" && velocityY != -1) {
//         velocityX = 0;
//         velocityY = 1;
//     } else if (e.key === "a" || e.key === "ArrowLeft" && velocityX != 1) {
//         velocityX = -1;
//         velocityY = 0;
//     } else if (e.key === "d" || e.key === "ArrowRight" && velocityX != -1) {
//         velocityX = 1;
//         velocityY = 0;
//     }
// }

const changeDirection = (e) => {
    // Changing velocity value based on key press
    if (e.key === "w" | e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "s" | e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "a" | e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "d" | e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    } else if (e.key === "p") {
        velocityX = 0;
        velocityY = 0;
    }
}

controls.forEach(key => {
    key.addEventListener("click", () => changeDirection({ key: key.dataset.key }));
});

const initGame = () => {
    if (gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX};"></div>`;

    // if hit the food
    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]); // pushing food position to snake body array
        score++;

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore)
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        // Shifting forward the values of the elements in the snake body by one
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY]; // Setting first element of snake body to current snake position

    // updating snake head's position based on current velocity
    snakeX += velocityX;
    snakeY += velocityY;

    // Checking if the snake head's head is out of wall, setting gameOver to true
    if(snakeX <= 0 || snakeX > 35 || snakeY <= 0 || snakeY > 35) {
        gameOver = true;
    }
    for (let i = 0; i < snakeBody.length; i++) {
        // Adding a div for each part of the snake body
        htmlMarkup += `<div class="snake head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // game over when snake hit the body
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = htmlMarkup;
}

changeSnakePosition();
changeFoodPosition();
setIntervalId = setInterval(initGame, 85);
document.addEventListener("keydown", changeDirection);