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
var currentLevelData = {};
var currentMusic = new Audio();

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
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FFF";
        ctx.fillText("Game Screen - Level " + currentLevelData.level, 100, 100);
    } else {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFF';
        ctx.fillText("Loading Level...", canvas.width / 2 - 50, canvas.height / 2);
    }
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
function changeState(newState, levelNumber = 1) {
    if (currentState === GameState.GAME) {
        stopGameLoop();  // Stop the game loop if leaving the GAME state
        stopMusic();     // Stop the music when leaving the game state
        // Reset the background to the default when leaving the game state
        bgImage.src = '../ressources/images/background.png';
        bgReady = false; // Set background readiness to false
        bgImage.onload = () => {
            bgReady = true;
            render();  // Render again once the default background is loaded
        };
    }

    if (currentState === GameState.MAP) {
        hideMapButtons();  // Hide map buttons if leaving MAP state
    }

    currentState = newState; // Update the current state

    if (newState === GameState.MAP) {
        if (mapButtons.length === 0) {
            setupMapButtons();  // Setup map buttons if none exist
        } else {
            showMapButtons();  // Show map buttons if they are already setup
        }
    } else if (newState === GameState.GAME) {
        loadLevel(levelNumber);     // Load level data when entering GAME state
        animationFrameId = requestAnimationFrame(gameLoop);  // Start the game loop
    } else {
        render();  // Ensure the screen is updated to the new state
    }
}



function loadLevel(levelNumber) {
    fetch(`ressources/JSON/level${levelNumber}.json`)
        .then(response => response.json())
        .then(data => {
            currentLevelData = data;
            bgImage.src = data.background;  // Update the background image source
            playMusic(data.music);          // Play the level music
            bgImage.onload = () => {
                bgReady = true;
                render();  // Update the game screen once the background is ready
            };
        })
        .catch(error => console.error('Error loading the level:', error));
}

function playMusic(musicPath) {
    currentMusic.src = musicPath;
    currentMusic.play();
}

function stopMusic() {
    currentMusic.pause();  // Met en pause la musique actuelle
    currentMusic.currentTime = 0;  // Réinitialise le temps à 0
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
        this.button.style.left = `${300 + 100 * Object.keys(GameState).indexOf(id.replace('Button', '').toUpperCase())}px`; // Example dynamic positioning
        this.button.addEventListener('click', onClick);
        document.body.appendChild(this.button);
    }
}

new Button('homeButton', 'Home', () => {
    changeState(GameState.HOME);
});

new Button('scoreButton', 'Scores', () => {
    changeState(GameState.SCORE);
});

new Button('mapButton', 'Play', () => {
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
        changeState(GameState.GAME, 1);
    }));
    mapButtons.push(new Button('level2Button', 'Level 2', () => {
        changeState(GameState.GAME, 2);
    }));
    mapButtons.push(new Button('level3Button', 'Level 3', () => {
        changeState(GameState.GAME, 3);
    }));

    // Calculate the vertical offset to center buttons
    const centerTop = window.innerHeight / 2 - (mapButtons.length * 60 / 2); // Assuming button height is less than 60px

    // Position each button in the center of the page
    mapButtons.forEach((button, index) => {
        button.button.style.top = `${centerTop + index * 60}px`; // Adjust spacing by 60px per button
        button.button.style.left = `${window.innerWidth / 2 - button.button.offsetWidth / 2}px`; // Center horizontally
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
