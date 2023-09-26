// Define the game board module
const GameBoard = (() => {
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
  })();
  
  // Example usage
  // GameBoard.setCell(0, 0, 'X'); // Set the top-left cell to 'X'
  // const currentBoard = GameBoard.getBoard(); // Get the current game board
  // GameBoard.clearBoard(); // Clear the game board
  