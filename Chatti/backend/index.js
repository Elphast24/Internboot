import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server as SocketIo } from 'socket.io';
import 'dotenv/config';

import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/chat-app')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.io Connection Handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('User joined room:', room);
  });

  socket.on('new message', (newMessage) => {
    const chat = newMessage.chat;
    
    if (!chat.users) return console.log('Chat users not defined');

    chat.users.forEach(user => {
      if (user._id == newMessage.sender._id) return;
      socket.in(user._id).emit('message received', newMessage);
    });
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});