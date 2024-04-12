// Création des boutons Play et Score
var playButton = document.createElement("button");
playButton.id = "playButton";
playButton.textContent = "Play";
document.body.appendChild(playButton);

var scoreButton = document.createElement("button");
scoreButton.id = "scoreButton";
scoreButton.textContent = "Score";
document.body.appendChild(scoreButton);

// Ajouter des écouteurs d'événements pour les boutons
playButton.addEventListener("click", function() {
    // Logic pour démarrer le jeu
    console.log("Le jeu commence !");
});

scoreButton.addEventListener("click", function() {
    // Logic pour afficher les scores
    console.log("Affichage des scores !");
});
