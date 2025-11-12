const Chat = require('../models/Chat');
const Notification = require('../models/Notification');

const socketHandler = (io) => {
  const users = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('user:online', (userId) => {
      users.set(userId, socket.id);
      socket.userId = userId;
    });

    socket.on('chat:join', (chatId) => {
      socket.join(chatId);
    });

    socket.on('chat:message', async (data) => {
      try {
        const { chatId, senderId, content } = data;
        
        let chat = await Chat.findById(chatId);
        
        if (!chat) {
          return;
        }

        chat.messages.push({
          sender: senderId,
          content,
        });
        chat.lastMessage = new Date();
        await chat.save();

        await chat.populate('messages.sender', 'username profilePicture');
        const message = chat.messages[chat.messages.length - 1];

        io.to(chatId).emit('chat:newMessage', message);

        // Send notification to other participants
        const recipientId = chat.participants.find(
          p => p.toString() !== senderId
        );
        
        await Notification.create({
          recipient: recipientId,
          sender: senderId,
          type: 'message',
        });

        const recipientSocketId = users.get(recipientId.toString());
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('notification:new', {
            type: 'message',
            senderId,
          });
        }
      } catch (err) {
        console.error('Socket error:', err);
      }
    });

    socket.on('disconnect', () => {
      if (socket.userId) {
        users.delete(socket.userId);
      }
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = socketHandler;