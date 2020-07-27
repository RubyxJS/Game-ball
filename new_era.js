function randomNumber(max) {
    return Math.floor(Math.random() * max);
}

const image = document.getElementById('ball');

class Rectangle {
    constructor(xLeft, yTop, xRight, yBottom) {
        this.xLeft = xLeft;
        this.yTop = yTop;
        this.xRight = xRight;
        this.yBottom = yBottom;
    }
}

class Coordinates {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
}

class GameArea {
    constructor(element, baseline) {
        this.element = element;
        this.context = this.element.getContext('2d');
        this.width = document.body.clientWidth;
        this.height = document.body.clientHeight;
        this.baseline = baseline;
    }

    get width() {
        return this.element.width;
    }

    set width(value) {
        this.element.width = value;
    }

    get height() {
        return this.element.height;
    }

    set height(value) {
        this.element.height = value;
    }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    drawImage(image, offset, size) {
        this.context.drawImage(image, offset.x, offset.y, size.x, size.y);
    }
    
    enclose(player) {
        // Left wall
        if (player.position.x < 0) {
            player.position.x = 0;
        }
    
        // Right Wall
        if (player.position.x + player.size.x > this.width) {
            player.position.x = this.width - player.size.x;
        }
    
        // Top wall
        if (player.position.y < 0) {
            player.position.y = 0;
        }
    
        // Bottom Wall
        if (player.position.y + player.size.y > this.height - this.baseline) {
            player.position.y = this.height - player.size.y - this.baseline;
        }
    }
}

GameArea.withCanvasID = function (id, ...otherParameters) {
    return new GameArea(document.getElementById(id), ...otherParameters);
};

class Player {
    constructor(image, { size, position, restSpeed, jumpSpeed }) {
        this.image = image;
        this.size = size;
        this.position = position;
        this.restSpeed = restSpeed;
        this.jumpSpeed = jumpSpeed;
        this.rest();
    }

    updatePosition() {
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
    }
    
    rest() {
        this.speed = this.restSpeed;
    }
    
    jump() {
        this.speed = this.jumpSpeed;
    }
}

Player.withImageID = function (id, ...otherParameters) {
    return new Player(document.getElementById(id), ...otherParameters);
}

class Game {
    constructor(gameArea, player, loopDelay) {
        this.gameArea = gameArea;
        this.player = player;
        this.loopDelay = loopDelay;
    }

    start() {
        this.loopHandle = setInterval(this.mainLoop.bind(this), this.loopDelay);
    }

    stop() {
        clearInterval(this.loopHandle);
    }

    mainLoop() {
        this.gameArea.clear();
        this.drawPlayer();
        this.player.updatePosition();
        this.gameArea.enclose(player);
    }

    drawPlayer() {
        this.gameArea.drawImage(player.image, player.position, player.size);
    }
}

const gameArea = GameArea.withCanvasID('Canvas1', 80);
const player = Player.withImageID('ball', {
    size: new Coordinates(100, 100),
    position: new Coordinates(),
    restSpeed: new Coordinates(0, 10),
    jumpSpeed: new Coordinates(0, -10),
});
const game = new Game(gameArea, player, 100);
game.start();
