import express from 'express';
import Chat from '../models/chat.js';
import User from '../models/user.js';
import Message from '../models/message.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Get all chats for current user
router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({ 
      users: { $elemMatch: { $eq: req.user._id } } 
    })
    .populate('users', '-password')
    .populate('groupAdmin', '-password')
    .populate('latestMessage')
    .sort({ updatedAt: -1 });

    // Populate latest message sender
    const populatedChats = await User.populate(chats, {
      path: 'latestMessage.sender',
      select: 'username profilePic'
    });

    res.json(populatedChats);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or access one-on-one chat
router.post('/personal', auth, async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { 
        $all: [req.user._id, userId],
        $size: 2
      }
    })
    .populate('users', '-password')
    .populate('latestMessage');

    if (chat) {
      return res.json(chat);
    }

    // Create new chat
    chat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId]
    });

    const populatedChat = await Chat.findById(chat._id)
      .populate('users', '-password');

    res.status(201).json(populatedChat);
  } catch (error) {
    console.error('Create personal chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create group chat
router.post('/group', auth, async (req, res) => {
  try {
    const { chatName, users } = req.body;

    if (!chatName || !users) {
      return res.status(400).json({ message: 'Chat name and users are required' });
    }

    if (users.length < 2) {
      return res.status(400).json({ message: 'Group chat must have at least 2 users' });
    }

    // Add current user to users array
    users.push(req.user._id);

    const groupChat = await Chat.create({
      chatName,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user._id
    });

    const populatedChat = await Chat.findById(groupChat._id)
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(201).json(populatedChat);
  } catch (error) {
    console.error('Create group chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a chat
router.get('/:chatId/messages', auth, async (req, res) => {
  try {
    const messages = await Message.find({ 
      chat: req.params.chatId 
    })
    .populate('sender', 'username profilePic')
    .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;