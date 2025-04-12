const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust as needed for production
  },
});

const rooms = {};

// Define snakes and ladders on the board
const snakesAndLadders = {
  // Ladders (start -> end)
  4: 25,
  21: 39,
  26: 67,
  43: 76,
  59:80,
  71: 89,
  // Snakes (start -> end)
  30: 7,
  47: 13,
  56: 19,
  73: 51,
  82: 42,
  92:75,
  98: 55,
};

// Check if a position is a snake or ladder
function checkSnakeOrLadder(position) {
  if (snakesAndLadders[position]) {
    return {
      found: true,
      to: snakesAndLadders[position],
      type: snakesAndLadders[position] > position ? 'ladder' : 'snake'
    };
  }
  return { found: false };
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Existing RPS game join event
  socket.on("join", ({ username, roomId }) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: [],
        choices: {},
        score: {},
        round: 1,
        gameType: "rps", // Set default game type to Rock Paper Scissors
      };
    }

    const room = rooms[roomId];

    // Prevent duplicate usernames
    if (!room.players.find((p) => p.username === username)) {
      room.players.push({ username, id: socket.id });
      room.score[username] = 0;
    }

    io.to(roomId).emit("players", room.players);
  });

  // Join a Snake and Ladder game
  socket.on("joinSnakeGame", ({ username, roomId }) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: [],
        gameType: "snakeLadder",
        currentTurn: null,
        isStarted: false,
        winner: null
      };
    }

    const room = rooms[roomId];
    
    // Ensure the room is set to Snake and Ladder game type
    room.gameType = "snakeLadder";

    // Prevent duplicate usernames and add the player
    if (!room.players.find((p) => p.username === username)) {
      const playerColors = ['blue', 'red', 'green', 'purple'];
      const colorIndex = room.players.length;
      
      room.players.push({
        username,
        id: socket.id,
        position: 1,
        color: playerColors[colorIndex]
      });
    }

    // Send updated player list to all in room
    io.to(roomId).emit("snakePlayers", room.players);

    // If 2 or more players have joined, start the game
    if (room.players.length >= 2 && !room.isStarted) {
      room.isStarted = true;
      room.currentTurn = room.players[0].id;
      io.to(roomId).emit("snakeGameStarted", room);
    }
  });

  // Roll dice for Snake and Ladder
  socket.on("rollDice", ({ roomId }) => {
    const room = rooms[roomId];
    
    if (!room || room.gameType !== "snakeLadder") return;
    
    // Check if it's the player's turn
    if (room.currentTurn !== socket.id) {
      socket.emit("error", { message: "Not your turn" });
      return;
    }
    
    // Roll the dice
    const diceValue = Math.floor(Math.random() * 6) + 1;
    
    // Find current player
    const playerIndex = room.players.findIndex(p => p.id === socket.id);
    if (playerIndex === -1) return;
    
    const player = room.players[playerIndex];
    
    // Notify all players about the dice roll
    io.to(roomId).emit("diceRolled", {
      playerName: player.username,
      diceValue
    });
    
    // Calculate new position
    let newPosition = player.position + diceValue;
    
    // Check if player would go beyond 100
    if (newPosition > 100) {
      // Stay in the same position
      setTimeout(() => {
        // Move to next player's turn
        const nextPlayerIndex = (playerIndex + 1) % room.players.length;
        room.currentTurn = room.players[nextPlayerIndex].id;
        
        io.to(roomId).emit("playerMoved", room);
      }, 2000);
      
      return;
    }
    
    // Update player position
    room.players[playerIndex].position = newPosition;
    
    // Check for snakes or ladders
    const snakeOrLadder = checkSnakeOrLadder(newPosition);
    
    setTimeout(() => {
      if (snakeOrLadder.found) {
        // Send snake or ladder event
        io.to(roomId).emit("snakeOrLadder", {
          playerName: player.username,
          type: snakeOrLadder.type,
          from: newPosition,
          to: snakeOrLadder.to
        });
        
        // Update position after snake or ladder
        room.players[playerIndex].position = snakeOrLadder.to;
        
        // Check for win after delay
        setTimeout(() => {
          if (snakeOrLadder.to === 100) {
            // Player wins
            room.winner = socket.id;
            io.to(roomId).emit("gameOver", room);
          } else {
            // Next player's turn
            const nextPlayerIndex = (playerIndex + 1) % room.players.length;
            room.currentTurn = room.players[nextPlayerIndex].id;
            
            io.to(roomId).emit("playerMoved", room);
          }
        }, 1500);
      } else {
        // Check for win
        if (newPosition === 100) {
          // Player wins
          room.winner = socket.id;
          io.to(roomId).emit("gameOver", room);
        } else {
          // Next player's turn
          const nextPlayerIndex = (playerIndex + 1) % room.players.length;
          room.currentTurn = room.players[nextPlayerIndex].id;
          
          io.to(roomId).emit("playerMoved", room);
        }
      }
    }, 1500);
  });

  // Reset Snake and Ladder game
  socket.on("resetSnakeGame", ({ roomId }) => {
    const room = rooms[roomId];
    if (!room || room.gameType !== "snakeLadder") return;
    
    // Reset player positions
    room.players.forEach(player => {
      player.position = 1;
    });
    
    // Reset game state
    room.currentTurn = room.players[0].id;
    room.isStarted = true;
    room.winner = null;
    
    // Notify all players
    io.to(roomId).emit("snakeGameReset", room);
  });

  // Existing RPS game choice event
  socket.on("choice", ({ username, choice, roomId }) => {
    const room = rooms[roomId];
    if (!room || room.gameType !== "rps") return;
  
    room.choices[username] = choice;
  
    if (Object.keys(room.choices).length === 2) {
      const [p1, p2] = room.players.map((p) => p.username);
      const c1 = room.choices[p1];
      const c2 = room.choices[p2];
  
      const result = determineResult(p1, c1, p2, c2);
      if (result === "draw") {
        io.to(roomId).emit("roundResult", {
          result: `It's a draw! Both chose ${c1}.`,
          round: room.round,
          score: room.score,
          choices: { [p1]: c1, [p2]: c2 }, // send both choices
        });
      } else {
        const winner = result;
        room.score[winner]++;
        io.to(roomId).emit("roundResult", {
          result: `${winner} wins the round!`,
          round: room.round,
          score: room.score,
          choices: { [p1]: c1, [p2]: c2 }, // send both choices
        });
  
        if (room.score[winner] === 5) {
          io.to(roomId).emit("gameWinner", { winner });
          // Reset game state
          room.choices = {};
          room.score = {};
          room.round = 1;
          room.players.forEach((p) => {
            room.score[p.username] = 0;
          });
          return;
        }
      }
  
      room.choices = {};
      room.round++;
    }
  });

  // Player leaves room
  socket.on("leaveRoom", ({ username, roomId }) => {
    const room = rooms[roomId];
    if (!room) return;
    
    // Remove player from the room
    room.players = room.players.filter(player => {
      if (player.id === socket.id || player.username === username) {
        return false;
      }
      return true;
    });
    
    // Leave the socket room
    socket.leave(roomId);
    
    // If room is empty, delete it
    if (room.players.length === 0) {
      delete rooms[roomId];
    } else {
      // Update current turn if it was this player's turn (for Snake and Ladder)
      if (room.gameType === "snakeLadder" && room.currentTurn === socket.id) {
        room.currentTurn = room.players[0].id;
      }
      
      // Notify remaining players
      if (room.gameType === "snakeLadder") {
        io.to(roomId).emit("playerLeft", room);
      } else {
        io.to(roomId).emit("players", room.players);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    
    // Find all rooms the player is in
    Object.keys(rooms).forEach(roomId => {
      const room = rooms[roomId];
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      
      if (playerIndex !== -1) {
        // Remove player from room
        room.players.splice(playerIndex, 1);
        
        // If room is empty, delete it
        if (room.players.length === 0) {
          delete rooms[roomId];
        } else {
          // Update current turn if needed for Snake and Ladder
          if (room.gameType === "snakeLadder" && room.currentTurn === socket.id) {
            const nextPlayerIndex = playerIndex % room.players.length;
            room.currentTurn = room.players[nextPlayerIndex].id;
          }
          
          // Notify remaining players
          if (room.gameType === "snakeLadder") {
            io.to(roomId).emit("playerLeft", room);
          } else {
            io.to(roomId).emit("players", room.players);
          }
        }
      }
    });
  });
});

function determineResult(p1, c1, p2, c2) {
  if (c1 === c2) return "draw";
  if (
    (c1 === "rock" && c2 === "scissors") ||
    (c1 === "scissors" && c2 === "paper") ||
    (c1 === "paper" && c2 === "rock")
  ) {
    return p1;
  }
  return p2;
}

server.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});