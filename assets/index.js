'use strict'
// VIEW

var view = {

    buttonClick: function(state) {

        if (state) {
            document.getElementById('button').classList.add('button_active');
        } else {
            document.getElementById('button').classList.remove('button_active');
        }

    },

    showScore: function(n) {
        var score = document.getElementById('counterScore');
        score.innerHTML = n;
    }

}

// MODEL

var model = {

    score: 0,

    addScore: function(score) {
        this.score++;

        view.showScore(this.score);
    }

}

//CONTROLLER

var controller = {

    buttonClick: function(buttonState) {

        if (buttonState) {
            model.addScore(1);
        }

        view.buttonClick(buttonState);
    }

}

// INIT FUNCTION

window.onload = function() {

    var app = {

        init: function() {
            this.main();
            this.event();
        },

        main: function() {

        },

        event: function() {

            document.getElementById('button').onmousedown = function() {
                controller.buttonClick(true);
            }

            document.getElementById('button').onmouseup = function() {
                controller.buttonClick(false);
            }

        }

    };

    app.init();

}
