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
    if (username != '') {
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
console.log(username); // /!\ Test to check if the username is stored. Delete for production. /!\