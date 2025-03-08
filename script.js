// script.js

const rows = 6;
const cols = 7;
const board = [];
let currentPlayer = 1;
let playerNames = ["Player 1", "Player 2"];

// Track which player *I* am (0 if spectator)
let myPlayer = 0;

// DOM references
const boardElement = document.getElementById('board');
const messageElement = document.getElementById('message');
const restartButton = document.getElementById('restart');

// ---------------------- Socket.io Setup ----------------------
const socket = io();

// When server assigns your player number
socket.on('playerAssignment', (data) => {
  myPlayer = data.player;
  if (myPlayer === 0) {
    alert("You are a spectator.");
  } else {
    alert("You are Player " + myPlayer);
    // Ask this single user for their name
    const chosenName = prompt("Enter your name:");
    if (chosenName) {
      // Tell the server your name
      socket.emit('setName', { player: myPlayer, name: chosenName });
    }
  }
});

// Whenever the server broadcasts updated names
socket.on('nameUpdate', (names) => {
  // names is {1: "Alice", 2: "Bob"} for example
  playerNames[0] = names[1] || "Player 1";
  playerNames[1] = names[2] || "Player 2";

  // Update the message in case the turn indicator changes
  messageElement.textContent = `${playerNames[currentPlayer - 1]}'s turn`;
});

// When a move arrives from the server, process it
socket.on('move', (data) => {
  // data = { col: number }
  processMove(data.col);
});

// ---------------------- Connect 4 Game Logic -----------------

function createBoard() {
  boardElement.innerHTML = '';
  for (let row = 0; row < rows; row++) {
    board[row] = [];
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      board[row][col] = 0;
      boardElement.appendChild(cell);
    }
  }
}

function dropDisc(col) {
  // Only let the current player place a disc
  if (myPlayer !== currentPlayer) {
    alert("Not your turn!");
    return;
  }
  // Send the move to the server
  socket.emit('move', { col });
}

function processMove(col) {
  for (let row = rows - 1; row >= 0; row--) {
    if (board[row][col] === 0) {
      board[row][col] = currentPlayer;
      animateDisc(row, col, () => {
        const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
        cell.dataset.player = currentPlayer;
        if (checkWin(row, col)) {
          messageElement.textContent = `${playerNames[currentPlayer - 1]} wins!`;
          document.body.classList.add('win');
          boardElement.style.pointerEvents = 'none';
          triggerStarAnimation();
          return;
        }
        // Switch turn
        currentPlayer = (currentPlayer === 1) ? 2 : 1;
        messageElement.textContent = `${playerNames[currentPlayer - 1]}'s turn`;
      });
      return;
    }
  }
}

function animateDisc(row, col, callback) {
  const cellSize = boardElement.firstChild.offsetHeight;
  const disc = document.createElement('div');
  disc.classList.add('disc');
  disc.style.backgroundColor = currentPlayer === 1 ? 'yellow' : 'red';
  disc.style.left = `${col * cellSize}px`;
  boardElement.appendChild(disc);

  let currentY = 0;
  const targetY = row * cellSize;

  function drop() {
    currentY += 10;
    if (currentY >= targetY) {
      currentY = targetY;
      disc.style.top = `${currentY}px`;
      callback();
      return;
    }
    disc.style.top = `${currentY}px`;
    requestAnimationFrame(drop);
  }
  drop();
}

function checkWin(row, col) {
  const directions = [
    { dr: 0, dc: 1 },
    { dr: 1, dc: 0 },
    { dr: 1, dc: 1 },
    { dr: 1, dc: -1 }
  ];

  for (const { dr, dc } of directions) {
    let count = 1;
    count += countInDirection(row, col, dr, dc);
    count += countInDirection(row, col, -dr, -dc);
    if (count >= 4) return true;
  }
  return false;
}

function countInDirection(row, col, dr, dc) {
  let count = 0;
  let r = row + dr;
  let c = col + dc;
  while (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === currentPlayer) {
    count++;
    r += dr;
    c += dc;
  }
  return count;
}

function triggerStarAnimation() {
  for (let i = 0; i < 50; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDuration = `${1 + Math.random() * 2}s`;
    document.body.appendChild(star);

    setTimeout(() => {
      star.remove();
    }, 3000);
  }
}

// Board click
boardElement.addEventListener('click', (e) => {
  const col = e.target.dataset.col;
  if (col !== undefined) {
    dropDisc(parseInt(col));
  }
});

// Restart button
restartButton.addEventListener('click', () => {
  currentPlayer = 1;
  messageElement.textContent = `${playerNames[currentPlayer - 1]}'s turn`;
  boardElement.style.pointerEvents = 'auto';
  document.body.classList.remove('win');
  createBoard();
});

// Initialize board on page load
createBoard();
messageElement.textContent = `${playerNames[currentPlayer - 1]}'s turn`;

// Optional: star animation CSS
const style = document.createElement('style');
style.textContent = `
.star {
  position: fixed;
  width: 7px;
  height: 7px;
  background-color: white;
  border-radius: 50%;
  pointer-events: none;
  animation: fall 6s linear;
  box-shadow: 0 0 13px white;
}

@keyframes fall {
  0% {
    transform: translateY(-100vh);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
}
`;
document.head.appendChild(style);
