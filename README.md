Project Title: Multiplayer Connect 4 Game
Author: Your Name
License: MIT

Description:
------------
This project is a distributed multiplayer Connect 4 game built using Node.js, Express, and Socket.io. 
It allows two players to play Connect 4 in real time from separate client devices, 
while additional clients join as spectators. 
The server serves all static files (HTML, CSS, JS, images) from the "public" folder and 
manages real-time communication between clients via Socket.io.

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

Project Structure:
------------------
Multiplayer-Connect4-Game/
├── server.js         --> Node.js server using Express and Socket.io
├── package.json      --> Project metadata, dependencies, and start script
└── public/
    ├── index.html    --> Main HTML file for the game client
    ├── script.js     --> Client-side JavaScript containing game logic
    ├── styles.css    --> CSS file for styling the game interface
    └── images/       --> Folder containing image assets (e.g., header.png)

Key Features:
-------------
- **Real-time Communication**: Uses Socket.io to handle events like "move" and "setName" so that 
  the game state is updated across all connected clients.
- **Fixed Player Slots**: The server assigns exactly one Player 1 and one Player 2; any extra 
  connections become spectators.
- **Game Mechanics**: The client logic (in script.js) handles dropping discs, checking for wins, 
  switching turns, and displaying win messages.
- **Graceful Restart**: A "Restart Game" button resets the board and game state.

Bonus (Optional):
-----------------
- **Multiple Simultaneous Games**: 
  With additional code, you could implement unique game rooms by assigning a game ID or room ID 
  to each group of players. This is not included in this version but can be added for extra credit.

Troubleshooting:
----------------
- If the server does not start, verify your Node.js installation by running:
  node -v
  and
  npm -v
- Ensure that all required files (index.html, script.js, styles.css, images) are in the correct 
  folder ("public") and spelled correctly (case-sensitive).
- Check the server log output in the terminal for any errors related to Socket.io or Express.
- If multiple players appear as the same player, ensure you have used the updated server.js 
  code that assigns fixed slots for Player 1 and Player 2.

Contact:
--------
For any questions or suggestions regarding this project, please contact:
[Your Email or Contact Information]

Thank you for reviewing and using this Multiplayer Connect 4 Game!
