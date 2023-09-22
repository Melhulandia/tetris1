const grid = document.getElementById('grid');
const gridWidth = 10;
const gridHeight = 20;
const gridSize = gridWidth * gridHeight;
const cells = [];

let currentTetromino = null;
let currentPosition = { x: 0, y: 0 };


const tetrominos = [
    [[1, 1, 1, 1]], // I
    [[1, 1, 0], [0, 1, 1]], // Z
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1], [1, 1]], // O
    [[1, 0, 0], [1, 1, 1]], // L
    [[1,1,1],[0,1,0]],//T
    [[1,1,1],[1,0,1]],//C
];

function drawTetromino(tetromino, position) {
    tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                const index = (position.y + y) * gridWidth + position.x + x;
                cells[index].classList.add('tetromino');
            }
        });
    });
}

// Function to clear the grid
function clearGrid() {
    cells.forEach(cell => {
        cell.classList.remove('tetromino');
    });
}
//Function to continue 
function mas(){
   if (clearGrid) {
    drawTetromino();
   }
    }

// Function to check for collision
function checkCollision(tetromino, position) {
    for (let y = 0; y < tetromino.length; y++) {
        for (let x = 0; x < tetromino[y].length; x++) {
            if (tetromino[y][x]) {
                const newX = position.x + x;
                const newY = position.y + y;

                if (newX < 0 || newX >= gridWidth || newY >= gridHeight) {
                    return true; // Collision with borders
                }

                const index = newY * gridWidth + newX;
                if (cells[index].classList.contains('settled')) {
                    return true; // Collision with settled tetrominos
                }
            }
        }
    }

    return false;
}

// Function to check for cleared rows
function checkClearedRows() {
    for (let y = gridHeight - 1; y >= 0; y--) {
        const row = cells.slice(y * gridWidth, (y + 1) * gridWidth);
        if (row.every(cell => cell.classList.contains('settled'))) {
            row.forEach(cell => {
                cell.classList.remove('settled');
            });
            cells.splice(y * gridWidth, gridWidth);
            cells.unshift(...Array(gridWidth).fill(null));
            y++;
        }
    }
}

// Function to settle the current tetromino
function settleTetromino() {
    currentTetromino.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                const index = (currentPosition.y + y) * gridWidth + currentPosition.x + x;
                cells[index].classList.add('settled');
            }
        });
    });

    checkClearedRows(); // Check for cleared rows
    spawnTetromino();
}

// Function to settle the current tetromino
function settleTetromino() {
    currentTetromino.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                const index = (currentPosition.y + y) * gridWidth + currentPosition.x + x;
                cells[index].classList.add('settled');
            }
        });
    });

    // Check for cleared rows
    for (let y = gridHeight - 1; y >= 0; y--) {
        const row = cells.slice(y * gridWidth, (y + 1) * gridWidth);
        if (row.every(cell => cell.classList.contains('settled'))) {
            row.forEach(cell => cell.classList.remove('settled'));
            cells.splice(y * gridWidth, gridWidth);
            cells.unshift(...Array(gridWidth).fill(null));
            y++;
        }
    }

    spawnTetromino();
}

// Function to spawn a new tetromino
function spawnTetromino() {
    const randomIndex = Math.floor(Math.random() * tetrominos.length);
    const randomTetromino = tetrominos[randomIndex];
    currentPosition = { x: Math.floor(gridWidth / 2) - 1, y: 0 };

    if (checkCollision(randomTetromino, currentPosition)) {
        // Game over
        alert("Felicidades! Perdiste el Juego :) ");
        return;
    }

    currentTetromino = randomTetromino;
    drawTetromino(currentTetromino, currentPosition);
}



// Handle user input
document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
        const newPosition = { x: currentPosition.x - 1, y: currentPosition.y };
        if (!checkCollision(currentTetromino, newPosition)) {
            clearGrid();
            currentPosition = newPosition;
            drawTetromino(currentTetromino, currentPosition);
        }
    } else if (event.key === 'ArrowRight') {
        const newPosition = { x: currentPosition.x + 1, y: currentPosition.y };
        if (!checkCollision(currentTetromino, newPosition)) {
            clearGrid();
            currentPosition = newPosition;
            drawTetromino(currentTetromino, currentPosition);
        }
    } else if (event.key === 'ArrowDown') {
        moveDown();
    } else if (event.key === 'ArrowUp') {
        rotateTetromino();
    }
});

// Function to move the tetromino down
function moveDown() {
    const newPosition = { x: currentPosition.x, y: currentPosition.y + 1 };
    if (!checkCollision(currentTetromino, newPosition)) {
        clearGrid();
        currentPosition = newPosition;
        drawTetromino(currentTetromino, currentPosition);
    } else {
        settleTetromino();
    }
}

// Function to rotate the tetromino
function rotateTetromino() {
    const newTetromino = [];
    for (let x = 0; x < currentTetromino[0].length; x++) {
        const newRow = [];
        for (let y = currentTetromino.length - 1; y >= 0; y--) {
            newRow.push(currentTetromino[y][x]);
        }
        newTetromino.push(newRow);
    }

    if (!checkCollision(newTetromino, currentPosition)) {
        clearGrid();
        currentTetromino = newTetromino;
        drawTetromino(currentTetromino, currentPosition);
    }
}
// Game loop function
function gameLoop() {
    moveDown();
    drawTetromino(currentTetromino, currentPosition);
}

// Initialize the game
function initGame() {
    for (let i = 0; i < gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        grid.appendChild(cell);
        cells.push(cell);
    }

    spawnTetromino();
    setInterval(gameLoop, 1000);
    setInterval(moveDown, 1000); // Move down every second
}

initGame();



