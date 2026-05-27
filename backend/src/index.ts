import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { initSocket, getIO } from './socket';
import assignmentRoutes from './routes/assignmentRoutes';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize socket manager
initSocket(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Connect Database
connectDB();

// Setup Routes
app.use('/api/assignments', assignmentRoutes);

// Socket.io connection
getIO().on('connection', (socket) => {
  console.log('A user connected via WebSocket:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
