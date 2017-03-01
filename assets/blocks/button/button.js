var button = document.getElementById('button');

button.onmousedown = function() {
    document.getElementById('buttonColor').style.background = "linear-gradient(#b71c1c, #f44336)";
    document.getElementById('buttonColor').style.boxShadow = "0 0 10px rgba(0,0,0,1)";
    addScore(1);
}

button.onmouseup = function() {
    document.getElementById('buttonColor').style.boxShadow = "0 0 30px rgba(0,0,0,1)";
    document.getElementById('buttonColor').style.background = "linear-gradient(#f44336, #b71c1c)";
}
