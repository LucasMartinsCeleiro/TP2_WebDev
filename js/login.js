// js/login.js

document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const username = document.getElementById("username").value;

        if (username) {
            // Stocker le nom d'utilisateur dans un cookie de session
            document.cookie = `username=${username}; path=/;`;

            // Masquer le formulaire de login et afficher le jeu
            document.getElementById("loginContainer").style.display = "none";
            document.getElementById("gameCanvas").style.display = "block";

            // Charger le script du jeu
            loadGameScript();
        }
    });

    // Vérifier si le cookie de session existe déjà
    const username = getCookie("username");
    if (username) {
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("gameCanvas").style.display = "block";
        loadGameScript();
    } else {
        document.getElementById("loginContainer").style.display = "block";
        document.getElementById("gameCanvas").style.display = "none";
    }
});

// Fonction pour obtenir un cookie par son nom
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Fonction pour charger le script du jeu
function loadGameScript() {
    const script = document.createElement('script');
    script.src = 'js/game.js';
    document.body.appendChild(script);
}
