// Création du canevas
const canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);



//state method, we create all different stat of our application -> only game state will be in RequestAnimationFr
const GameState = {
    HOME: 'home',
    GAME: 'game',
    SCORE: 'score'
};

let currentState = GameState.HOME;

var bgReady = false;
var bgImage = new Image();
bgImage.src = '../ressources/images/background.png'; // Replace with the path to your image

bgImage.onload = function () {
    bgReady = true;
    gameLoop();
};


var animationFrameId;

function gameLoop() {
    update();
    render();
    console.log("gameLoop is called");
    // Only call the next frame if the current state is GAME
    if (currentState === GameState.GAME) {
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

function stopGameLoop() {
    cancelAnimationFrame(animationFrameId);
}

function update() {
    console.log("hello")
}



function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    switch (currentState) {
        case GameState.HOME:
            renderHomeScreen();
            break;
        case GameState.GAME:
            renderGameScreen();
            break;
        case GameState.SCORE:
            renderScoreScreen();
            break;
    }
}


function renderHomeScreen() {
    document.getElementById('homeButton').style.display = 'none'; // Hide home button on home screen
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFF';
        ctx.fillText("Loading...", canvas.width / 2 - 50, canvas.height / 2);
    }
    console.log("The current state is ", currentState);
}

function renderGameScreen() {
    document.getElementById('homeButton').style.display = 'block'; // Show home button on game screen
    ctx.fillText("Game Screen", 100, 100);
    console.log("The current state is ", currentState);
}

function renderScoreScreen() {
    document.getElementById('homeButton').style.display = 'block'; // Show home button on score screen
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    console.log("The current state is ", currentState);
}



//Main buttons that will be displayed throughout the game
class Button {
    constructor(id, text, onClick) {
        this.button = document.createElement('button');
        this.button.id = id;
        this.button.textContent = text;
        this.button.style.position = 'absolute'; // Position it as needed
        this.button.style.top = '10px'; // Change as needed
        this.button.style.left = `${10 + 100 * Object.keys(GameState).indexOf(id.replace('Button', '').toUpperCase())}px`; // Example dynamic positioning
        this.button.addEventListener('click', onClick);
        document.body.appendChild(this.button);
    }
}

new Button('gameButton', 'Start Game', () => {
    changeState(GameState.GAME);
});

new Button('homeButton', 'Home', () => {
    changeState(GameState.HOME);
});

new Button('scoreButton', 'View Scores', () => {
    changeState(GameState.SCORE);
});

// this function handles the logic and the core of the game, when we are in game state -> requestAnimationFrame other wise we just render the different static state
function changeState(newState) {
    if (currentState === GameState.GAME) {
        stopGameLoop();  // Always stop the game loop if leaving the GAME state
    }

    currentState = newState;

    if (newState === GameState.GAME) {
        animationFrameId = requestAnimationFrame(gameLoop);  // Only start the game loop if entering the GAME state
    } else {
        render();  // Ensure the screen is updated to the new state if not in GAME
    }
}
