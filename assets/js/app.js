const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".highscore");
const btnRestart = document.querySelector(".btn-restart");
const btnPause = document.querySelector(".btn-pause");
const level = document.querySelector("#level");
const controls = document.querySelectorAll(".controls .ctrl-box");

let blockX = 48, blockY = 30;
let gameOver = false;
let foodX, foodY;
let food = [];
let snakeX, snakeY;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;
let gameLevel = 80;


// Setting Level

// if (level.value === "easy"){
//     gameLevel = 200;
// } else if(level.value === "medium") {
//     gameLevel = 150;
// } else if(level.value === "hard") {
//     gameLevel = 100;
// } else if(level.value === "veryhard") {
//     gameLevel = 80;
// }

// Getting highscore
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

// Setting 
btnRestart.addEventListener("click", function () {
    if (confirm("Are you sure to restart?") == true) {
        clearInterval(setIntervalId);
        location.reload();
    }
});
btnPause.addEventListener("click", function () {
    alert("Game paused, click ok to continue!");
});

const changeSnakePosition = () => {
    // Passing a random 0 - 40 value as food position
    snakeX = Math.floor(Math.random() * blockX) + 1;
    snakeY = Math.floor(Math.random() * blockY) + 1;
}

const changeFoodPlace = () => {
    for (let i = 0; i < 3; i++) {
        food.push([
            Math.floor(Math.random() * blockX) + 1,
            Math.floor(Math.random() * blockY) + 1
        ]);
    }
}

const changeThisFoodA = () => {
    food[0] = [
        Math.floor(Math.random() * blockX) + 1,
        Math.floor(Math.random() * blockY) + 1
    ];
}

const changeThisFoodB = () => {
    food[1] = [
        Math.floor(Math.random() * blockX) + 1,
        Math.floor(Math.random() * blockY) + 1
    ];
}
const changeThisFoodC = () => {
    food[2] = [
        Math.floor(Math.random() * blockX) + 1,
        Math.floor(Math.random() * blockY) + 1
    ];
}

const handleGameOver = () => {
    // Celaring the timer and reloading the page on game over
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to restart...");
    location.reload();
}

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
    } else if (e.key === "space") {
        alert("Game paused, click ok to continue!");
    }
}

controls.forEach(key => {
    key.addEventListener("click", () => changeDirection({ key: key.dataset.key }));
});

const initGame = () => {
    if (gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area: ${food[0][1]} / ${food[0][0]};"></div><div class="food" style="grid-area: ${food[1][1]} / ${food[1][0]};"></div><div class="food" style="grid-area: ${food[2][1]} / ${food[2][0]};"></div>`;
    for (let i = 0; i < food.length; i++) {
        if (snakeX === food[i][0] && snakeY === food[i][1]) {
            snakeBody.push([food[i][0], food[i][1]]); // pushing food position to snake body array
            score++;

            highScore = score >= highScore ? score : highScore;
            localStorage.setItem("high-score", highScore)
            scoreElement.innerText = `Score: ${score}`;
            highScoreElement.innerText = `High Score: ${highScore}`;
        }
    }

    // Change food position
    if (snakeX === food[0][0] && snakeY === food[0][1]) {
        changeThisFoodA();
    } else if (snakeX === food[1][0] && snakeY === food[1][1]) {
        changeThisFoodB();
    } else if (snakeX === food[2][0] && snakeY === food[2][1]) {
        changeThisFoodC();
    }


    for (let i = snakeBody.length - 1; i > 0; i--) {
        // Shifting forward the values of the elements in the snake body by one
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY]; 
    
    // Setting first element of snake body to current snake position

    // updating snake head's position based on current velocity
    snakeX += velocityX;
    snakeY += velocityY;

    // if hit the wall
    if (snakeX <= 0 || snakeX > 48 || snakeY <= 0 || snakeY > 30) {
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
// changeFoodPosition();
changeFoodPlace();
setIntervalId = setInterval(initGame, gameLevel);
document.addEventListener("keydown", changeDirection);
// function disableF5(e) { if ((e.which || e.keyCode) == 116) e.preventDefault(); };