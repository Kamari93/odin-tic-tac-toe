console.log("Keep Going 🍊 🌊...")

// variables to assign players and attributes (objects from player factory fn)
let playerX;
let playerO;

// variable to keep track of current player (observe moves and when to use CPU fn)
let currentPlayer;

// Variables to keep track of wins and draws
let xWins = 0;
let draws = 0;
let oWins = 0;

// add flag to keep track of board disabled state
let isBoardDisabled = false;

// add hover symbol
// let hoverSymbol;

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

            // Dynamically set the class based on the content for symbol styling
            if (boardData[row][col] === 'X' || boardData[row][col] === 'O') {
                cell.classList.add(boardData[row][col]);
            }

            // Add event listeners for hover effect
            cell.addEventListener('mouseover', () => {
                handleCellHover(row, col);
            });

            cell.addEventListener('mouseout', () => {
                clearHoverEffect();
            });

            gameBoardContainer.appendChild(cell);

            // Add event listener for making moves on cell click
            cell.addEventListener('click', () => {
                handlePlayerMove(row, col);
            });
        };
    }
};

// Function to handle hover effect on cells
function handleCellHover(row, col) {
    // select the specific cell based on the row and col indices in the grid. The formula (row * 3 + col + 1) is used to calculate the cell's position in a linear order within the grid. + 1: row * 3: This calculates the starting index of the row in a linear order (assuming a 3x3 grid). col: This represents the column index within the row. It adds 1 because the :nth-child selector uses a 1-based index (unlike JavaScript arrays which are 0-based).
    const cell = document.querySelector(`.grid-container .cell:nth-child(${row * 3 + col + 1})`);

    if (cell.textContent === '' && currentPlayer && !isBoardDisabled) {
        // Only apply hover effect to empty cells
        cell.classList.add('hover-effect');
        cell.textContent = currentPlayer.symbol;

        let hoverColor = document.querySelector('.hover-effect');
        if (currentPlayer.symbol === 'X') {
            hoverColor.style.color = 'var(--hoverX)';
        } else {
            hoverColor.style.color = 'var(--hoverO';
        }
    }
}

// Function to clear hover effect
function clearHoverEffect() {
    // select all cells that do not have the class 'X' or 'O', meaning it selects all empty cells.
    const emptyCells = document.querySelectorAll('.grid-container .cell:not(.X):not(.O)');

    // iterate over the selected empty cells and remove the hover-effect class, effectively clearing the hover effect.
    emptyCells.forEach(cell => {
        cell.classList.remove('hover-effect');
        cell.textContent = '';
    });
}

// Player factory function
function Player(name, symbol, isCPU = false) {
    const makeMove = (row, col) => {
        return gameBoard.setCell(row, col, symbol);
    };

    return {
        name,
        symbol,
        isCPU,
        makeMove
    };
};

// Function to switch players
function switchPlayer() {
    // currentPlayer = (currentPlayer === playerX) ? playerO : playerX;
    // console.log(currentPlayer)
    if (currentPlayer === playerX) {
        currentPlayer = playerO;
    } else {
        currentPlayer = playerX;
    };
    // Update the current player display
    updateCurrentPlayer();

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
    // Update the current player display
    updateCurrentPlayer();
    // check if current player is cpu and if so make them auto move each round
    checkCPUMove();
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



// Display the initial setup modal when the page loads
document.getElementById('setup-modal').style.display = 'block';

// Function to handle the initial setup using alerts
function handlePlayerSetup() {
    const numPlayersInput = document.getElementById('num-players').value;
    const player1SetupModal = document.getElementById('player1-setup-modal');
    const player2SetupModal = document.getElementById('player2-setup-modal');
    const player2SymbolDisplay = document.getElementById('player2-symbol-display');

    if (numPlayersInput == 1) {
        // If 1 player is selected, show the Player setup modal for Player 1
        player1SetupModal.style.display = 'block';
        player2SetupModal.style.display = 'none'; // Hide Player 2's modal

        // Hide the initial setup modal
        document.getElementById('setup-modal').style.display = 'none';
    } else if (numPlayersInput == 2) {
        // If 2 players are selected, show the Player 1's setup modal
        player1SetupModal.style.display = 'none';

        // Show Player 2's modal
        player2SetupModal.style.display = 'block';
        const player1Symbol = document.getElementById('player1-symbol').value;
        player2SymbolDisplay.textContent = (player1Symbol === 'X') ? 'O' : 'X';

        // Hide the initial setup modal
        document.getElementById('setup-modal').style.display = 'none';
    }
}

// Function to update Player 2's symbol in the Player 2 setup modal
function updatePlayer2Symbol() {
    const player1Symbol = document.getElementById('player1-symbol-2').value;
    document.getElementById('player2-symbol-display').textContent = (player1Symbol === 'X') ? 'O' : 'X';
}

// Function to  the game
function startGame() {

    const numPlayersInput = document.getElementById('num-players').value;
    const player1Symbol = document.getElementById('player1-symbol').value;
    const player1SymbolII = document.getElementById('player1-symbol-2').value;
    const player1NameII = document.getElementById("player1-name-2").value;
    const player1Name = document.getElementById('player1-name').value;
    const player2Symbol = document.getElementById('player2-symbol-display').textContent;
    const player2Name = document.getElementById('player2-name').value;

    const xTitleScore = document.getElementById('x-title');
    const oTitleScore = document.getElementById('o-title');


    // use loose equality operator to check numPlayersInput since val is str-num
    if (numPlayersInput == 1) {
        // Determine which player chose 'X' and assign accordingly 
        playerX = (player1Symbol === 'X') ? Player(player1Name, 'X') : Player('CPU', 'X', isCPU = true);

        // Determine which player chose 'O' and assign accordingly
        playerO = (player1Symbol === 'O') ? Player(player1Name, 'O') : Player('CPU', 'O', isCPU = true);

    } else if (numPlayersInput == 2) {
        // Determine which player chose 'X' and assign accordingly
        playerX = (player1SymbolII === 'X') ? Player(player1NameII, 'X') : Player(player2Name, 'X');
        // Determine which player chose 'O' and assign accordingly
        playerO = (player1SymbolII === 'O') ? Player(player1NameII, 'O') : Player(player2Name, 'O');
    }

    // Dynamically set the score titles to the players' inputted names w/out alt format using innerHTML
    xTitleScore.innerHTML = `${playerX.name}<span id="x-wins">${xWins}</span>`;
    oTitleScore.innerHTML = `${playerO.name} <span id="o-wins">${oWins}</span>`;

    // Set current player to player with X val as X always goes first
    currentPlayer = playerX;

    // hoverSymbol = currentPlayer.symbol;

    // Initialize the game board (clear previous state)
    gameBoard.clearBoard();

    // Render the initial state of the game board
    renderGameBoard();

    // Hide the setup modals
    document.getElementById('setup-modal').style.display = 'none';
    document.getElementById('player1-setup-modal').style.display = 'none';
    document.getElementById('player2-setup-modal').style.display = 'none';

    // console.log(numPlayersInput)

    // If there's only one player playing and it's a CPU, make a move after a short delay
    checkCPUMove();

    updateCurrentPlayer()
}

// If there's only one player playing and it's a CPU, make a move after a short delay
function checkCPUMove() {
    if (currentPlayer.isCPU) {
        setTimeout(makeCPUMove, 500);
    }
}


// Function to handle player moves
function handlePlayerMove(row, col) {
    if (isBoardDisabled) {
        // Board is disabled, do nothing...no clicking allowed
        return;
    };

    if (gameBoard.setCell(row, col, currentPlayer.symbol)) {
        // update the gameboard display
        renderGameBoard();

        // check if a player has won or if draw using functs defined below
        if (checkWinner()) {
            // Delay the alert to allow time for rendering
            setTimeout(() => {
                // Update win counters
                updateWins();
                // alert(`${currentPlayer.name} Won!`);
                showResult(`${currentPlayer.name} Won!`, currentPlayer.symbol);
                // resetGame();
            }, 500);
        } else if (checkDraw()) {
            // Delay the alert to allow time for rendering
            setTimeout(() => {
                // Update tie counter
                updateDraws();
                // alert(`It's a Draw!`);
                showResult("It's a Draw!", 'draw');
                // resetGame();
            }, 500);
        } else {
            // Switch to the other player
            switchPlayer();
            // If the next player is a CPU, make a move
            if (currentPlayer.isCPU) {
                // makeCPUMove();
                setTimeout(makeCPUMove, 500)
            }
        }
    }
}


// Function to make a move for the CPU player
function makeCPUMove() {
    // Check if there's a winning move and make it
    if (makeWinningMove()) {
        return;
    }

    // If there's no winning move, make a random move
    makeRandomMove();

    // Check for a draw after the random move
    if (checkDraw()) {
        setTimeout(() => {
            updateDraws();
            showResult("It's a Draw!", 'draw');
        }, 500);
    } else {
        // Switch to the other player
        switchPlayer();
    }
}

// CPUMove Helper Function to make a winning move if possible
function makeWinningMove() {
    let board = gameBoard.getBoard();

    // Check each cell for a potential winning move
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === null) {
                // Try making the move
                board[row][col] = currentPlayer.symbol;

                // Check if the CPU wins with the above move on the board
                if (checkWinner()) {
                    // Update the game board display
                    renderGameBoard();
                    // Delay to show the result
                    setTimeout(() => {
                        updateWins();
                        showResult(`${currentPlayer.name} Won!`, currentPlayer.symbol);
                        // Switch to the other player after a delay
                        setTimeout(switchPlayer, 500);
                    }, 500);
                    return true;
                }

                // Undo the move if it's not a win and move on to make random move fn
                board[row][col] = null;
            }
        }
    }

    return false; // No winning move found
}

// CPUMove Helper Function to make a random move
function makeRandomMove() {
    let row, col;
    do {
        row = Math.floor(Math.random() * 3);
        col = Math.floor(Math.random() * 3);
    } while (!gameBoard.setCell(row, col, currentPlayer.symbol));

    // Update the game board display
    renderGameBoard();
}

// Function to display the result ribbon
function showResult(message, symbol) {
    const resultDisplay = document.getElementById('result-display');
    const resultMessage = document.getElementById('result-message');
    const resultButton = document.getElementById('close-button');

    // Disable the board
    isBoardDisabled = true;

    // Set the styles based on the winning symbol
    if (symbol === 'X') {
        resultMessage.style.setProperty('color', 'white');
        resultDisplay.style.setProperty('color', 'white');
        resultDisplay.style.setProperty('background-color', 'var(--third-color)');
        resultButton.style.setProperty('border-color', 'white');
        resultButton.style.setProperty('color', 'white');
        resultButton.style.setProperty('background-color', 'var(--third-color)');
    } else if (symbol === 'O') {
        resultMessage.style.setProperty('color', 'white');
        resultDisplay.style.setProperty('color', 'white');
        resultDisplay.style.setProperty('background-color', 'var(--fifth-color)');
        resultButton.style.setProperty('border-color', 'white');
        resultButton.style.setProperty('color', 'white');
        resultButton.style.setProperty('background-color', 'var(--fifth-color)');
    } else if (symbol === 'draw') {
        resultMessage.style.setProperty('color', 'var(--secondary-color)');
        resultDisplay.style.setProperty('color', 'var(--secondary-color)');
        resultDisplay.style.setProperty('background-color', 'var(--primary-color)');
        resultButton.style.setProperty('border-color', 'var(--secondary-color)');
        resultButton.style.setProperty('background-color', 'white');
        resultButton.style.setProperty('color', 'var(--secondary-color)');
    }

    resultMessage.textContent = message;
    resultDisplay.style.display = 'block';
    // console.log('Result Displayed:', message);
}

// Function to close the result display
function closeResultDisplay() {
    const resultDisplay = document.getElementById('result-display');
    resultDisplay.style.display = 'none';

    // Enable the board
    isBoardDisabled = false;
    resetGame();
}


// Function to update the display of the current player's symbol in the header
// function updateCurrentPlayer() {
//     const currentPlayerDisplay = document.getElementById('current-player');
//     currentPlayerDisplay.textContent = `${currentPlayer.name}'s Turn: ${currentPlayer.symbol}`;
// }

function updateCurrentPlayer() {
    const currentPlayerDisplay = document.getElementById('current-player');
    const playerNameSpan = document.getElementById('player-name');
    const playerSymbolSpan = document.getElementById('player-symbol');

    playerNameSpan.textContent = currentPlayer.name;
    playerSymbolSpan.textContent = `${currentPlayer.symbol} Move`;

    // Set text color based on the symbol
    if (currentPlayer.symbol === 'X') {
        playerSymbolSpan.style.color = 'var(--third-color)'; // Set color for X
    } else if (currentPlayer.symbol === 'O') {
        playerSymbolSpan.style.color = 'var(--fifth-color)'; // Set color for O
    }

    // currentPlayerDisplay.style.color = '#333'; // Set default text color
}

/** Start logic to limit user name input */
let playerNameInputs = document.querySelectorAll('input[type="text"]');

// Set the maximum allowed characters
const maxCharacters = 10;

// Add an event listener to each input field
playerNameInputs.forEach(input => {
    input.addEventListener('input', function () {
        // Get the current value of the input field
        const playerName = input.value;

        // Check if the length exceeds the maximum characters
        if (playerName.length > maxCharacters) {
            // Trim the input to the maximum allowed characters
            input.value = playerName.slice(0, maxCharacters);
        }
    });
});
/** End logic to limit user name input */

// Function to Reload the page
function restartPage() {
    location.reload();
}

// initialize the gameboard 
renderGameBoard();



/** References to functions */

// Create players
// let playerX = Player('Player X', 'X');
// let playerO = Player('CPU', 'O', isCPU = true);

// Example usage
// GameBoard.setCell(0, 0, 'X'); // Set the top-left cell to 'X'
// const currentBoard = GameBoard.getBoard(); // Get the current game board
// GameBoard.clearBoard(); // Clear the game board

// Test factory function attributes
// console.log(playerX.symbol);
// console.log(playerO.symbol);

// Test makeMove method from factory funct
// playerO.makeMove(2,0);


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

// Example of using the replace fn to change score titles from startGame fn
// xTitleScore.textContent = xTitleScore.textContent.replace(/Player X/g, `${playerX.name} (${playerX.symbol})`);
// oTitleScore.textContent = oTitleScore.textContent.replace(/Player O/g, `${playerO.name} (${playerO.symbol})`);

