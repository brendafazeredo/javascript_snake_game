let canvas = document.getElementById("snake");
let context = canvas.getContext("2d");
let box = 32;

let snake = [];
snake[0] = { x: 8 * box, y: 8 * box };

let direction = "right";
let food = { x: Math.floor(Math.random() * 15 + 1) * box, y: Math.floor(Math.random() * 15 + 1) * box };
let score = 0;
let lives = 3;

let backgroundImage = new Image();
backgroundImage.src = './assets/grass.jpg';

backgroundImage.onload = function () {
  showStartScreen();
};

function createBG() {
  context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function createSnake() {
  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      context.fillStyle = "darkgreen";
      context.beginPath();
      context.arc(snake[i].x + box / 2, snake[i].y + box / 2, box / 2, 0, 2 * Math.PI);
      context.fill();

      let eyeX, eyeY;
      if (direction === "right") {
        eyeX = snake[i].x + box * 0.75;
        eyeY = snake[i].y + box / 2;
      } else if (direction === "left") {
        eyeX = snake[i].x + box * 0.25;
        eyeY = snake[i].y + box / 2;
      } else if (direction === "up") {
        eyeX = snake[i].x + box / 2;
        eyeY = snake[i].y + box * 0.25;
      } else if (direction === "down") {
        eyeX = snake[i].x + box / 2;
        eyeY = snake[i].y + box * 0.75;
      }

      context.fillStyle = "white";
      context.beginPath();
      context.arc(eyeX, eyeY, box / 8, 0, 2 * Math.PI);
      context.fill();
    } else {
      context.fillStyle = "lightgreen";
      context.beginPath();
      context.arc(snake[i].x + box / 2, snake[i].y + box / 2, box / 2, 0, 2 * Math.PI);
      context.fill();
    }
  }
}

function createFood() {
  const appleImg = document.getElementById("appleImg");
  context.drawImage(appleImg, food.x, food.y, box, box);
}

function displayRestartButton() {
  const restartBtn = document.getElementById("restartBtn");
  restartBtn.style.display = "block";
  restartBtn.addEventListener("click", restartGame);
}

document.addEventListener("keydown", function (event) {
  const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  if (arrowKeys.includes(event.key)) {
    event.preventDefault();
  }
});

function update(event) {
  switch (event.keyCode) {
    case 37:
      if (direction !== "right") direction = "left";
      break;
    case 38:
      if (direction !== "down") direction = "up";
      break;
    case 39:
      if (direction !== "left") direction = "right";
      break;
    case 40:
      if (direction !== "up") direction = "down";
      break;
  }
}

let game;

function startGameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  createBG();

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  let collision = false;
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      collision = true;
      break;
    }
  }

  if (snakeX > 15 * box || snakeX < 0 || snakeY > 15 * box || snakeY < 0 || collision) {
    if (lives > 0) {
      lives--;
      snake = [];
      snake[0] = { x: 8 * box, y: 8 * box };
    } else {
      clearInterval(game);
      playGameOverSound();
      displayRestartButton();
      showFinalScore();
      return;
    }
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      if (lives > 0) {
        lives--;
        snake = [];
        snake[0] = { x: 8 * box, y: 8 * box };
      } else {
        clearInterval(game);
        playGameOverSound();
        displayRestartButton();
        showFinalScore();
        return;
      }
    }
  }

  createSnake();
  createFood();

  if (direction === "right") snakeX += box;
  if (direction === "left") snakeX -= box;
  if (direction === "up") snakeY -= box;
  if (direction === "down") snakeY += box;

  if (snakeX !== food.x || snakeY !== food.y) {
    snake.pop();
  } else {
    score += 10;
    food.x = Math.floor(Math.random() * 15 + 1) * box;
    food.y = Math.floor(Math.random() * 15 + 1) * box;
    playEatSound();
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  snake.unshift(newHead);

  context.font = "20px Arial";
  context.fillStyle = "white";
  context.fillText("Score: " + score, box, box * 1.6);
}

const restartBtn = document.getElementById("restartBtn");
restartBtn.addEventListener("click", restartGame);

function displayRestartButton() {
  restartBtn.style.display = "block";
  restartBtn.addEventListener("click", restartGame);
}

function restartGame() {
  snake = [];
  snake[0] = { x: 8 * box, y: 8 * box };
  direction = "right";
  score = 0;
  restartBtn.style.display = "none";
  game = setInterval(startGameLoop, 200);
}

function playEatSound() {
  const eatSound = document.getElementById("eatSound");
  eatSound.currentTime = 0;
  eatSound.play();
}

function playGameOverSound() {
  const gameOverSound = document.getElementById("gameOverSound");
  gameOverSound.currentTime = 0;
  gameOverSound.play();
}

function showFinalScore() {
  context.font = "30px Arial";
  context.fillStyle = "white";
  context.fillText("Final Score: " + score, box * 5, box * 10);
}

function restartGame() {
  lives = 3;
  score = 0;
  snake = [];
  snake[0] = { x: 8 * box, y: 8 * box };
  direction = "right";
  game = setInterval(startGameLoop, 200);
  const restartBtn = document.getElementById("restartBtn");
  restartBtn.style.display = "none";
}

const backgroundMusic = document.getElementById("backgroundMusic");
const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");

function startGame() {
  const startScreen = document.getElementById("startScreen");
  startScreen.style.display = "none";
  canvas.style.display = "block";
  const backgroundMusic = document.getElementById("backgroundMusic");
  backgroundMusic.play();
  game = setInterval(startGameLoop, 200);
  const controls = document.querySelector(".controls");
  controls.style.display = "flex";
}

startBtn.addEventListener("click", startGame);

document.querySelectorAll(".arrow").forEach((arrow) => {
  arrow.addEventListener("click", (event) => {
    const id = event.target.id;
    switch (id) {
      case "left":
        if (direction !== "right") direction = "left";
        break;
      case "up":
        if (direction !== "down") direction = "up";
        break;
      case "right":
        if (direction !== "left") direction = "right";
        break;
      case "down":
        if (direction !== "up") direction = "down";
        break;
    }
  });
});

document.addEventListener("keydown", update);