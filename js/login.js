document.getElementById('loginForm').onsubmit = function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;

    // Replace this with your actual authentication logic
    if (username) {
        localStorage.setItem('authenticated', 'true');
        window.location.href = 'game.html';
    } else {
        alert("Please enter a username");
    }
};
