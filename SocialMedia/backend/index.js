require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const socketHandler = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);
const allowedOrigins = [
  process.env.CLIENT_URL,          // e.g., https://social-4abf.onrender.com
  "http://localhost:5173"          // for local dev
].filter(Boolean); // remove undefined values

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/chats', require('./routes/chat'));
app.use('/api/notifications', require('./routes/notifications'));

// 404 handler for undefined routes
// app.use('/*', (req, res) => {
//   res.status(404).json({ 
//     error: 'Route not found',
//     availableRoutes: [
//       '/api/auth',
//       '/api/users',
//       '/api/posts',
//       '/api/chats',
//       '/api/notifications'
//     ]
//   });
// });

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handler
app.use(errorHandler);

// Socket.io setup
socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});