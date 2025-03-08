// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the "public" folder
app.use(express.static('public'));

/**
 * Instead of 'players = {}', we maintain two fixed slots for player 1 and 2.
 * playerSlots[1] = socket.id for player 1, or null if free
 * playerSlots[2] = socket.id for player 2, or null if free
 * Everyone else is assigned as a spectator (player: 0).
 */
let playerSlots = {
  1: null,
  2: null
};

// Store the current display names for player 1 and player 2
let names = {
  1: 'Player 1',
  2: 'Player 2'
};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // If player 1 slot is free, assign it
  if (playerSlots[1] === null) {
    playerSlots[1] = socket.id;
    socket.emit('playerAssignment', { player: 1 });
    socket.emit('nameUpdate', names);
    console.log(`Assigned Player 1 to socket ${socket.id}`);
  }
  // Else if player 2 slot is free, assign it
  else if (playerSlots[2] === null) {
    playerSlots[2] = socket.id;
    socket.emit('playerAssignment', { player: 2 });
    socket.emit('nameUpdate', names);
    console.log(`Assigned Player 2 to socket ${socket.id}`);
  }
  // Otherwise, spectator
  else {
    socket.emit('playerAssignment', { player: 0 });
    socket.emit('nameUpdate', names);
    console.log(`Assigned spectator to socket ${socket.id}`);
  }

  // Handle the "setName" event from a client
  socket.on('setName', (data) => {
    // data = { player: 1 or 2, name: "..." }
    if (data.player === 1 || data.player === 2) {
      names[data.player] = data.name;
      console.log(`Player ${data.player} set name to "${data.name}"`);
      // Broadcast updated names to all clients
      io.emit('nameUpdate', names);
    }
  });

  // Handle a move from a client
  socket.on('move', (data) => {
    // data = { col: <number> }
    // Broadcast the move so every client can update the board
    io.emit('move', data);
  });

  // On disconnect, free the slot if they were a player
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    if (playerSlots[1] === socket.id) {
      playerSlots[1] = null;
      console.log('Freed Player 1 slot');
    } else if (playerSlots[2] === socket.id) {
      playerSlots[2] = null;
      console.log('Freed Player 2 slot');
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
