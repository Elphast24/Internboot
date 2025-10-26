const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const messageRoutes = require('./routes/messages');
const path = require('path');
const fs = require('fs');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
  res.send('Chat API is running...');
});

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? 'http://localhost:5173' 
      : 'http://localhost:3000',
    credentials: true,
  },
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Connected to socket.io');

  // Setup user
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  // Join chat
  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('User joined room: ' + room);
  });

  // Typing indicator
  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  // New message
  socket.on('new message', (newMessageReceived) => {
    const chat = newMessageReceived.chat;

    if (!chat.users) return console.log('chat.users not defined');

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit('message received', newMessageReceived);
    });
  });

  // User disconnect
  socket.on('disconnect', () => {
    console.log('USER DISCONNECTED');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});