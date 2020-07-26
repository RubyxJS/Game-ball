const canvas = document.getElementById("Canvas1");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
const ctx = canvas.getContext("2d");
const img = document.getElementById("ball");
ctx.fillStyle = "#00FF00";

function randomNumber(max) {
    return Math.floor(Math.random() * max);
}

function createObstacle(gapStart, gapEnd) {
    let xOffset = 1540;
    return function () {
        const width = 40;
        ctx.fillRect(xOffset, 0, width, gapStart);
        ctx.fillRect(xOffset, gapEnd, width, canvas.height - 100);
        xOffset -= 10;
        return xOffset + width + 2 > 0;
    }
}

const image = document.getElementById('ball');

const player = {
    w: 100,
    h: 100,
    x: 0,
    y: 303,
    speed: 20,
    dx: 0,
    dy: 0
};

function drawPlayer() {
    ctx.drawImage(image, player.x, player.y, player.w, player.h);
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height - 100);

}

function newPos() {
    player.x += player.dx;
    player.y += player.dy;

    detectWalls();
}

function detectWalls() {
    // Left wall
    if (player.x < 0) {
        player.x = 0;
    }

    // Right Wall
    if (player.x + player.w > canvas.width) {
        player.x = canvas.width - player.w;
    }

    // Top wall
    if (player.y < 0) {
        player.y = 0;
    }

    // Bottom Wall
    if (player.y + player.h > canvas.height - 100) {
        player.y = canvas.height - player.h - 100;
    }
}

// const foo = function (p1, p2) { …
// ^ same* as v
// function foo (p1, p2) { …

function crashWith (obstacle) {
    const myleft = player.x;
    const myright = player.x + (player.width);
    const mytop = player.y;
    const mybottom = player.y + (player.height);
    const otherleft = obstacle.x;
    const otherright = obstacle.x + (obstacle.width);
    const othertop = obstacle.y;
    const otherbottom = obstacle.y + (obstacle.height);
    const crash = true;
    if ((mybottom < othertop) ||
        (mytop > otherbottom) ||
        (myright < otherleft) ||
        (myleft > otherright)) {
        crash = false;
    }
    return crash;
}

const obstacles = [];
setInterval(function () {
    const gapSize = 200;
    const gapStart = randomNumber(canvas.height - 100 - gapSize);
    const gapEnd = gapStart + gapSize;
    obstacles.push(createObstacle(gapStart, gapEnd));
}, 2000);


function update() {
    clear();
    drawPlayer();
    for (const obstacle of obstacles) {
        const stillInSight = obstacle();
        if (!stillInSight) {
            obstacles.shift();
        }
    };
    console.log(obstacles.length)
    crashWith();
    newPos();
}

player.dy = 10;
window.animation = setInterval(update, 60);

let keyheld = false;
document.body.addEventListener('keydown', function (event) {
    if (keyheld) return;
    keyheld = true;
    player.dy = -20;
    const handle = setInterval(function () {
        if (!keyheld) {
            player.dy = 15;
            clearInterval(handle);
        }
    }, 300)
})

document.body.addEventListener('keyup', function (event) {
    keyheld = false;
})

