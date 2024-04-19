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
    SCORE: 'score',
    MAP: 'map'
};

let currentState = GameState.HOME;

var bgReady = false;
var bgImage = new Image();
bgImage.src = '../ressources/images/background.png'; // Replace with the path to your image

bgImage.onload = function () {
    bgReady = true;
    gameLoop();
};


/* ----------------------------------------
Logic and core of the application
 ---------------------------------------- */

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


//function to stop the clock
function stopGameLoop() {
    cancelAnimationFrame(animationFrameId);
}


//This function will call all the other function to change game
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
        case GameState.MAP:
            renderMapScreen();
            break;
    }
}

function renderHomeScreen() {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        hideHomeButton();
    } else {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFF';
        ctx.fillText("Loading...", canvas.width / 2 - 50, canvas.height / 2);
    }
    console.log("The current state is ", currentState);
}

function renderGameScreen() {
    ctx.fillText("Game Screen", 100, 100);
    showHomeButton();
    console.log("The current state is ", currentState);
}

function renderScoreScreen() {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    showHomeButton();
    console.log("The current state is ", currentState);
}

function renderMapScreen() {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        showMapButtons();
        showHomeButton();

    } else {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFF';
        ctx.fillText("Loading Map...", canvas.width / 2 - 50, canvas.height / 2);
    }
    console.log("The current state is ", currentState);
}



// this function handles the logic and the core of the game, when we are in game state -> requestAnimationFrame other wise we just render the different static state
function changeState(newState) {
    if (currentState === GameState.GAME) {
        stopGameLoop();  // Stop the game loop if leaving the GAME state
    }

    // Hide map buttons if leaving MAP state
    if (currentState === GameState.MAP) {
        hideMapButtons();
    }

    currentState = newState;

    // Setup or show map buttons if entering MAP state
    if (newState === GameState.MAP) {
        if (mapButtons.length === 0) {
            setupMapButtons();
        } else {
            showMapButtons();
        }
    }

    // Start the game loop if entering GAME state
    if (newState === GameState.GAME) {
        animationFrameId = requestAnimationFrame(gameLoop);
    } else {
        render();  // Ensure the screen is updated to the new state
    }
}



/* ----------------------------------------
UI 
 ---------------------------------------- */

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

new Button('mapButton', 'View Maps', () => {
    changeState(GameState.MAP);
});

// Map-specific buttons
let mapButtons = [];

function setupMapButtons() {
    // Remove existing map buttons to avoid duplicates
    mapButtons.forEach(button => button.remove());
    mapButtons = [];

    // Create new buttons
    mapButtons.push(new Button('level1Button', 'Level 1', () => {
        console.log("Level 1 Selected");
    }));
    mapButtons.push(new Button('level2Button', 'Level 2', () => {
        console.log("Level 2 Selected");
    }));
    mapButtons.push(new Button('level3Button', 'Level 3', () => {
        console.log("Level 3 Selected");
    }));

    // Position buttons specifically for the map state
    mapButtons.forEach((button, index) => {
        button.button.style.top = `${50 + index * 60}px`;
        button.button.style.left = '10px';
    });
}

function hideMapButtons() {
    mapButtons.forEach(button => button.button.style.display = 'none');
}

function showMapButtons() {
    console.log("hello");
    mapButtons.forEach(button => button.button.style.display = 'block');
}

function hideHomeButton() {
    document.getElementById('homeButton').style.display = 'none';
}

function showHomeButton() {
    document.getElementById('homeButton').style.display = 'block'; 
}
