document.getElementById('usernameInputForm').addEventListener('submit', function(event) {
    event.preventDefault();
    username = document.getElementById('username').value;
    document.getElementById('usernameForm').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
    // Show all buttons after login
    document.querySelectorAll('button').forEach(button => button.style.display = 'block');
    changeState(GameState.HOME);
});