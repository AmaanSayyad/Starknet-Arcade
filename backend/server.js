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

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", ({ username, roomId }) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: [],
        choices: {},
        score: {},
        round: 1,
      };
    }

    const room = rooms[roomId];

    // Prevent duplicate usernames
    if (!room.players.find((p) => p.username === username)) {
      room.players.push({ username });
      room.score[username] = 0;
    }

    io.to(roomId).emit("players", room.players);
  });

  socket.on("choice", ({ username, choice, roomId }) => {
    const room = rooms[roomId];
    if (!room) return;
  
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
  

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    // Cleanup could be added here
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
