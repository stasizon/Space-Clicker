var score = 0;
var distance = 100;

var distanceDisplay = document.getElementsByClassName('target__distance')[0];

function calculateScore(value) {
    score = score + value;
    document.getElementsByClassName('counter__text')[0].innerHTML = score;
    calculateDistance(value);
    checkUpgrade();
}

function calculateDistance(value) {
    distance = distance - value;
    distanceDisplay.innerHTML = '[' + distance + ']';
}

function checkUpgrade() {

}
