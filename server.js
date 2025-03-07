// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the "public" folder
app.use(express.static('public'));

// Track which socket is which player
// key: socket.id, value: 1 or 2 (for players), or 0 (for spectator)
let players = {};

// Store the current names for player 1 and player 2
let names = {
  1: 'Player 1',
  2: 'Player 2'
};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Assign the new connection to player 1 or 2 if available, otherwise spectator
  if (Object.keys(players).length < 2) {
    const playerNumber = Object.keys(players).length + 1;
    players[socket.id] = playerNumber;
    console.log(`Assigned Player ${playerNumber} to socket ${socket.id}`);

    // Tell the client which player they are
    socket.emit('playerAssignment', { player: playerNumber });
    // Also send the current known names so they can update their display
    socket.emit('nameUpdate', names);
  } else {
    // Spectator
    players[socket.id] = 0;
    console.log(`Assigned spectator to socket ${socket.id}`);

    // Tell the client they're a spectator
    socket.emit('playerAssignment', { player: 0 });
    // Send current names so they can display them
    socket.emit('nameUpdate', names);
  }

  // Handle the "setName" event from a client
  socket.on('setName', (data) => {
    // data = { player: 1 or 2, name: "..." }
    if (data.player === 1 || data.player === 2) {
      names[data.player] = data.name;
      console.log(`Player ${data.player} set name to "${data.name}"`);
      // Broadcast new names to all connected clients
      io.emit('nameUpdate', names);
    }
  });

  // Handle a move from a client
  socket.on('move', (data) => {
    // data = { col: <number> }
    // Broadcast the move so every client can update the board
    io.emit('move', data);
  });

  // On disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete players[socket.id];
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
