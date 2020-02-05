'use strict';

// MODEL
const model = {
        score: 0,
        perSecond: 0,
        isUpgraded: false,
        upgrades: [
            {
                "name": "Worker",
                "cost": 15,
                "produce": 0.5,
                "amount": 0,
                "image": "worker.svg",
                "state": false
            },

            {
                "name": "Engineer",
                "cost": 100,
                "produce": 2,
                "amount": 0,
                "image": "engineer.svg",
                "state": false
            },

            {
                "name": "Designer",
                "cost": 500,
                "produce": 5,
                "amount": 0,
                "image": "designer.svg",
                "state": false
            },

            {
                "name": "Inventor",
                "cost": 1500,
                "produce": 10,
                "amount": 0,
                "image": "inventor.svg",
                "state": false
            },

            {
                "name": "Manager",
                "cost": 3500,
                "produce": 15,
                "amount": 0,
                "image": "manager.svg",
                "state": false
            }

        ],

        addScore: function (score) {
            this.score = this.score + score;

            view.showScore(Math.floor(this.score));
        }
        ,

        checkUpgrades: function () {
            for (var i = 0; i < model.upgrades.length; i++) {
                if (this.score >= model.upgrades[i].cost) {
                    model.upgrades[i].state = true;
                    view.changeUpgradeStatus(i, true);
                } else {
                    model.upgrades[i].state = false;
                    view.changeUpgradeStatus(i, false);
                }
            }
        }
        ,

        setUpgrade: function (upgradeNumber) {
            if (model.upgrades[upgradeNumber].cost <= model.score) {
                this.perSecond = this.perSecond + model.upgrades[upgradeNumber].produce;

                model.score -= model.upgrades[upgradeNumber].cost;
                model.upgrades[upgradeNumber].cost = Math.floor(model.upgrades[upgradeNumber].cost * 1.2);

                view.showPerSecond(model.perSecond);
                view.updateUpgrade(upgradeNumber);
            }

        }
        ,

        initLoop: function () {
            setInterval(function () {
                model.addScore(model.perSecond / 4);
                model.checkUpgrades();

            }, 250);
        }
        ,

        getUpgrades: function () {
            view.renderUpgrades();
        }
        ,

        getRandomInteger: function (min, max) {
            return Math.round(min + Math.random() * (max - min));
        }

    }
;
// VIEW

const view = {

    buttonClick: function (state) {

        if (state) {
            document.getElementById('button').classList.add('button_active');
        } else {
            document.getElementById('button').classList.remove('button_active');
        }

    },

    showScore: function (n) {
        var score = document.getElementById('counterScore');
        score.innerHTML = n;
    },

    showPerSecond: function (n) {
        var perSecond = document.getElementById('counterPerSecond');
        perSecond.innerHTML = n;
    },

    changeUpgradeStatus: function (upgradeNumber, status) {
        var upgrades = document.getElementsByClassName('upgrade');
        if (status) {
            upgrades[upgradeNumber].classList.add('upgrade_active');
        } else {
            upgrades[upgradeNumber].classList.remove('upgrade_active');
        }

    },

    renderUpgrades: function () {
        var upgradesContainer = document.getElementsByClassName('rightPanel')[0];
        var upgradeTemplate = document.getElementsByClassName('upgrade')[0];

        for (var i = 0; i < model.upgrades.length; i++) {

            var template = upgradeTemplate.cloneNode(true);
            template.style.display = 'block';
            template.getElementsByClassName('upgrade__title')[0].innerHTML = model.upgrades[i].name;
            template.getElementsByClassName('upgrade__cost')[0].innerHTML = model.upgrades[i].cost;
            template.getElementsByClassName('upgrade__produce')[0].innerHTML = model.upgrades[i].produce;
            template.getElementsByClassName('upgrade__img')[0].style.background =
                'url(./img/' + model.upgrades[i].name.toLowerCase() + '.svg) no-repeat center / 100%';
            template.setAttribute('num', i);
            template.onclick = function () {
                model.setUpgrade(this.getAttribute('num'));
            }

            upgradesContainer.appendChild(template);

        }

        upgradeTemplate.remove();

    },

    updateUpgrade: function (upgradeNumber) {

        var upgrades = document.getElementsByClassName('upgrade');
        upgrades[upgradeNumber].getElementsByClassName('upgrade__cost')[0].innerHTML = model.upgrades[upgradeNumber].cost;
        upgrades[upgradeNumber].getElementsByClassName('upgrade__amount')[0].innerHTML = ++model.upgrades[upgradeNumber].amount;

    },

    initRockets: function () {

        var interval = (1 / model.perSecond) * 5000;

        setTimeout(function () {

            if (interval !== Infinity) {
                view.launchRocket();
            }

            view.initRockets();

        }, interval);


    },

    launchRocket: function () {

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

};

//CONTROLLER

const controller = {

    buttonClick: function (buttonState) {

        if (buttonState) {
            model.addScore(1);
            if (model.score % 5 == 0) {
                view.launchRocket();
            }
        }

        view.buttonClick(buttonState);

        model.checkUpgrades();

    }

};

// INIT FUNCTION

window.onload = function () {

    var app = {

        init: function () {
            this.main();
            this.event();
        },

        main: function () {
            model.initLoop();
            model.getUpgrades();
            view.initRockets();
        },

        event: function () {

            document.getElementById('button').onmousedown = function () {
                controller.buttonClick(true);
            }

            document.getElementById('button').onmouseup = function () {
                controller.buttonClick(false);
            }
        }

    };

    app.init();

};

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbi8vIE1PREVMXG5jb25zdCBtb2RlbCA9IHtcbiAgICAgICAgc2NvcmU6IDAsXG4gICAgICAgIHBlclNlY29uZDogMCxcbiAgICAgICAgaXNVcGdyYWRlZDogZmFsc2UsXG4gICAgICAgIHVwZ3JhZGVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiV29ya2VyXCIsXG4gICAgICAgICAgICAgICAgXCJjb3N0XCI6IDE1LFxuICAgICAgICAgICAgICAgIFwicHJvZHVjZVwiOiAwLjUsXG4gICAgICAgICAgICAgICAgXCJhbW91bnRcIjogMCxcbiAgICAgICAgICAgICAgICBcImltYWdlXCI6IFwid29ya2VyLnN2Z1wiLFxuICAgICAgICAgICAgICAgIFwic3RhdGVcIjogZmFsc2VcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJFbmdpbmVlclwiLFxuICAgICAgICAgICAgICAgIFwiY29zdFwiOiAxMDAsXG4gICAgICAgICAgICAgICAgXCJwcm9kdWNlXCI6IDIsXG4gICAgICAgICAgICAgICAgXCJhbW91bnRcIjogMCxcbiAgICAgICAgICAgICAgICBcImltYWdlXCI6IFwiZW5naW5lZXIuc3ZnXCIsXG4gICAgICAgICAgICAgICAgXCJzdGF0ZVwiOiBmYWxzZVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIkRlc2lnbmVyXCIsXG4gICAgICAgICAgICAgICAgXCJjb3N0XCI6IDUwMCxcbiAgICAgICAgICAgICAgICBcInByb2R1Y2VcIjogNSxcbiAgICAgICAgICAgICAgICBcImFtb3VudFwiOiAwLFxuICAgICAgICAgICAgICAgIFwiaW1hZ2VcIjogXCJkZXNpZ25lci5zdmdcIixcbiAgICAgICAgICAgICAgICBcInN0YXRlXCI6IGZhbHNlXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiSW52ZW50b3JcIixcbiAgICAgICAgICAgICAgICBcImNvc3RcIjogMTUwMCxcbiAgICAgICAgICAgICAgICBcInByb2R1Y2VcIjogMTAsXG4gICAgICAgICAgICAgICAgXCJhbW91bnRcIjogMCxcbiAgICAgICAgICAgICAgICBcImltYWdlXCI6IFwiaW52ZW50b3Iuc3ZnXCIsXG4gICAgICAgICAgICAgICAgXCJzdGF0ZVwiOiBmYWxzZVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIk1hbmFnZXJcIixcbiAgICAgICAgICAgICAgICBcImNvc3RcIjogMzUwMCxcbiAgICAgICAgICAgICAgICBcInByb2R1Y2VcIjogMTUsXG4gICAgICAgICAgICAgICAgXCJhbW91bnRcIjogMCxcbiAgICAgICAgICAgICAgICBcImltYWdlXCI6IFwibWFuYWdlci5zdmdcIixcbiAgICAgICAgICAgICAgICBcInN0YXRlXCI6IGZhbHNlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgXSxcblxuICAgICAgICBhZGRTY29yZTogZnVuY3Rpb24gKHNjb3JlKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3JlID0gdGhpcy5zY29yZSArIHNjb3JlO1xuXG4gICAgICAgICAgICB2aWV3LnNob3dTY29yZShNYXRoLmZsb29yKHRoaXMuc2NvcmUpKTtcbiAgICAgICAgfVxuICAgICAgICAsXG5cbiAgICAgICAgY2hlY2tVcGdyYWRlczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtb2RlbC51cGdyYWRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNjb3JlID49IG1vZGVsLnVwZ3JhZGVzW2ldLmNvc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kZWwudXBncmFkZXNbaV0uc3RhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB2aWV3LmNoYW5nZVVwZ3JhZGVTdGF0dXMoaSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kZWwudXBncmFkZXNbaV0uc3RhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5jaGFuZ2VVcGdyYWRlU3RhdHVzKGksIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLFxuXG4gICAgICAgIHNldFVwZ3JhZGU6IGZ1bmN0aW9uICh1cGdyYWRlTnVtYmVyKSB7XG4gICAgICAgICAgICBpZiAobW9kZWwudXBncmFkZXNbdXBncmFkZU51bWJlcl0uY29zdCA8PSBtb2RlbC5zY29yZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucGVyU2Vjb25kID0gdGhpcy5wZXJTZWNvbmQgKyBtb2RlbC51cGdyYWRlc1t1cGdyYWRlTnVtYmVyXS5wcm9kdWNlO1xuXG4gICAgICAgICAgICAgICAgbW9kZWwuc2NvcmUgLT0gbW9kZWwudXBncmFkZXNbdXBncmFkZU51bWJlcl0uY29zdDtcbiAgICAgICAgICAgICAgICBtb2RlbC51cGdyYWRlc1t1cGdyYWRlTnVtYmVyXS5jb3N0ID0gTWF0aC5mbG9vcihtb2RlbC51cGdyYWRlc1t1cGdyYWRlTnVtYmVyXS5jb3N0ICogMS4yKTtcblxuICAgICAgICAgICAgICAgIHZpZXcuc2hvd1BlclNlY29uZChtb2RlbC5wZXJTZWNvbmQpO1xuICAgICAgICAgICAgICAgIHZpZXcudXBkYXRlVXBncmFkZSh1cGdyYWRlTnVtYmVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgICxcblxuICAgICAgICBpbml0TG9vcDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIG1vZGVsLmFkZFNjb3JlKG1vZGVsLnBlclNlY29uZCAvIDQpO1xuICAgICAgICAgICAgICAgIG1vZGVsLmNoZWNrVXBncmFkZXMoKTtcblxuICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgfVxuICAgICAgICAsXG5cbiAgICAgICAgZ2V0VXBncmFkZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZpZXcucmVuZGVyVXBncmFkZXMoKTtcbiAgICAgICAgfVxuICAgICAgICAsXG5cbiAgICAgICAgZ2V0UmFuZG9tSW50ZWdlcjogZnVuY3Rpb24gKG1pbiwgbWF4KSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChtaW4gKyBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikpO1xuICAgICAgICB9XG5cbiAgICB9XG47XG4vLyBWSUVXXG5cbmNvbnN0IHZpZXcgPSB7XG5cbiAgICBidXR0b25DbGljazogZnVuY3Rpb24gKHN0YXRlKSB7XG5cbiAgICAgICAgaWYgKHN0YXRlKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnV0dG9uJykuY2xhc3NMaXN0LmFkZCgnYnV0dG9uX2FjdGl2ZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1dHRvbicpLmNsYXNzTGlzdC5yZW1vdmUoJ2J1dHRvbl9hY3RpdmUnKTtcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIHNob3dTY29yZTogZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgdmFyIHNjb3JlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvdW50ZXJTY29yZScpO1xuICAgICAgICBzY29yZS5pbm5lckhUTUwgPSBuO1xuICAgIH0sXG5cbiAgICBzaG93UGVyU2Vjb25kOiBmdW5jdGlvbiAobikge1xuICAgICAgICB2YXIgcGVyU2Vjb25kID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvdW50ZXJQZXJTZWNvbmQnKTtcbiAgICAgICAgcGVyU2Vjb25kLmlubmVySFRNTCA9IG47XG4gICAgfSxcblxuICAgIGNoYW5nZVVwZ3JhZGVTdGF0dXM6IGZ1bmN0aW9uICh1cGdyYWRlTnVtYmVyLCBzdGF0dXMpIHtcbiAgICAgICAgdmFyIHVwZ3JhZGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndXBncmFkZScpO1xuICAgICAgICBpZiAoc3RhdHVzKSB7XG4gICAgICAgICAgICB1cGdyYWRlc1t1cGdyYWRlTnVtYmVyXS5jbGFzc0xpc3QuYWRkKCd1cGdyYWRlX2FjdGl2ZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXBncmFkZXNbdXBncmFkZU51bWJlcl0uY2xhc3NMaXN0LnJlbW92ZSgndXBncmFkZV9hY3RpdmUnKTtcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIHJlbmRlclVwZ3JhZGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB1cGdyYWRlc0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3JpZ2h0UGFuZWwnKVswXTtcbiAgICAgICAgdmFyIHVwZ3JhZGVUZW1wbGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3VwZ3JhZGUnKVswXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1vZGVsLnVwZ3JhZGVzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9IHVwZ3JhZGVUZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICB0ZW1wbGF0ZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgIHRlbXBsYXRlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3VwZ3JhZGVfX3RpdGxlJylbMF0uaW5uZXJIVE1MID0gbW9kZWwudXBncmFkZXNbaV0ubmFtZTtcbiAgICAgICAgICAgIHRlbXBsYXRlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3VwZ3JhZGVfX2Nvc3QnKVswXS5pbm5lckhUTUwgPSBtb2RlbC51cGdyYWRlc1tpXS5jb3N0O1xuICAgICAgICAgICAgdGVtcGxhdGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndXBncmFkZV9fcHJvZHVjZScpWzBdLmlubmVySFRNTCA9IG1vZGVsLnVwZ3JhZGVzW2ldLnByb2R1Y2U7XG4gICAgICAgICAgICB0ZW1wbGF0ZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd1cGdyYWRlX19pbWcnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID1cbiAgICAgICAgICAgICAgICAndXJsKC4vaW1nLycgKyBtb2RlbC51cGdyYWRlc1tpXS5uYW1lLnRvTG93ZXJDYXNlKCkgKyAnLnN2Zykgbm8tcmVwZWF0IGNlbnRlciAvIDEwMCUnO1xuICAgICAgICAgICAgdGVtcGxhdGUuc2V0QXR0cmlidXRlKCdudW0nLCBpKTtcbiAgICAgICAgICAgIHRlbXBsYXRlLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbW9kZWwuc2V0VXBncmFkZSh0aGlzLmdldEF0dHJpYnV0ZSgnbnVtJykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1cGdyYWRlc0NvbnRhaW5lci5hcHBlbmRDaGlsZCh0ZW1wbGF0ZSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHVwZ3JhZGVUZW1wbGF0ZS5yZW1vdmUoKTtcblxuICAgIH0sXG5cbiAgICB1cGRhdGVVcGdyYWRlOiBmdW5jdGlvbiAodXBncmFkZU51bWJlcikge1xuXG4gICAgICAgIHZhciB1cGdyYWRlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3VwZ3JhZGUnKTtcbiAgICAgICAgdXBncmFkZXNbdXBncmFkZU51bWJlcl0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndXBncmFkZV9fY29zdCcpWzBdLmlubmVySFRNTCA9IG1vZGVsLnVwZ3JhZGVzW3VwZ3JhZGVOdW1iZXJdLmNvc3Q7XG4gICAgICAgIHVwZ3JhZGVzW3VwZ3JhZGVOdW1iZXJdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3VwZ3JhZGVfX2Ftb3VudCcpWzBdLmlubmVySFRNTCA9ICsrbW9kZWwudXBncmFkZXNbdXBncmFkZU51bWJlcl0uYW1vdW50O1xuXG4gICAgfSxcblxuICAgIGluaXRSb2NrZXRzOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIGludGVydmFsID0gKDEgLyBtb2RlbC5wZXJTZWNvbmQpICogNTAwMDtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgaWYgKGludGVydmFsICE9PSBJbmZpbml0eSkge1xuICAgICAgICAgICAgICAgIHZpZXcubGF1bmNoUm9ja2V0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZpZXcuaW5pdFJvY2tldHMoKTtcblxuICAgICAgICB9LCBpbnRlcnZhbCk7XG5cblxuICAgIH0sXG5cbiAgICBsYXVuY2hSb2NrZXQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgc2NyZWVuID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2NyZWVuJylbMF07XG5cbiAgICAgICAgdmFyIHJvY2tldCA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgICAgICAgc2l6ZTogbW9kZWwuZ2V0UmFuZG9tSW50ZWdlcigxLCAzKSxcbiAgICAgICAgICAgIHR5cGU6IG1vZGVsLmdldFJhbmRvbUludGVnZXIoMSwgMiksXG4gICAgICAgICAgICB4OiBtb2RlbC5nZXRSYW5kb21JbnRlZ2VyKDAsIDk1KVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciByb2NrZXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHJvY2tldEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgncm9ja2V0JywgJ3JvY2tldF9zaXplXycgKyByb2NrZXQuc2l6ZSwgJ3JvY2tldF90eXBlXycgKyByb2NrZXQudHlwZSk7XG4gICAgICAgIHJvY2tldEVsZW1lbnQuc3R5bGUubGVmdCA9IHJvY2tldC54ICsgJyUnO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJvY2tldEVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgIH0sIDEwMDAwKTtcblxuICAgICAgICBzY3JlZW4uYXBwZW5kQ2hpbGQocm9ja2V0RWxlbWVudCk7XG4gICAgfVxuXG59O1xuXG4vL0NPTlRST0xMRVJcblxuY29uc3QgY29udHJvbGxlciA9IHtcblxuICAgIGJ1dHRvbkNsaWNrOiBmdW5jdGlvbiAoYnV0dG9uU3RhdGUpIHtcblxuICAgICAgICBpZiAoYnV0dG9uU3RhdGUpIHtcbiAgICAgICAgICAgIG1vZGVsLmFkZFNjb3JlKDEpO1xuICAgICAgICAgICAgaWYgKG1vZGVsLnNjb3JlICUgNSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgdmlldy5sYXVuY2hSb2NrZXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZpZXcuYnV0dG9uQ2xpY2soYnV0dG9uU3RhdGUpO1xuXG4gICAgICAgIG1vZGVsLmNoZWNrVXBncmFkZXMoKTtcblxuICAgIH1cblxufTtcblxuLy8gSU5JVCBGVU5DVElPTlxuXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGFwcCA9IHtcblxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLm1haW4oKTtcbiAgICAgICAgICAgIHRoaXMuZXZlbnQoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBtYWluOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBtb2RlbC5pbml0TG9vcCgpO1xuICAgICAgICAgICAgbW9kZWwuZ2V0VXBncmFkZXMoKTtcbiAgICAgICAgICAgIHZpZXcuaW5pdFJvY2tldHMoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBldmVudDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnV0dG9uJykub25tb3VzZWRvd24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlci5idXR0b25DbGljayh0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1dHRvbicpLm9ubW91c2V1cCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyLmJ1dHRvbkNsaWNrKGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIGFwcC5pbml0KCk7XG5cbn07XG4iXSwiZmlsZSI6ImluZGV4LmpzIn0=
