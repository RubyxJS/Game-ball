function randomNumber(max) {
    return Math.floor(Math.random() * max);
}

const image = document.getElementById('ball');

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

    drawRect(colour, offset, size) {
        this.context.fillStyle = colour;
        this.context.fillRect(offset.x, offset.y, size.x, size.y);
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

class Obstacle {
    constructor(width, gapStart, gapEnd, colour) {
        this.width = width;
        this.gapStart = gapStart;
        this.gapEnd = gapEnd;
        this.colour = colour;
        this.distance = 0;
    }

    draw(gameArea) {
        gameArea.drawRect(
            this.colour,
            new Coordinates(gameArea.width - this.distance, 0),
            new Coordinates(this.width, this.gapStart)
        );
        gameArea.drawRect(
            this.colour,
            new Coordinates(gameArea.width - this.distance, this.gapEnd),
            new Coordinates(this.width, gameArea.height)
        );
    }

    updatePosition() {
        this.distance += 10;
    }

    isVisible(gameArea) {
        return this.distance < gameArea.width + this.width;
    }
}

Obstacle.buildRandom = function (gameArea, width, gapSize, colour) {
    const gapStart = randomNumber(gameArea.height - gapSize);
    const gapEnd = gapStart + gapSize;
    return new Obstacle(width, gapStart, gapEnd, colour);
}

class Animation {
    constructor({ spriteImage, loopDelay, frameSize, imageGrid }) {
        this.spriteImage = spriteImage;
        this.loopDelay = loopDelay;
        this.frameSize = frameSize;
        this.imageGrid = imageGrid;
    }

    start() {
        this.loopHandle = setInterval(this.mainLoop.bind(this), this.loopDelay);
    }

    stop() {
        clearInterval(this.loopHandle);
    }

    mainLoop() {

    }
}

class Player {
    constructor(image, { size, position, restSpeed, jumpSpeed }) {
        this.image = image;
        this.size = size;
        this.position = position;
        this.restSpeed = restSpeed;
        this.jumpSpeed = jumpSpeed;
        this.rest();
    }

    draw(gameArea) {
        gameArea.drawImage(this.image, this.position, this.size);
    }

    // crashWith(obstacle) {
    //     const myleft = this.position.x;
    //     const myright = this.position.x + (this.width);
    //     const mytop = this.y;
    //     const mybottom = this.y + (this.height);
    //     const otherleft = otherobj.x;
    //     const otherright = otherobj.x + (otherobj.width);
    //     const othertop = otherobj.y;
    //     const otherbottom = otherobj.y + (otherobj.height);
    //     const crash = true;
    //     if ((mybottom < othertop) ||
    //         (mytop > otherbottom) ||
    //         (myright < otherleft) ||
    //         (myleft > otherright)) {
    //         crash = false;
    //     }
    //     return crash;
    // }

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
    constructor(gameArea, player, loopDelay, obstacleGenerationDelay) {
        this.gameArea = gameArea;
        this.player = player;
        this.loopDelay = loopDelay;
        this.obstacleGenerationDelay = obstacleGenerationDelay;
        this.obstacles = [];
    }

    start() {
        this.loopHandle = setInterval(this.mainLoop.bind(this), this.loopDelay);
        this.obstacleGenerationHandle = setInterval(this.generateObstacle.bind(this), this.obstacleGenerationDelay);
    }

    stop() {
        clearInterval(this.loopHandle);
        clearInterval(this.obstacleGenerationHandle);
    }

    mainLoop() {
        this.gameArea.clear();
        this.player.draw(this.gameArea);
        this.player.updatePosition();
        for (const [index, obstacle] of this.obstacles.entries()) {
            obstacle.draw(this.gameArea);
            obstacle.updatePosition();
            if (!obstacle.isVisible(this.gameArea)) {
                this.obstacles.splice(index, 1);
            }
        }
        this.gameArea.enclose(player);
    }

    generateObstacle() {
        const obstacle = Obstacle.buildRandom(gameArea, 50, 200, '#00ff00');
        this.obstacles.push(obstacle);
    }
}

class Controller {
    constructor(player) {
        this.player = player;
        this.keyPressedAlready = false;
        this.eventHandlers = {};
    }

    attach() {
        this.eventHandlers.keydown = this.keydown.bind(this);
        addEventListener('keydown', this.eventHandlers.keydown);
    }

    detach() {
        for (const [eventType, handler] of Object.entries(this.eventHandlers)) {
            removeEventListener(eventType, handler);
        }
    }

    keydown(event) {
        if (this.keyPressedAlready) return;

        this.keyPressedAlready = true;
        player.jump();
    }
}

const gameArea = GameArea.withCanvasID('Canvas1', 80);
const player = Player.withImageID('ball', {
    size: new Coordinates(100, 100),
    position: new Coordinates(),
    restSpeed: new Coordinates(0, 10),
    jumpSpeed: new Coordinates(0, -10),
});
const game = new Game(gameArea, player, 100, 3999);
game.start();
