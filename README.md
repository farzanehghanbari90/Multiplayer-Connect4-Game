Project Title: Multiplayer Connect 4 Game
Author: Your Name
License: MIT

Description:
------------
This project is a distributed multiplayer Connect 4 game built using Node.js, Express, and Socket.io. It allows two players to play Connect 4 in real time from separate client devices, while additional clients join as spectators. The server serves all static files (HTML, CSS, JS, images) from the "public" folder and manages real-time communication between clients via Socket.io.

Requirements:
-------------
- Node.js (version 14 or higher recommended)
- npm (Node Package Manager)

Installation Instructions:
--------------------------
1. Clone or download the project files into a folder on your local machine.
2. Open a terminal (or command prompt) in the project root directory.
3. Run the following command to install the project dependencies:
   npm install
4. After the dependencies are installed, start the server with:
   npm start
5. Open your web browser and navigate to:
   http://localhost:3000
6. The Connect 4 game should load. Two players will be assigned (Player 1 and Player 2) while additional connections become spectators.
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
- **Real-time Communication:** Uses Socket.io to handle events like "move" and "setName" so that the game state is updated across all connected clients.
- **Player Assignment:** The server assigns fixed slots for Player 1 and Player 2. Any extra connections join as spectators.
- **Game Mechanics:** The game logic (in script.js) includes dropping discs, switching turns, checking win conditions, and displaying win messages.
- **Graceful Restart:** A restart button is available on the client to reset the game state.
- **Bonus (Optional):** Although not implemented in this version, the project can be extended to support multiple simultaneous games by creating unique game rooms using Socket.io's room feature.

Additional Notes:
-----------------
- Ensure that the "public" folder contains all client files. The server serves these files so that the game client is accessible at the root URL.
- If any issues occur (such as the game not loading or Socket.io errors), check the terminal for error messages and verify that all dependencies are installed.
- For real-time play, both the server and client must use the same version of Socket.io as specified in package.json.
- This project meets the core requirements of the Distributed Multiplayer Game assignment rubric. A bonus for supporting multiple simultaneous games is optional and not included in this version.

Troubleshooting:
----------------
- If the server does not start, verify your Node.js installation by running "node -v" and "npm -v".
- Ensure that all required files (index.html, script.js, styles.css, images) are in the correct folders.
- Check the server log output in the terminal for any errors related to Socket.io or Express.

Contact:
--------
For any questions or suggestions regarding this project, please contact:
[Your Email or Contact Information]

Thank you for reviewing and using this Multiplayer Connect 4 Game!
