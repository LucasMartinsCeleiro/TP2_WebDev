/* ----------------------------------------
Login Form
 ---------------------------------------- */

// Variable to store username
let username = '';

// Function to show the username form
function showUsernameForm() {
    document.getElementById('usernameForm').style.display = 'block';
    showOverlay(); // Show overlay to prevent interaction with elements behind the form
}

// Event listener for form submission
document.getElementById('usernameInputForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior
    username = document.getElementById('username').value.trim(); // Get the value entered by the user
    if (username !== '') {
        startGame(); // Call function to start the game if username is provided
        hideOverlay(); // Hide overlay when the game starts
    } else {
        alert('Please enter a username.'); // Alert user if username is empty
    }
});

// Function to start the game
function startGame() {
    document.getElementById('usernameForm').style.display = 'none'; // Hide the username input form
    // Call any initialization functions or set up the game environment here
    // For example, you may want to call changeState(GameState.HOME) to display the home screen
    changeState(GameState.HOME);
    console.log(username); // /!\ Test to check if the username is stored. Delete for production. /!\
}

// Overlay functions
function showOverlay() {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);
}

function hideOverlay() {
    const overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Call showUsernameForm() when the page loads to prompt the user for a username before accessing the game
showUsernameForm();
/* ----------------------------------------
Creation of the Discs
 ---------------------------------------- */

 class Disc {
    constructor(x, y, color, radius, number) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = radius;
        this.outerRadius = radius + 30; 
        this.number = number;
        this.active = true;
        this.clicked = false; // Ajout pour vérifier si le disque a été cliqué avec succès
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFF';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.number, this.x, this.y + 5);
        if (this.outerRadius > this.radius - 7) {   // Ajout de 5 pixels pour la marge
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.outerRadius, 0, Math.PI * 2);
            ctx.stroke();
            this.outerRadius -= 0.3;
        } else {
            this.active = false;
            if (!this.clicked) {
                lives--; // Diminue une vie si le disque n'a pas été cliqué
                if (lives <= 0) {
                    endGame(); // Termine la partie si toutes les vies sont perdues
                }
            }
        }
    }
}

let discs = []; // Liste des disques en jeu
let lastDiscNumber = 0; // Dernier numéro de disque utilisé
let score = 0; // Score
let lives = 3; // Start with 3 lives


/* ----------------------------------------
Creation of the Canevas
 ---------------------------------------- */

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
    // Vérifie que le fond d'écran est prêt avant de dessiner
    if (bgReady) {
        // Dessine le fond d'écran
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        
        // Dessine chaque disque actif
        discs.forEach(disc => disc.draw(ctx));
        
        // Filtre les disques pour enlever ceux qui ne sont plus actifs
        discs = discs.filter(disc => disc.active);
        
        // Appelle la fonction pour dessiner le score
        renderScore();
        
        // Appelle la fonction pour dessiner les vies restantes
        renderLives();
    } else {
        // Affiche un écran de chargement si le fond n'est pas prêt
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFF';
        ctx.fillText("Loading Level...", canvas.width / 2 - 50, canvas.height / 2);
    }
    
    // Montre le bouton Home à tout moment
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
        launchDiscs();              // Start generating discs
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

function renderScore() {
    ctx.fillStyle = '#FFF'; // Couleur du texte
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText("Score: " + score, 10, 30); // Positionner le score en haut à gauche
}

function renderLives() {
    ctx.fillStyle = '#FFF';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText("Lives: " + lives, canvas.width - 150, 30); // Positionner les vies en haut à droite
}

function endGame() {
    console.log("Game Over!");
    stopGameLoop(); // Arrête la boucle de jeu
    currentState = GameState.HOME; // Retour au menu principal ou à un écran de fin
    // Afficher un écran de fin ou une alerte pour informer l'utilisateur
    alert("Game Over! Your score: " + score);
}


// Function to manage the generation of the disks
function launchDiscs() {
    // Exemple de lancement de disques
    setInterval(() => {
        if (currentState === GameState.GAME) {
            let color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            lastDiscNumber++; // Incrémente le numéro de disque
            discs.push(new Disc(x, y, color, 30, lastDiscNumber)); // Ajoute le numéro du disque
        }
    }, 2000); // Lancer un disque chaque seconde
}


// Click Listener
canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    discs.forEach(disc => {
        const distance = Math.sqrt((disc.x - x) ** 2 + (disc.y - y) ** 2);
        if (distance < disc.radius) {
            // Calcul des seuils
            let startOuterRadius = disc.radius + 30; // Départ du rétrécissement
            let endOuterRadius = disc.radius - 7; // Arrivée du rétrécissement
            let thresholdPreDisappear = endOuterRadius + 0.25 * (startOuterRadius - endOuterRadius); // 25% avant la fin

            // Vérification des conditions incluant la marge avant et après la disparition
            if (disc.outerRadius <= startOuterRadius && disc.outerRadius <= thresholdPreDisappear) {
                console.log("Hit!");
                disc.clicked = true; // Marque le disque comme cliqué avec succès
                disc.active = false; // Marque le disque comme inactif
                score++; // Incrémente le score
            }
        }
    });

    // Mise à jour des disques pour enlever ceux inactifs après le clic
    discs = discs.filter(disc => disc.active);
    console.log("Score: ", score);
    console.log("Lives: ", lives);
});





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
