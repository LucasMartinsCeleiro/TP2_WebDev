/* ----------------------------------------
Constants and Global Variables
---------------------------------------- */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext("2d");
const GameState = {
    HOME: 'home',
    GAME: 'game',
    SCORE: 'score',
    MAP: 'map',
    END_OF_GAME: 'end_of_game'
};
const style = document.createElement('style');
style.textContent = `
    #scoreContainer {
        position: absolute;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        background-color: rgba(0, 0, 0, 0.7);
        color: #FFF;
        padding: 20px;
        border-radius: 10px;
        max-height: 70vh;
        overflow-y: scroll;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 10px;
        border-bottom: 1px solid #FFF;
    }

    th {
        cursor: pointer;
    }

    #filters {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    #filters input, #filters select {
        padding: 5px;
        border-radius: 5px;
        border: 1px solid #FFF;
        background-color: rgba(255, 255, 255, 0.1);
        color: #FFF;
    }

    #filters select option {
        background-color: #000;
        color: #FFF;
    }

    #filters input::placeholder {
        color: #CCC;
    }

    button {
        padding: 10px 20px;
        margin: 5px;
        background-color: #000;
        border: none;
        border-radius: 5px;
        color: white;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #333;
    }

    button:active {
        background-color: #666;
    }
`;
document.head.appendChild(style);
let discs = [];
let musicDuration = 0;
let lastDiscNumber = 0;
let score = 0;
let lives = 3;
let currentState = GameState.HOME;
let bgReady = false;
let bgImage = new Image();
let animationFrameId;
let currentLevelData = {};
let currentMusic = new Audio();
const appearanceOffset = 1.233;
const margin = 150;
let mapButtons = [];
let loadLevelLock = false;
let scheduleDiscsLock = false;
let loadLevelCalled = 0; // Add this line to declare the variable
let scheduleDiscsCalled = 0; // Add this line to declare the variable
let startTime;
let lastProgress = 0; // Add this to track progress
let scores = []; // Add a variable to store the scores

/* ----------------------------------------
User Information from Cookies
---------------------------------------- */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const username = getCookie('username');
const avatar = getCookie('avatar');
const geolocation = getCookie('geolocation');

console.log(`Username: ${username}`);
console.log(`Avatar: ${avatar}`);
console.log(`Geolocation: ${geolocation}`);

/* ----------------------------------------
Disc Class
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
            this.outerRadius -= 0.5;
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

/* ----------------------------------------
Canvas Setup
---------------------------------------- */
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

/* ----------------------------------------
Game Logic
---------------------------------------- */
function gameLoop() {
    if (currentState === GameState.GAME) {
        update();
        render();
        console.log("gameLoop is called");
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

function stopGameLoop() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        console.log("Game loop stopped");
    }
}

function update() {
    console.log("update is called");
    // Update logic here
}

function render(hasWon = false) {
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
        case GameState.END_OF_GAME:
            renderEndGameScreen(hasWon);
            break;
    }
    console.log("render is called, current state: ", currentState);
}

function changeState(newState, levelNumber = 1) {
    if (currentState === GameState.GAME) {
        stopGameLoop();
        stopMusic();
        bgReady = false;
    }

    if (currentState === GameState.MAP) {
        hideMapButtons();
    }

    stopGameLoop(); // Ensure the game loop is stopped before changing the state
    currentState = newState;

    if (newState === GameState.MAP) {
        if (mapButtons.length === 0) {
            setupMapButtons();
        } else {
            showMapButtons();
        }
    } else if (newState === GameState.GAME) {
        loadLevel(levelNumber);
        startTime = performance.now(); // Reset the start time here
        animationFrameId = requestAnimationFrame(gameLoop);
    } else if (newState == GameState.HOME) {
        location.reload();
    } else {
        render();
    }

    // Show or hide buttons based on the current state
    if (newState === GameState.HOME) {
        showPlayButton();
        showScoreButton();
    } else {
        hidePlayButton();
        hideScoreButton();
        showHomeButton(); // Ensure the home button is shown on all other states
    }
}

function endGame(hasWon = false) {
    console.log("Game Over!");
    stopGameLoop(); // Stop the game loop when the game ends
    stopMusic(); // Stop the music when the game ends
    currentState = GameState.END_OF_GAME;
    render(hasWon); // Pass the win condition to render
    sendScore(hasWon); // Send the score to the server at the end of the game
}

/* ----------------------------------------
Send Score to Server
---------------------------------------- */
function sendScore(hasWon = false) {
    // If the game is won, set progress to 100%
    if (hasWon) {
        lastProgress = 100;
    }

    const scoreData = {
        username: username,
        location: geolocation,
        level: currentLevelData.level, // Assuming currentLevelData has the level number
        progress: lastProgress // The percentage of completion
    };

    console.log('Sending score data:', scoreData); // Debugging

    fetch('ressources/score/save_score.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(scoreData)
    })
    .then(response => {
        console.log('Response status:', response.status); // Debugging
        return response.json();
    })
    .then(data => {
        console.log('Response data:', data); // Debugging
        if (data.status === 'success') {
            console.log('Score saved successfully');
        } else {
            console.error('Error saving score:', data.message);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

/* ----------------------------------------
Disc Scheduling
---------------------------------------- */
function loadLevel(levelNumber) {
    if (loadLevelLock) {
        console.log('loadLevel already in progress, skipping...');
        return;
    }
    loadLevelLock = true;
    console.log(`loadLevel called ${++loadLevelCalled} times`);

    console.log("Loading level: ", levelNumber);
    fetch(`ressources/JSON/level${levelNumber}.json`)
        .then(response => response.json())
        .then(data => {
            currentLevelData = data;
            bgImage.src = data.background;
            playMusic(data.music);
            beats = data.beats;
            bgImage.onload = () => {
                bgReady = true;
                render();
            };
            console.log("Scheduling discs for level: ", levelNumber);
            scheduleDiscs();
        })
        .catch(error => console.error('Error loading the level:', error))
        .finally(() => loadLevelLock = false);
}

function scheduleDiscs() {
    if (scheduleDiscsLock) {
        console.log('scheduleDiscs already in progress, skipping...');
        return;
    }
    scheduleDiscsLock = true;
    console.log(`scheduleDiscs called ${++scheduleDiscsCalled} times`);

    if (beats.length === 0) {
        console.warn('No beats available for this level.');
        scheduleDiscsLock = false;
        return;
    }

    console.log("Beats:", beats);
    console.log("Appearance Offset:", appearanceOffset);
    console.log("Start Time:", startTime);

    beats.forEach((beat, index) => {
        const scheduleTime = (beat - appearanceOffset) * 1000;
        const targetTime = startTime + scheduleTime;
        console.log(`Beat ${index + 1}: scheduleTime = ${scheduleTime}ms, targetTime = ${targetTime}ms`);

        const scheduleDisc = () => {
            const currentTime = performance.now();
            const delay = targetTime - currentTime;

            if (delay > 0) {
                requestAnimationFrame(scheduleDisc);
            } else if (currentState === GameState.GAME) {
                let color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
                let x = margin + Math.random() * (canvas.width - 2 * margin);
                let y = margin + Math.random() * (canvas.height - 2 * margin);
                lastDiscNumber++;
                discs.push(new Disc(x, y, color, 30, lastDiscNumber));
                console.log(`Scheduled disc #${lastDiscNumber} at (${x}, ${y}) at ${currentTime - startTime}ms (targetTime: ${targetTime}ms)`);
            }
        };

        scheduleDisc();
    });
    scheduleDiscsLock = false;
}

/* ----------------------------------------
Music Control
---------------------------------------- */
function playMusic(musicPath) {
    console.log("Playing music: ", musicPath);
    currentMusic.src = musicPath;
    currentMusic.play();

    currentMusic.addEventListener('loadedmetadata', () => {
        musicDuration = currentMusic.duration;
    });

    currentMusic.addEventListener('timeupdate', () => {
        if (currentState === GameState.GAME) {
            render(); // Update the render function to ensure the progress bar is updated
        }
    });
}

function stopMusic() {
    console.log("Stopping music");
    currentMusic.pause();
    currentMusic.currentTime = 0;
}

/* ----------------------------------------
Rendering Functions
---------------------------------------- */
function renderHomeScreen() {
    bgImage.src = '../ressources/images/background.png';
    bgImage.onload = function () {
        bgReady = true;
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        hideHomeButton();
        console.log("The current state is ", currentState);
    };
}

function renderGameScreen() {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        discs.forEach(disc => disc.draw(ctx));
        discs = discs.filter(disc => disc.active);
        renderProgressBar();
        renderLives();
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
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        fetchScores(); // Fetch the scores and render them
    } else {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFF';
        ctx.fillText("Loading Background...", canvas.width / 2 - 50, canvas.height / 2);
    }
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

function renderEndGameScreen(hasWon = false) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Use the last progress percentage stored
    let progress = lastProgress;

    // Draw the "Game Over" or "You Win" text
    ctx.fillStyle = '#FFF';
    ctx.textAlign = 'center';
    ctx.font = '40px Arial';
    ctx.fillText(hasWon ? "You Win!" : "Game Over", canvas.width / 2, canvas.height / 2 - 50);

    // Draw the progress percentage text
    ctx.font = '20px Arial';
    ctx.fillText("Progress: " + progress.toFixed(2) + "%", canvas.width / 2, canvas.height / 2);

    // Draw the win/lose message
    ctx.fillText(hasWon ? "Congratulations!" : "You Lose!", canvas.width / 2, canvas.height / 2 + 50);

    console.log("The current state is ", currentState);
    showHomeButton();
}

function renderProgressBar() {
    // Calculate the percentage of progress based on the current time of the music
    let progress = (currentMusic.currentTime / musicDuration) * 100;
    lastProgress = progress;  // Update the last progress percentage

    // End the game if progress is 100%
    if (progress >= 100) {
        endGame(true); // End the game with a win condition
        return;
    }

    // Set the shadow properties for the bar and border
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;

    // Draw the progress bar background
    ctx.fillStyle = '#555';
    ctx.fillRect(10, 10, 300, 30);

    // Draw the progress bar foreground
    ctx.fillStyle = '#0f0';
    ctx.fillRect(10, 10, 300 * (progress / 100), 30);

    // Reset the shadow properties for the border
    ctx.shadowColor = 'rgba(0, 0, 0, 0)';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw the border
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 300, 30);
}

function renderLives() {
    ctx.fillStyle = '#FFF';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText("Lives: " + lives, canvas.width - 150, 30);
}

/* ----------------------------------------
Event Listeners
---------------------------------------- */
canvas.addEventListener('click', function(event) {
    if (currentState !== GameState.GAME) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    discs.forEach(disc => {
        const distance = Math.sqrt((disc.x - x) ** 2 + (disc.y - y) ** 2);
        if (distance < disc.radius) {
            let startOuterRadius = disc.radius + 30;
            let endOuterRadius = disc.radius - 7;
            let thresholdPreDisappear = endOuterRadius + 0.25 * (startOuterRadius - endOuterRadius);

            if (disc.outerRadius <= startOuterRadius && disc.outerRadius <= thresholdPreDisappear) {
                console.log("Hit!");
                disc.clicked = true;
                disc.active = false;
                score++;
            }
        }
    });

    discs = discs.filter(disc => disc.active);
    console.log("Score: ", score);
    console.log("Lives: ", lives);
});

/* ----------------------------------------
Fetch Scores from JSON File
---------------------------------------- */
function fetchScores() {
    fetch('ressources/JSON/Score.json')
        .then(response => response.json())
        .then(data => {
            scores = data;
            displayScores();
        })
        .catch(error => console.error('Error loading scores:', error));
}

/* ----------------------------------------
Render Scores on the Screen
---------------------------------------- */
function renderScores(filteredScores = scores) {
    const tbody = document.getElementById('scoreTableBody');
    tbody.innerHTML = ''; // Clear previous rows

    filteredScores.forEach(score => {
        const row = document.createElement('tr');
        ['username', 'location', 'level', 'progress', 'timestamp'].forEach(key => {
            const td = document.createElement('td');
            if (key === 'progress') {
                td.textContent = `${score[key].toFixed(2)}%`; // Arrondir à 2 décimales et ajouter %
            } else if (key === 'timestamp') {
                const date = new Date(score[key]);
                td.textContent = date.toLocaleString(); // Formater la date
            } else {
                td.textContent = score[key];
            }
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
}

/* ----------------------------------------
Display Scores with Filters
---------------------------------------- */
function displayScores() {
    const container = document.createElement('div');
    container.id = 'scoreContainer';

    const filters = document.createElement('div');
    filters.id = 'filters';

    // Search by username
    const usernameFilter = document.createElement('input');
    usernameFilter.placeholder = 'Search by username...';
    usernameFilter.addEventListener('input', filterScores);
    filters.appendChild(usernameFilter);

    // Sort by level
    const levelFilter = document.createElement('select');
    ['All Levels', 1, 2, 3].forEach(level => {
        const option = document.createElement('option');
        option.value = level;
        option.textContent = level;
        levelFilter.appendChild(option);
    });
    levelFilter.addEventListener('change', filterScores);
    filters.appendChild(levelFilter);

    // Sort by progress
    const progressFilter = document.createElement('select');
    ['Highest Progress', 'Lowest Progress'].forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText;
        option.textContent = optionText;
        progressFilter.appendChild(option);
    });
    progressFilter.addEventListener('change', filterScores);
    filters.appendChild(progressFilter);

    container.appendChild(filters);

    const table = document.createElement('table');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Username', 'Location', 'Level', 'Progress', 'Timestamp'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    tbody.id = 'scoreTableBody';
    table.appendChild(tbody);

    container.appendChild(table);
    document.body.appendChild(container);

    renderScores(); // Render the initial scores

    function filterScores() {
        let filteredScores = [...scores];

        // Filter by username
        const usernameQuery = usernameFilter.value.toLowerCase();
        if (usernameQuery) {
            filteredScores = filteredScores.filter(score => score.username.toLowerCase().includes(usernameQuery));
        }

        // Filter by level
        const level = levelFilter.value;
        if (level !== 'All Levels') {
            filteredScores = filteredScores.filter(score => score.level == level);
        }

        // Sort by progress
        if (progressFilter.value === 'Highest Progress') {
            filteredScores.sort((a, b) => b.progress - a.progress);
        } else if (progressFilter.value === 'Lowest Progress') {
            filteredScores.sort((a, b) => a.progress - b.progress);
        }

        renderScores(filteredScores);
    }
}

/* ----------------------------------------
UI
---------------------------------------- */
class CenteredButton {
    constructor(id, text, onClick, topOffset = 10) {
        this.button = document.createElement('button');
        this.button.id = id;
        this.button.textContent = text;
        this.button.style.position = 'absolute';
        this.button.style.top = `${topOffset}px`;
        this.button.style.left = '50%';
        this.button.style.transform = 'translateX(-50%)';
        this.button.addEventListener('click', onClick);
        document.body.appendChild(this.button);
    }
}

new CenteredButton('homeButton', 'Home', () => {
    changeState(GameState.HOME);
}, 10);

new CenteredButton('scoreButton', 'Scores', () => {
    changeState(GameState.SCORE);
}, window.innerHeight / 2 - 30); // Adjusted to center on screen

new CenteredButton('mapButton', 'Play', () => {
    changeState(GameState.MAP);
}, window.innerHeight / 2 + 30); // Adjusted to center on screen

function setupMapButtons() {
    mapButtons.forEach(button => button.button.remove());
    mapButtons = [];

    mapButtons.push(new CenteredButton('level1Button', 'Level 1', () => {
        changeState(GameState.GAME, 1);
    }, window.innerHeight / 2 - 60));

    mapButtons.push(new CenteredButton('level2Button', 'Level 2', () => {
        changeState(GameState.GAME, 2);
    }, window.innerHeight / 2));

    mapButtons.push(new CenteredButton('level3Button', 'Level 3', () => {
        changeState(GameState.GAME, 3);
    }, window.innerHeight / 2 + 60));
}

function hideMapButtons() {
    mapButtons.forEach(button => button.button.style.display = 'none');
}

function showMapButtons() {
    console.log("Showing map buttons");
    mapButtons.forEach(button => button.button.style.display = 'block');
}

function hideHomeButton() {
    document.getElementById('homeButton').style.display = 'none';
}

function showHomeButton() {
    document.getElementById('homeButton').style.display = 'block';
}

function hidePlayButton() {
    document.getElementById('mapButton').style.display = 'none';
}

function showPlayButton() {
    document.getElementById('mapButton').style.display = 'block';
}

function hideScoreButton() {
    document.getElementById('scoreButton').style.display = 'none';
}

function showScoreButton() {
    document.getElementById('scoreButton').style.display = 'block';
}

/* ----------------------------------------
Background Image Loading
---------------------------------------- */
bgImage.onload = function () {
    bgReady = true;
    if (currentState === GameState.HOME) {
        renderHomeScreen();
    } else if (currentState === GameState.SCORE) {
        renderScoreScreen();
    } else if (currentState === GameState.MAP) {
        renderMapScreen();
    }
};
bgImage.src = '../ressources/images/background.png'; // Replace with the path to your image
