// Define the game board module the board is a 2-D array
const gameBoard = (() => {
    // Private variables
    const board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    // Public methods
    const getBoard = () => board;

    const setCell = (row, col, value) => {
        if (row >= 0 && row < 3 && col >= 0 && col < 3) {
            // check if selected cell is empty
            if (board[row][col] === null) {
                board[row][col] = value; // Cell was empty, and the value was set
                return true;
            } else {
                return false; // Cell is already occupied
            }
        }
        return false; // Invalid row or column
    };

    const clearBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = null;
            }
        }
    };

    // Public API
    return {
        getBoard,
        setCell,
        clearBoard
    };
})();  //immediately invoked function expression

// Example usage
// GameBoard.setCell(0, 0, 'X'); // Set the top-left cell to 'X'
// const currentBoard = GameBoard.getBoard(); // Get the current game board
// GameBoard.clearBoard(); // Clear the game board

// Function to render the game board on the webpage
function renderGameBoard() {
    const gameBoardContainer = document.getElementById('game-board');
    const boardData = gameBoard.getBoard(); // Get the game board data from the module

    // Clear any previous content in the container
    gameBoardContainer.innerHTML = '';

    // Loop through the game board data and create cells
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.textContent = boardData[row][col]; // Use data from the GameBoard module
            gameBoardContainer.appendChild(cell);

            // Add event listener for making moves on cell click
            cell.addEventListener('click', () => {
                // check if the cell is empty before change
                if (gameBoard.setCell(row, col, currentPlayer.symbol)) {
                    // update the gameboard display
                    renderGameBoard();

                    // check if a player has won or if draw using functs defined below
                    if (checkWinner()) {
                        // Delay the alert to allow time for rendering
                        setTimeout(() => {
                            // Update win counters
                            updateWins();
                            alert(`${currentPlayer.name} Won!`);
                            resetGame();
                        }, 0)
                    } else if (checkDraw()) {
                        // Delay the alert to allow time for rendering
                        setTimeout(() => {
                            // Update tie counter
                            updateDraws();
                            alert(`it\'s a Draw!`)
                            resetGame();
                        }, 0)
                    } else {
                        // Switch to the other player
                        switchPlayer();
                    }
                }
            })
        };
    }
};

// Player factory function
function Player(name, symbol) {
    const makeMove = (row, col) => {
        return gameBoard.setCell(row, col, symbol);
    };

    return {
        name,
        symbol,
        makeMove
    };
};

// Variables to keep track of wins and draws
let xWins = 0;
let draws = 0;
let oWins = 0;

// Create players
const playerX = Player('Player X', 'X');
const playerO = Player('Player O', 'O');

// Test factory function attributes
console.log(playerX.symbol);
console.log(playerO.symbol);

// Test makeMove method from factory funct
// playerO.makeMove(2,0);

// Function to switch players
let currentPlayer = playerX;
function switchPlayer() {
    // currentPlayer = (currentPlayer === playerX) ? playerO : playerX;
    if (currentPlayer === playerX) {
        currentPlayer = playerO;
    } else {
        currentPlayer = playerX;
    };
    return currentPlayer;
};

// Function to check if the game is won
function checkWinner() {
    // retrieve the current board data from the module
    let board = gameBoard.getBoard();

    // check to see if rows match (3 in row) - left right
    for (let i = 0; i < 3; i++) {
        if (board[i][0] !== null && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
            return true;
        }
    };

    // check to see if columns match (3 in row) - top bottom
    for (let j = 0; j < 3; j++) {
        if (board[0][j] !== null && board[0][j] === board[1][j] && board[1][j] === board[2][j]) {
            return true;
        }
    };

    // check for diagnal matches - left diagnal
    if (board[0][0] !== null && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        return true;
    };

    // check for diagnal matches - right diagnal
    if (board[0][2] !== null && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        return true;
    };

    // if no matches/winner return false
    return false
};

// Function to check if the game is a draw - all rows and columns filled
function checkDraw() {
    // get current board data
    let board = gameBoard.getBoard();
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === null) {
                // If there is an empty cell, the game is not a draw/filled
                return false;
            }
        }
    }
    // All cells are filled, and no winner, so it's a draw
    return true;
};

// function to update win counters
function updateWins() {
    if (currentPlayer === playerX) {
        xWins++;
        document.getElementById('x-wins').textContent = xWins;
    } else if (currentPlayer === playerO) {
        oWins++;
        document.getElementById('o-wins').textContent = oWins;
    }
};

// function to update tie counter
function updateDraws() {
    draws++;
    document.getElementById('draws').textContent = draws;
}

// Function to reset the game
function resetGame() {
    gameBoard.clearBoard();
    currentPlayer = playerX;
    renderGameBoard();
};

// function to reset the scores and game board
function resetScoreandGame() {
    resetGame();

    // Reset win and tie counters
    xWins = 0;
    oWins = 0;
    draws = 0;

    // Update the corresponding DOM elements
    document.getElementById('x-wins').textContent = xWins;
    document.getElementById('draws').textContent = draws;
    document.getElementById('o-wins').textContent = oWins;
}

let reset = document.getElementById('reset')
reset.addEventListener('click', resetScoreandGame);

// initialize the gameboard 
renderGameBoard();


// Example usage to set a cell to 'X'
// gameBoard.setCell(0, 0, 'X');
// renderGameBoard(); // Update the displayed game board
// console.log(gameBoard.getBoard());

// gameBoard.setCell(1, 1, 'X');
// renderGameBoard();
// console.log(gameBoard.getBoard());

// gameBoard.setCell(2, 2, 'X');
// renderGameBoard();
// console.log(gameBoard.getBoard());


// Task
// create a reset button that sets the scores and ties back to 0 when preseed
// Add player name input (based on how many players) - changes player to custom name
// Add cpu input - randomize cpu picks on board based on empty spaces and users value