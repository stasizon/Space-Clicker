// var counterDisplays = [
//     document.getElementsByClassName('counter__text')[0].innerHTML,
//     document.getElementsByClassName('counter__text')[1].innerHTML,
//     document.getElementsByClassName('counter__text')[2].innerHTML
// ];

var score = 0;

function addScore(value) {
    score = score + value;
    document.getElementsByClassName('counter__text')[0].innerHTML = score;

}
