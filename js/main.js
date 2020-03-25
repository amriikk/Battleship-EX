const model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships: [
        {locations: [0,0,0], hits: ["","",""]},
        {locations: [0,0,0], hits: ["","",""]},
        {locations: [0,0,0], hits: ["","",""]}
    ],

    fire: function(guess){
        for (let i=0; i < this.numShips; i++){
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);

            if (ship.hits[index] === "hit") {
                view.displayMessage("You have already hit this location before!");
                return true;
            }   else if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");

                if (this.isSunk(ship)){
                    view.displayMessage("You sank my battleship!");
                    this.shipsSunk++
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed!");
        return false;
    },

    isSunk: function(ship){
        for (let i=0; i < this.shipLength; i++){
            if (ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;
    },

    generateShipLocations: function(){
        let locations;

        for (let i=0; i < this.numShips; i++){
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
        console.log("Ships array: ");
        console.log(this.ships);
    },

    generateShip: function(){
        let direction = Math.floor(Math.random() * 2);
        let row, col;

        if (direction === 1){
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
        } else {
            col = Math.floor(Math.random() * this.boardSize);
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
        }

        let newShipLocations = [];
        for (let i=0; i < this.shipLength; i++){
            if (direction === 1){
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },

    collision: function(locations){
        for (let i=0; i < this.numShips; i++){
            let ship = this.ships[i];
            for (let j=0; j < locations.length; j++){
                if (ship.locations.indexOf(locations[j]) >= 0){
                    return true;
                }
            }
        }
        return false;
    },
};
const view = {
    displayMessage: function(msg){
        let messageBox = document.getElementById("messageBox");
        messageBox.innerHTML = msg;
    },

    displayHit: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },

    displayMiss: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};
const controller = {
    guesses: 0,

    processGuess: function(guess){
        let location = parseGuess(guess);
        if (location){
            this.guesses++;
            let hit = model.fire(location);
            if (hit && model.shipSunk === model.numShips){
                view.displayMessage("You sank all the battleships in " + this.guesses + " guesses!");
            }
        }
    }
};

function parseGuess(guess){
    let alphabet = ["A","B","C","D","E","F","G"];

    if (guess === null || guess.length !== 2){
        alert("Please enter a valid guess. (A-G & #1-7)");
    } else {
        let firstChar = guess.charAt(0);
        let row = alphabet.indexOf(firstChar);
        let column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)){
            alert("Not a valid input");
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){
            alert("Input is not located on this board!");
        } else {
            return row + column;
        }
    }
    return null;
};

function handleFireButton(){
    let guessBox = document.getElementById("guessBox");
    let guess = guessBox.value.toUpperCase();

    controller.processGuess(guess);

    guessBox.value = "";
};

function handlekeyPress(e){
    let fireButton = document.getElementById("fireButton");

    e=e || window.event;

    if (e.keyCode === 13){
        fireButton.click();
        return false;
    }
};

function init() {
    let fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;

    let guessBox = document.getElementById("guessBox");
    guessBox.onkeypress = handlekeyPress;
    
    model.generateShipLocations();
};

window.onload = init;
