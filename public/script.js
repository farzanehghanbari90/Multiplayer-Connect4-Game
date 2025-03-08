// script.js

// ---------------------- Room Setup ----------------------
// Parse ?room= from the browser URL (e.g., ?room=abc)
// If no room is provided, default to "default"
function getRoomId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('room') || 'default';
}

const roomId = getRoomId();

// Connect to Socket.io with the roomId passed in the query
const socket = io({
  query: { roomId }
});

// ---------------------- Game Variables ----------------------
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

// When the server assigns your player number
socket.on('playerAssignment', (data) => {
  myPlayer = data.player;
  if (myPlayer === 0) {
    alert("You are a spectator.");
  } else {
    alert("You are Player " + myPlayer);
    // Prompt the player for their name
    const chosenName = prompt("Enter your name:");
    if (chosenName) {
      // Send the chosen name to the server
      socket.emit('setName', { player: myPlayer, name: chosenName });
    }
  }
});

// Whenever the server broadcasts updated names, update the local playerNames array
socket.on('nameUpdate', (names) => {
  playerNames[0] = names[1] || "Player 1";
  playerNames[1] = names[2] || "Player 2";
  messageElement.textContent = `${playerNames[currentPlayer - 1]}'s turn`;
});

// When a move is received from the server, process it
socket.on('move', (data) => {
  processMove(data.col);
});

// ---------------------- Connect 4 Game Logic ----------------------

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
  // Only allow the current player to place a disc
  if (myPlayer !== currentPlayer) {
    alert("Not your turn!");
    return;
  }
  // Emit the move to the server (which will broadcast it to the room)
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
        // Switch turn and update the message
        currentPlayer = (currentPlayer === 1) ? 2 : 1;
        messageElement.textContent = `${playerNames[currentPlayer - 1]}'s turn`;
      });
      return;
    }
  }
}

function animateDisc(row, col, callback) {
  const cellSize = boardElement.firstChild ? boardElement.firstChild.offsetHeight : 50;
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

// ---------------------- Event Listeners ----------------------

// When a cell in the board is clicked, determine which column was clicked and drop a disc there
boardElement.addEventListener('click', (e) => {
  const col = e.target.dataset.col;
  if (col !== undefined) {
    dropDisc(parseInt(col));
  }
});

// Restart button: resets the game state and re-creates the board
restartButton.addEventListener('click', () => {
  currentPlayer = 1;
  messageElement.textContent = `${playerNames[currentPlayer - 1]}'s turn`;
  boardElement.style.pointerEvents = 'auto';
  document.body.classList.remove('win');
  createBoard();
});

// Initialize the board and display the starting message on page load
createBoard();
messageElement.textContent = `${playerNames[currentPlayer - 1]}'s turn`;

// ---------------------- Optional: Inline Star Animation CSS ----------------------
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
  0% { transform: translateY(-100vh); opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0; }
}
.disc {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: top 0.5s ease-out;
}
`;
document.head.appendChild(style);
