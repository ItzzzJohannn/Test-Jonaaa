const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

const playerImg = new Image();
playerImg.src = "assets/player.png";

const obstacleImg = new Image();
obstacleImg.src = "assets/obstacle.png";

const powerUpImg = new Image();
powerUpImg.src = "assets/powerup.png";

let player = { x: 50, y: 300, width: 50, height: 50, velocityY: 0, gravity: 0.6 };
let obstacles = [];
let powerUps = [];
let score = 0;
let isImmune = false;
let immuneTimer = 0;

function spawnObstacle() {
    obstacles.push({ x: canvas.width, y: 300, width: 50, height: 50 });
}

function spawnPowerUp() {
    if (Math.random() < 0.1) {
        powerUps.push({ x: canvas.width, y: 250, width: 40, height: 40 });
    }
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    // Gravity
    player.y += player.velocityY;
    player.velocityY += player.gravity;
    if (player.y > 300) player.y = 300;

    // Update obstacles
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= 5;
        ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        if (!isImmune && obstacle.x < player.x + player.width && obstacle.x + obstacle.width > player.x && obstacle.y < player.y + player.height && obstacle.y + obstacle.height > player.y) {
            alert("Game Over! Final Score: " + score);
            document.location.reload();
        }
    });

    // Update power-ups
    powerUps.forEach((power, index) => {
        power.x -= 3;
        ctx.drawImage(powerUpImg, power.x, power.y, power.width, power.height);

        if (power.x < player.x + player.width && power.x + power.width > player.x && power.y < player.y + player.height && power.y + power.height > player.y) {
            isImmune = true;
            immuneTimer = 600; // Lasts for 10 seconds (assuming 60 FPS)
            powerUps.splice(index, 1);
        }
    });

    // Decrease immunity timer
    if (isImmune) {
        immuneTimer--;
        if (immuneTimer <= 0) {
            isImmune = false;
        }
    }

    // Score update
    score++;
    document.getElementById("score").innerText = score;

    requestAnimationFrame(updateGame);
}

document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && player.y === 300) {
        player.velocityY = -12;
    }
});

setInterval(spawnObstacle, 2000);
setInterval(spawnPowerUp, 5000);

document.getElementById("bgMusic").play();
updateGame();
