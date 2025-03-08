Multiplayer Connect 4 Game


Description:
------------
This project is a distributed multiplayer Connect 4 game built using Node.js, Express, and Socket.io. 
It allows two players to play Connect 4 in real time from separate client devices, 
while additional clients join as spectators. The server serves all static files (HTML, CSS, JS, images) 
from the "public" folder and manages real-time communication between clients via Socket.io.

Requirements:
-------------
- Node.js (version 14 or higher recommended)
- npm (Node Package Manager)

Installation Instructions:
--------------------------
1. Clone or download the project files into a folder on your local machine.
2. Open a terminal (or command prompt) in the project root directory.
3. Run the following command to install the project dependencies:
   **npm install**
4. After the dependencies are installed, start the server with:
   **npm start**
5. Open your web browser and navigate to:
   http://localhost:3000
6. The Connect 4 game should load. Two players will be assigned (Player 1 and Player 2) 
   while additional connections become spectators.
7. To restart the game at any time, click the "Restart Game" button on the game interface.


Key Features:
-------------
- **Real-time Communication**: Uses Socket.io to handle events like "move" and "setName," so 
  the game state is updated across all connected clients in real time.
- **Fixed Player Slots**: The server ensures exactly one Player 1 and one Player 2; 
  extra connections become spectators.
- **Game Mechanics**: The client logic (in `script.js`) handles dropping discs, checking for wins, 
  switching turns, and displaying win messages.
- **Graceful Restart**: A "Restart Game" button resets the board and game state.

Multiple Simultaneous Games:
-----------------------------------
This project includes code to allow **multiple game rooms** to exist at once. By creating 
unique game IDs or room IDs, each group of players can join their own instance of the game 
and play independently. The server stores separate game states for each room, enabling 
multiple matches to proceed in parallel.  
- For example, players can navigate to a URL like `http://localhost:3000/room/123` to start 
  or join the room with ID `123`.
- The server uses Socket.io “rooms” or “namespaces” to keep each match’s data separate.

Troubleshooting:
----------------
- If the server does not start, verify your Node.js installation by running:
  `node -v` and `npm -v`
- Ensure that all required files (index.html, script.js, styles.css, images) are in the 
  correct folder ("public") and spelled correctly (case-sensitive).
- Check the server log output in the terminal for any errors related to Socket.io or Express.
- If multiple players appear as the same player, ensure you have used the updated server.js 
  code that assigns fixed slots for Player 1 and Player 2.
- For multiple games, verify that you are using the correct URL (with the game ID) and that 
  your server code handles separate rooms.



Thank you for reviewing and using this Multiplayer Connect 4 Game!
