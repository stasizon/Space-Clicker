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
    },

    showPerSecond: function(n) {
        var perSecond = document.getElementById('counterPerSecond');
        perSecond.innerHTML = n;
    },

    changeUpgradeStatus: function(upgradeNumber, status) {
        var upgrades = document.getElementsByClassName('upgrade');
        if (status) {
            upgrades[upgradeNumber].classList.add('upgrade_active');
        } else {
            upgrades[upgradeNumber].classList.remove('upgrade_active');
        }

    },

    renderUpgrades: function() {
        var upgradesContainer = document.getElementsByClassName('rightPanel')[0];
        var upgradeTemplate = document.getElementsByClassName('upgrade')[0];

        for (var i = 0; i < model.upgrades.length; i++) {

            var template = upgradeTemplate.cloneNode(true);
                template.style.display = 'block';
                template.getElementsByClassName('upgrade__title')[0].innerHTML = model.upgrades[i].name;
                template.getElementsByClassName('upgrade__cost')[0].innerHTML = model.upgrades[i].cost;
                template.getElementsByClassName('upgrade__produce')[0].innerHTML = model.upgrades[i].produce;
                template.getElementsByClassName('upgrade__img')[0].style.background =
                        'url(./img/' + model.upgrades[i].name.toLowerCase() + '.svg) no-repeat center / contain';
                template.setAttribute('num', i);
                template.onclick = function() {
                    model.setUpgrade(this.getAttribute('num'));
                }

            upgradesContainer.appendChild(template);

        }

        upgradeTemplate.remove();

    },

    updateUpgrade: function(upgradeNumber) {

        var upgrades = document.getElementsByClassName('upgrade');
        upgrades[upgradeNumber].getElementsByClassName('upgrade__cost')[0].innerHTML = model.upgrades[upgradeNumber].cost;
        upgrades[upgradeNumber].getElementsByClassName('upgrade__amount')[0].innerHTML = ++model.upgrades[upgradeNumber].amount;

    },

    initRockets: function() {

        var interval = (1 / model.perSecond) * 5000;

        setTimeout(function () {

            if (interval !== Infinity) {
                view.launchRocket();
            }

            view.initRockets();

        }, interval);


    },

    launchRocket: function() {

        var screen = document.getElementsByClassName('screen')[0];

        var rocket = {
            element: document.createElement('div'),
            size: model.getRandomInteger(1, 3),
            type: model.getRandomInteger(1, 2),
            x: model.getRandomInteger(0, 95)
        };

        var rocketElement = document.createElement('div');
            rocketElement.classList.add('rocket', 'rocket_size_' + rocket.size, 'rocket_type_' + rocket.type);
            rocketElement.style.left = rocket.x + '%';
            setTimeout(function () {
                rocketElement.remove();
            }, 10000);

        screen.appendChild(rocketElement);
    }

}

// MODEL

var model = {

    score: 0,
    perSecond: 0,
    upgrades: [],
    isUpgraded: false,

    addScore: function(score) {
        this.score = this.score + score;

        view.showScore(Math.floor(this.score));
    },

    checkUpgrades: function() {
        for (var i = 0; i < model.upgrades.length; i++) {
            if (this.score >= model.upgrades[i].cost) {
                model.upgrades[i].state = true;
                view.changeUpgradeStatus(i, true);
            } else {
                model.upgrades[i].state = false;
                view.changeUpgradeStatus(i, false);
            }
        }
    },

    setUpgrade: function(upgradeNumber) {
        if (model.upgrades[upgradeNumber].cost <= model.score) {
            this.perSecond = this.perSecond + model.upgrades[upgradeNumber].produce;

            model.score -= model.upgrades[upgradeNumber].cost;
            model.upgrades[upgradeNumber].cost = Math.floor(model.upgrades[upgradeNumber].cost * 1.2);

            view.showPerSecond(model.perSecond);
            view.updateUpgrade(upgradeNumber);
        }

    },

    initLoop: function() {
        setInterval(function() {
            model.addScore(model.perSecond / 4);
            model.checkUpgrades();

        }, 250);
    },

    getUpgrades: function() {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'server/upgrades.json', true);
        xhr.send();

        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;

            if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText);
            } else {
                model.upgrades = JSON.parse(xhr.responseText);
                view.renderUpgrades();
            }

        }

    },

    getRandomInteger: function(min, max) {
        return Math.round(min + Math.random() * (max - min));
    }

}

//CONTROLLER

var controller = {

    buttonClick: function(buttonState) {

        if (buttonState) {
            model.addScore(1);
            if (model.score%5 == 0 ) {
                view.launchRocket();
            }
        }

        view.buttonClick(buttonState);

        model.checkUpgrades();

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
            model.initLoop();
            model.getUpgrades();
            view.initRockets();
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
