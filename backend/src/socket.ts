import { Server } from 'socket.io';
import http from 'http';

let io: Server | null = null;

export const initSocket = (server: http.Server): Server => {
  io = new Server(server, {
    cors: {
      origin: '*', // For development. Adjust for production
      methods: ['GET', 'POST']
    }
  });
  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io has not been initialized yet! Make sure initSocket has been called.');
  }
  return io;
};
