const Message = require('../models/Message');
const User = require('../models/User');
const Chat = require('../models/Chat');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// @desc    Get all messages for a chat
// @route   GET /api/messages/:chatId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name avatar email')
      .populate('chat');

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Send message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;

    if (!chatId) {
      return res.status(400).json({ message: 'Chat ID is required' });
    }

    let messageData = {
      sender: req.user._id,
      chat: chatId,
    };

    // Handle file upload if present
    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'chat-app',
        resource_type: 'auto',
      });

      messageData.fileUrl = result.secure_url;
      messageData.fileName = req.file.originalname;
      messageData.fileType = req.file.mimetype.startsWith('image/')
        ? 'image'
        : 'file';
      messageData.content = content || 'Sent a file';

      // Delete local file after upload
      fs.unlinkSync(req.file.path);
    } else {
      if (!content) {
        return res.status(400).json({ message: 'Message content is required' });
      }
      messageData.content = content;
      messageData.fileType = 'text';
    }

    let message = await Message.create(messageData);

    message = await message.populate('sender', 'name avatar');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name avatar email',
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message._id,
    });

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMessages,
  sendMessage,
};