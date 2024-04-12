// Création du canevas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

// Image de fond
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
    window.requestAnimationFrame(draw);
};
bgImage.src = "ressources/images/background.png";

function draw() {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    }
    // Code pour dessiner d'autres éléments si nécessaire
}

window.requestAnimationFrame(draw);
