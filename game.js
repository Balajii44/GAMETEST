// Game completion tracking
let snakeCompleted = false;
let ticTacToeCompleted = false;
let gamesLocked = false;

function checkAllGamesCompleted() {
    if (snakeCompleted && ticTacToeCompleted) {
        gamesLocked = true;
        setTimeout(() => {
            window.location.href = 'maze.html';
        }, 1000);
    }
}

// Snake Game Logic
const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const snakeScore = document.getElementById('snakeScore');
const snakeStatus = document.createElement('div');
snakeStatus.style.cssText = `
    color: #0ff;
    font-size: 1.2rem;
    text-align: center;
    margin-top: 1rem;
    text-shadow: 0 0 10px #0ff;
`;
document.querySelector('.game-container:first-child').appendChild(snakeStatus);

const gridSize = 25;
const tileCount = canvas.width / gridSize;

let snake = [
    { x: 10, y: 10 }
];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let gameLoop;
let gameSpeed = 150; // Starting speed (higher number = slower)
const minSpeed = 50; // Maximum speed (lower number = faster)
const speedIncrease = 5; // How much to increase speed by per point

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    
    // Prevent default behavior for arrow keys
    if ([LEFT_KEY, RIGHT_KEY, UP_KEY, DOWN_KEY].includes(keyPressed)) {
        event.preventDefault();
    }

    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Move snake
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        snakeScore.textContent = score;
        generateFood();
        
        // Increase speed
        gameSpeed = Math.max(minSpeed, gameSpeed - speedIncrease);
        clearInterval(gameLoop);
        gameLoop = setInterval(drawGame, gameSpeed);

        // Check if snake has reached score of 10 or more
        if (score >= 10) {
            snakeStatus.textContent = `Game Completed! Final Score: ${score}`;
            snakeCompleted = true;
            checkAllGamesCompleted();
        }
    } else {
        snake.pop();
    }

    // Check collision with walls
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Check collision with self
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 10;
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    ctx.shadowBlur = 0;

    // Draw snake
    ctx.fillStyle = '#0ff';
    ctx.shadowColor = '#0ff';
    ctx.shadowBlur = 10;
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Head
            ctx.fillStyle = '#00ffff';
        } else {
            // Body
            ctx.fillStyle = '#0ff';
        }
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
    ctx.shadowBlur = 0;
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
}

function gameOver() {
    if (gamesLocked) return;
    
    clearInterval(gameLoop);
    if (score >= 10) {
        snakeStatus.textContent = `Game Completed! Final Score: ${score}`;
        snakeCompleted = true;
        checkAllGamesCompleted();
    } else {
        snakeStatus.textContent = `Game Over! Final Score: ${score}`;
        setTimeout(() => {
            alert('Game Over! Score: ' + score);
            snake = [{ x: 10, y: 10 }];
            dx = 0;
            dy = 0;
            score = 0;
            gameSpeed = 150;
            snakeScore.textContent = score;
            snakeStatus.textContent = '';
            generateFood();
            gameLoop = setInterval(drawGame, gameSpeed);
        }, 1000);
    }
}

// Start Snake Game
gameLoop = setInterval(drawGame, gameSpeed);

// Tic Tac Toe Logic
const cells = document.querySelectorAll('.cell');
const currentPlayerDisplay = document.getElementById('currentPlayer');
const ticTacToeStatus = document.createElement('div');
ticTacToeStatus.style.cssText = `
    color: #0ff;
    font-size: 1.2rem;
    text-align: center;
    margin-top: 1rem;
    text-shadow: 0 0 10px #0ff;
`;
document.querySelector('.game-container:last-child').appendChild(ticTacToeStatus);

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let isAITurn = false;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

function handleCellClick(e) {
    if (isAITurn || !gameActive || gamesLocked) return;
    
    const cell = e.target;
    const index = cell.getAttribute('data-index');

    if (gameBoard[index] !== '') return;

    makeMove(index);
    
    if (gameActive) {
        isAITurn = true;
        setTimeout(makeAIMove, 500);
    }
}

function makeMove(index) {
    gameBoard[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    
    if (checkWin()) {
        gameActive = false;
        ticTacToeStatus.textContent = `Player ${currentPlayer} wins!`;
        ticTacToeCompleted = true;
        checkAllGamesCompleted();
        return;
    }

    if (checkDraw()) {
        gameActive = false;
        ticTacToeStatus.textContent = "It's a draw!";
        ticTacToeCompleted = true;
        checkAllGamesCompleted();
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    currentPlayerDisplay.textContent = currentPlayer;
}

function makeAIMove() {
    if (!gameActive) return;
    
    const bestMove = findBestMove();
    makeMove(bestMove);
    isAITurn = false;
}

function findBestMove() {
    let bestScore = -Infinity;
    let bestMove = 0;
    
    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';
            let score = minimax(gameBoard, 0, false);
            gameBoard[i] = '';
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    
    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    if (checkWinForPlayer('O')) return 10 - depth;
    if (checkWinForPlayer('X')) return depth - 10;
    if (checkDraw()) return 0;
    
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinForPlayer(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return gameBoard[index] === player;
        });
    });
}

function checkWin() {
    return checkWinForPlayer(currentPlayer);
}

function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

// Reset game function
function resetGame() {
    if (gamesLocked) return;
    
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    isAITurn = false;
    currentPlayerDisplay.textContent = currentPlayer;
    cells.forEach(cell => {
        cell.textContent = '';
    });
    ticTacToeStatus.textContent = '';
    ticTacToeCompleted = false;
}

// Update reset button
const resetButton = document.createElement('button');
resetButton.textContent = 'Reset Game';
resetButton.style.cssText = `
    display: block;
    margin: 1rem auto;
    padding: 0.5rem 1rem;
    font-size: 1.2rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
`;
resetButton.addEventListener('mouseover', () => {
    if (!gamesLocked) {
        resetButton.style.backgroundColor = '#45a049';
    }
});
resetButton.addEventListener('mouseout', () => {
    if (!gamesLocked) {
        resetButton.style.backgroundColor = '#4CAF50';
    }
});
resetButton.addEventListener('click', resetGame);
document.querySelector('.game-container:last-child').appendChild(resetButton); 