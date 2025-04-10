import { Server } from 'socket.io';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (_: any, res: any) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    let players: any[] = [];

    io.on('connection', (socket) => {
      socket.on('joined', () => {
        socket.emit('joined', players);
      });

      socket.on('join', (data) => {
        players.push(data);
        socket.broadcast.emit('join', data);
      });

      socket.on('rollDice', (data) => {
        io.emit('rollDice', data);
      });

      socket.on('restart', () => {
        players = [];
        io.emit('restart');
      });
    });
  }
  res.end();
};

export default ioHandler;