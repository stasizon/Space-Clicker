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
                        'url(./img/' + model.upgrades[i].name.toLowerCase() + '.svg) no-repeat center / 100%';
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcbi8vIFZJRVdcblxudmFyIHZpZXcgPSB7XG5cbiAgICBidXR0b25DbGljazogZnVuY3Rpb24oc3RhdGUpIHtcblxuICAgICAgICBpZiAoc3RhdGUpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidXR0b24nKS5jbGFzc0xpc3QuYWRkKCdidXR0b25fYWN0aXZlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnV0dG9uJykuY2xhc3NMaXN0LnJlbW92ZSgnYnV0dG9uX2FjdGl2ZScpO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgc2hvd1Njb3JlOiBmdW5jdGlvbihuKSB7XG4gICAgICAgIHZhciBzY29yZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb3VudGVyU2NvcmUnKTtcbiAgICAgICAgc2NvcmUuaW5uZXJIVE1MID0gbjtcbiAgICB9LFxuXG4gICAgc2hvd1BlclNlY29uZDogZnVuY3Rpb24obikge1xuICAgICAgICB2YXIgcGVyU2Vjb25kID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvdW50ZXJQZXJTZWNvbmQnKTtcbiAgICAgICAgcGVyU2Vjb25kLmlubmVySFRNTCA9IG47XG4gICAgfSxcblxuICAgIGNoYW5nZVVwZ3JhZGVTdGF0dXM6IGZ1bmN0aW9uKHVwZ3JhZGVOdW1iZXIsIHN0YXR1cykge1xuICAgICAgICB2YXIgdXBncmFkZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd1cGdyYWRlJyk7XG4gICAgICAgIGlmIChzdGF0dXMpIHtcbiAgICAgICAgICAgIHVwZ3JhZGVzW3VwZ3JhZGVOdW1iZXJdLmNsYXNzTGlzdC5hZGQoJ3VwZ3JhZGVfYWN0aXZlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1cGdyYWRlc1t1cGdyYWRlTnVtYmVyXS5jbGFzc0xpc3QucmVtb3ZlKCd1cGdyYWRlX2FjdGl2ZScpO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgcmVuZGVyVXBncmFkZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdXBncmFkZXNDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdyaWdodFBhbmVsJylbMF07XG4gICAgICAgIHZhciB1cGdyYWRlVGVtcGxhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd1cGdyYWRlJylbMF07XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtb2RlbC51cGdyYWRlcy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICB2YXIgdGVtcGxhdGUgPSB1cGdyYWRlVGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3VwZ3JhZGVfX3RpdGxlJylbMF0uaW5uZXJIVE1MID0gbW9kZWwudXBncmFkZXNbaV0ubmFtZTtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd1cGdyYWRlX19jb3N0JylbMF0uaW5uZXJIVE1MID0gbW9kZWwudXBncmFkZXNbaV0uY29zdDtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd1cGdyYWRlX19wcm9kdWNlJylbMF0uaW5uZXJIVE1MID0gbW9kZWwudXBncmFkZXNbaV0ucHJvZHVjZTtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd1cGdyYWRlX19pbWcnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID1cbiAgICAgICAgICAgICAgICAgICAgICAgICd1cmwoLi9pbWcvJyArIG1vZGVsLnVwZ3JhZGVzW2ldLm5hbWUudG9Mb3dlckNhc2UoKSArICcuc3ZnKSBuby1yZXBlYXQgY2VudGVyIC8gMTAwJSc7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGUuc2V0QXR0cmlidXRlKCdudW0nLCBpKTtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZS5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsLnNldFVwZ3JhZGUodGhpcy5nZXRBdHRyaWJ1dGUoJ251bScpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHVwZ3JhZGVzQ29udGFpbmVyLmFwcGVuZENoaWxkKHRlbXBsYXRlKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgdXBncmFkZVRlbXBsYXRlLnJlbW92ZSgpO1xuXG4gICAgfSxcblxuICAgIHVwZGF0ZVVwZ3JhZGU6IGZ1bmN0aW9uKHVwZ3JhZGVOdW1iZXIpIHtcblxuICAgICAgICB2YXIgdXBncmFkZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd1cGdyYWRlJyk7XG4gICAgICAgIHVwZ3JhZGVzW3VwZ3JhZGVOdW1iZXJdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3VwZ3JhZGVfX2Nvc3QnKVswXS5pbm5lckhUTUwgPSBtb2RlbC51cGdyYWRlc1t1cGdyYWRlTnVtYmVyXS5jb3N0O1xuICAgICAgICB1cGdyYWRlc1t1cGdyYWRlTnVtYmVyXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd1cGdyYWRlX19hbW91bnQnKVswXS5pbm5lckhUTUwgPSArK21vZGVsLnVwZ3JhZGVzW3VwZ3JhZGVOdW1iZXJdLmFtb3VudDtcblxuICAgIH0sXG5cbiAgICBpbml0Um9ja2V0czogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIGludGVydmFsID0gKDEgLyBtb2RlbC5wZXJTZWNvbmQpICogNTAwMDtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgaWYgKGludGVydmFsICE9PSBJbmZpbml0eSkge1xuICAgICAgICAgICAgICAgIHZpZXcubGF1bmNoUm9ja2V0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZpZXcuaW5pdFJvY2tldHMoKTtcblxuICAgICAgICB9LCBpbnRlcnZhbCk7XG5cblxuICAgIH0sXG5cbiAgICBsYXVuY2hSb2NrZXQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBzY3JlZW4gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzY3JlZW4nKVswXTtcblxuICAgICAgICB2YXIgcm9ja2V0ID0ge1xuICAgICAgICAgICAgZWxlbWVudDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAgICAgICBzaXplOiBtb2RlbC5nZXRSYW5kb21JbnRlZ2VyKDEsIDMpLFxuICAgICAgICAgICAgdHlwZTogbW9kZWwuZ2V0UmFuZG9tSW50ZWdlcigxLCAyKSxcbiAgICAgICAgICAgIHg6IG1vZGVsLmdldFJhbmRvbUludGVnZXIoMCwgOTUpXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHJvY2tldEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHJvY2tldEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgncm9ja2V0JywgJ3JvY2tldF9zaXplXycgKyByb2NrZXQuc2l6ZSwgJ3JvY2tldF90eXBlXycgKyByb2NrZXQudHlwZSk7XG4gICAgICAgICAgICByb2NrZXRFbGVtZW50LnN0eWxlLmxlZnQgPSByb2NrZXQueCArICclJztcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJvY2tldEVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgICAgICB9LCAxMDAwMCk7XG5cbiAgICAgICAgc2NyZWVuLmFwcGVuZENoaWxkKHJvY2tldEVsZW1lbnQpO1xuICAgIH1cblxufVxuXG4vLyBNT0RFTFxuXG52YXIgbW9kZWwgPSB7XG5cbiAgICBzY29yZTogMCxcbiAgICBwZXJTZWNvbmQ6IDAsXG4gICAgdXBncmFkZXM6IFtdLFxuICAgIGlzVXBncmFkZWQ6IGZhbHNlLFxuXG4gICAgYWRkU2NvcmU6IGZ1bmN0aW9uKHNjb3JlKSB7XG4gICAgICAgIHRoaXMuc2NvcmUgPSB0aGlzLnNjb3JlICsgc2NvcmU7XG5cbiAgICAgICAgdmlldy5zaG93U2NvcmUoTWF0aC5mbG9vcih0aGlzLnNjb3JlKSk7XG4gICAgfSxcblxuICAgIGNoZWNrVXBncmFkZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1vZGVsLnVwZ3JhZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zY29yZSA+PSBtb2RlbC51cGdyYWRlc1tpXS5jb3N0KSB7XG4gICAgICAgICAgICAgICAgbW9kZWwudXBncmFkZXNbaV0uc3RhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHZpZXcuY2hhbmdlVXBncmFkZVN0YXR1cyhpLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbW9kZWwudXBncmFkZXNbaV0uc3RhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB2aWV3LmNoYW5nZVVwZ3JhZGVTdGF0dXMoaSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHNldFVwZ3JhZGU6IGZ1bmN0aW9uKHVwZ3JhZGVOdW1iZXIpIHtcbiAgICAgICAgaWYgKG1vZGVsLnVwZ3JhZGVzW3VwZ3JhZGVOdW1iZXJdLmNvc3QgPD0gbW9kZWwuc2NvcmUpIHtcbiAgICAgICAgICAgIHRoaXMucGVyU2Vjb25kID0gdGhpcy5wZXJTZWNvbmQgKyBtb2RlbC51cGdyYWRlc1t1cGdyYWRlTnVtYmVyXS5wcm9kdWNlO1xuXG4gICAgICAgICAgICBtb2RlbC5zY29yZSAtPSBtb2RlbC51cGdyYWRlc1t1cGdyYWRlTnVtYmVyXS5jb3N0O1xuICAgICAgICAgICAgbW9kZWwudXBncmFkZXNbdXBncmFkZU51bWJlcl0uY29zdCA9IE1hdGguZmxvb3IobW9kZWwudXBncmFkZXNbdXBncmFkZU51bWJlcl0uY29zdCAqIDEuMik7XG5cbiAgICAgICAgICAgIHZpZXcuc2hvd1BlclNlY29uZChtb2RlbC5wZXJTZWNvbmQpO1xuICAgICAgICAgICAgdmlldy51cGRhdGVVcGdyYWRlKHVwZ3JhZGVOdW1iZXIpO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgaW5pdExvb3A6IGZ1bmN0aW9uKCkge1xuICAgICAgICBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG1vZGVsLmFkZFNjb3JlKG1vZGVsLnBlclNlY29uZCAvIDQpO1xuICAgICAgICAgICAgbW9kZWwuY2hlY2tVcGdyYWRlcygpO1xuXG4gICAgICAgIH0sIDI1MCk7XG4gICAgfSxcblxuICAgIGdldFVwZ3JhZGVzOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKCdHRVQnLCAnc2VydmVyL3VwZ3JhZGVzLmpzb24nLCB0cnVlKTtcbiAgICAgICAgeGhyLnNlbmQoKTtcblxuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgIT0gNCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyAhPSAyMDApIHtcbiAgICAgICAgICAgICAgICBhbGVydCh4aHIuc3RhdHVzICsgJzogJyArIHhoci5zdGF0dXNUZXh0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbW9kZWwudXBncmFkZXMgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIHZpZXcucmVuZGVyVXBncmFkZXMoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgZ2V0UmFuZG9tSW50ZWdlcjogZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQobWluICsgTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pKTtcbiAgICB9XG5cbn1cblxuLy9DT05UUk9MTEVSXG5cbnZhciBjb250cm9sbGVyID0ge1xuXG4gICAgYnV0dG9uQ2xpY2s6IGZ1bmN0aW9uKGJ1dHRvblN0YXRlKSB7XG5cbiAgICAgICAgaWYgKGJ1dHRvblN0YXRlKSB7XG4gICAgICAgICAgICBtb2RlbC5hZGRTY29yZSgxKTtcbiAgICAgICAgICAgIGlmIChtb2RlbC5zY29yZSU1ID09IDAgKSB7XG4gICAgICAgICAgICAgICAgdmlldy5sYXVuY2hSb2NrZXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZpZXcuYnV0dG9uQ2xpY2soYnV0dG9uU3RhdGUpO1xuXG4gICAgICAgIG1vZGVsLmNoZWNrVXBncmFkZXMoKTtcblxuICAgIH1cblxufVxuXG4vLyBJTklUIEZVTkNUSU9OXG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciBhcHAgPSB7XG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLm1haW4oKTtcbiAgICAgICAgICAgIHRoaXMuZXZlbnQoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBtYWluOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG1vZGVsLmluaXRMb29wKCk7XG4gICAgICAgICAgICBtb2RlbC5nZXRVcGdyYWRlcygpO1xuICAgICAgICAgICAgdmlldy5pbml0Um9ja2V0cygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGV2ZW50OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1dHRvbicpLm9ubW91c2Vkb3duID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlci5idXR0b25DbGljayh0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1dHRvbicpLm9ubW91c2V1cCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIuYnV0dG9uQ2xpY2soZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgYXBwLmluaXQoKTtcblxufVxuIl0sImZpbGUiOiJpbmRleC5qcyJ9
