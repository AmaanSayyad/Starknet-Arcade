// pages/api/socket.ts
import { Server } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

// Helper function to generate a random game code
function generateGameCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Game state storage
const games: Record<string, any> = {};

const SocketHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (res.socket?.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket?.server);
    res.socket.server.io = io;

    io.on('connection', socket => {
      console.log(`Client connected: ${socket.id}`);
      
      // Create a new game
      socket.on('createGame', ({ playerName }) => {
        const gameId = generateGameCode();
        
        // Initialize game state
        games[gameId] = {
          gameId,
          players: {
            [socket.id]: {
              id: socket.id,
              name: playerName,
              choice: null,
              ready: false
            }
          },
          round: 1,
          results: {
            winner: null,
            player1Choice: null,
            player2Choice: null
          },
          status: 'waiting'
        };
        
        // Join the socket to a room with the game ID
        socket.join(gameId);
        
        // Send the game state back to the client
        socket.emit('gameCreated', { gameState: games[gameId] });
      });
      
      // Join an existing game
      socket.on('joinGame', ({ playerName, gameId }) => {
        // Check if game exists
        if (!games[gameId]) {
          socket.emit('error', { message: 'Game not found' });
          return;
        }
        
        // Check if game is full
        const playerCount = Object.keys(games[gameId].players).length;
        if (playerCount >= 2) {
          socket.emit('error', { message: 'Game is full' });
          return;
        }
        
        // Add player to game
        games[gameId].players[socket.id] = {
          id: socket.id,
          name: playerName,
          choice: null,
          ready: false
        };
        
        // Update game status
        games[gameId].status = 'ready';
        
        // Join the socket to the game room
        socket.join(gameId);
        
        // Notify all players about the new player
        io.to(gameId).emit('playerJoined', { gameState: games[gameId] });
      });
      
      // Player indicates they're ready to play
      socket.on('playerReady', ({ gameId }) => {
        if (!games[gameId]) return;
        
        // Mark player as ready
        games[gameId].players[socket.id].ready = true;
        
        // Check if all players are ready
        const allReady = Object.values(games[gameId].players).every((player: any) => player.ready);
        
        if (allReady) {
          // Start the game
          games[gameId].status = 'choosing';
          
          // Reset player choices
          Object.keys(games[gameId].players).forEach(playerId => {
            games[gameId].players[playerId].choice = null;
          });
          
          // Notify all players
          io.to(gameId).emit('gameUpdated', { gameState: games[gameId] });
        } else {
          // Not everyone is ready yet
          io.to(gameId).emit('gameUpdated', { gameState: games[gameId] });
        }
      });
      
      // Player makes a choice
      socket.on('makeChoice', ({ gameId, choice }) => {
        if (!games[gameId]) return;
        
        // Record player's choice
        games[gameId].players[socket.id].choice = choice;
        
        // Check if all players have made choices
        const allChosen = Object.values(games[gameId].players).every((player: any) => player.choice !== null);
        
        if (allChosen) {
          // Calculate results
          const players = Object.values(games[gameId].players);
          const player1 = players[0] as any;
          const player2 = players[1] as any;
          
          const player1Choice = player1.choice;
          const player2Choice = player2.choice;
          
          // Determine winner
          let winner = null;
          
          if (player1Choice === player2Choice) {
            winner = 'draw';
          } else if (
            (player1Choice === 'rock' && player2Choice === 'scissors') ||
            (player1Choice === 'paper' && player2Choice === 'rock') ||
            (player1Choice === 'scissors' && player2Choice === 'paper')
          ) {
            winner = player1.id;
          } else {
            winner = player2.id;
          }
          
          // Update game state
          games[gameId].results = {
            winner,
            player1Choice,
            player2Choice
          };
          games[gameId].status = 'results';
          
          // Notify players of results
          io.to(gameId).emit('gameUpdated', { gameState: games[gameId] });
          
          // Set up next round after delay
          setTimeout(() => {
            if (!games[gameId]) return; // Game might have been deleted
            
            games[gameId].round += 1;
            games[gameId].status = 'choosing';
            
            // Reset player choices and ready status
            Object.keys(games[gameId].players).forEach(playerId => {
              games[gameId].players[playerId].choice = null;
              games[gameId].players[playerId].ready = true; // Auto-ready for subsequent rounds
            });
            
            // Reset results
            games[gameId].results = {
              winner: null,
              player1Choice: null,
              player2Choice: null
            };
            
            io.to(gameId).emit('gameUpdated', { gameState: games[gameId] });
          }, 3000);
        } else {
          // Not everyone has chosen yet
          io.to(gameId).emit('gameUpdated', { gameState: games[gameId] });
        }
      });
      
      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        
        // Find any games the player was in
        Object.keys(games).forEach(gameId => {
          const game = games[gameId];
          
          // Check if this player was in the game
          if (game.players[socket.id]) {
            // Notify other players that this player left
            socket.to(gameId).emit('opponentLeft');
            
            // Delete the game
            delete games[gameId];
          }
        });
      });
    });
  }
  res.end();
};

export default SocketHandler;