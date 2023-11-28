const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const unit = 20;
const row = canvas.height / unit;
const column = canvas.width / unit;

let snake = [];
function createSnake() {
snake[0] = {
  x: 80,
  y: 0,
};

snake[1] = {
  x: 60,
  y: 0,
};

snake[2] = {
  x: 40,
  y: 0,
};

snake[3] = {
  x: 20,
  y: 0,
};
}

class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "purple";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  newLocation() {
    let overlapping = false;
    let newX;
    let newY;
    // 檢查是否有overlap, 有則重來
    function overlap(newX, newY) {
      for (let i = 0; i < snake.length; i++) {
        if (snake[i].x == newX && snake[i].y == newY) {
          overlapping = true;
          return;
        } else {
            overlapping = false;
        }
      }
    }
   
    do {
      newX = Math.floor(Math.random() * column) * unit;
      newY = Math.floor(Math.random() * row) * unit;
      overlap(newX, newY);
    } while (overlapping);
    // 檢查後, 給constructor 新座標
    this.x = newX;
    this.y = newY;
  }

  
}
//蛇
createSnake();

//果
let myFruit = new Fruit();

//方向
let d = "right";
window.addEventListener("keydown", changeDirection);

//分數
let score = 0;
let hightestScore;
loadHighestScore();
document.getElementById("myScore").innerHTML = "Current Score: " + score;
document.getElementById("myScore2").innerHTML = "Highest Score: " + hightestScore;

function changeDirection(e) {
  if (e.key == "a" && d != "right") {
    d = "left";
  } else if (e.key == "d" && d != "left") {
    d = "right";
  } else if (e.key == "w" && d != "down") {
    d = "up";
  } else if (e.key == "s" && d != "up") {
    d = "down";
  }

  // prevent snakicide
  window.removeEventListener("keydown", changeDirection);
}

function draw() {
// check if the snake bite
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x == snake[i].x) {
            if (snake[0].y == snake[i].y) {
                clearInterval(myGame);
                alert("Game Over");
                return;
            }
        }
    }

  // bg
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  myFruit.drawFruit();

  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightblue";
    }
    ctx.strokeStyle = "white";

    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  // head的座標
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d == "left") {
    snakeX -= unit;
  } else if (d == "right") {
    snakeX += unit;
  } else if (d == "up") {
    snakeY -= unit;
  } else if (d == "down") {
    snakeY += unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // 食Fruit
  if (snakeX == myFruit.x && snakeY == myFruit.y) {
    // draw new fruit, update mark
    myFruit.newLocation();
    score += 10;
    setHighestScore(score);
    document.getElementById("myScore").innerHTML = "Current Score: " + score;
    document.getElementById("myScore2").innerHTML = "Highest Score: " + hightestScore;
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, 100);

function loadHighestScore() {
    if (localStorage.getItem("highestScore") == null) {
        hightestScore = 0;
    } else {
        hightestScore = Number(localStorage.getItem("highestScore"))
    }
}

function setHighestScore(score) {
    if (score > hightestScore) {
        localStorage.setItem("highestScore", score);
        hightestScore = score;
    }
}