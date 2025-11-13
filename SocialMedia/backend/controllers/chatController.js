const Chat = require('../models/Chat');
const User = require('../models/User');

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
    })
      .populate('participants', 'username profilePicture')
      .populate('messages.sender', 'username profilePicture')
      .sort({ lastMessage: -1 });

    // Filter out current user from participants
    const formattedChats = chats.map(chat => ({
      ...chat.toObject(),
      participants: chat.participants.filter(
        p => p._id.toString() !== req.user._id.toString()
      ),
    }));

    res.json(formattedChats);
  } catch (err) {
    console.error('Error in getChats:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      participants: req.user._id,
    })
      .populate('participants', 'username profilePicture')
      .populate('messages.sender', 'username profilePicture');

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Filter out current user from participants
    const formattedChat = {
      ...chat.toObject(),
      participants: chat.participants.filter(
        p => p._id.toString() !== req.user._id.toString()
      ),
    };

    res.json(formattedChat);
  } catch (err) {
    console.error('Error in getChat:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createChat = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if user exists
    const otherUser = await User.findById(userId);
    if (!otherUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, userId] },
    })
      .populate('participants', 'username profilePicture')
      .populate('messages.sender', 'username profilePicture');

    if (chat) {
      return res.json(chat);
    }

    // Create new chat
    chat = await Chat.create({
      participants: [req.user._id, userId],
      messages: [],
    });

    await chat.populate('participants', 'username profilePicture');

    res.status(201).json(chat);
  } catch (err) {
    console.error('Error in createChat:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({
      _id: req.params.id,
      participants: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.json({ message: 'Chat deleted' });
  } catch (err) {
    console.error('Error in deleteChat:', err);
    res.status(500).json({ error: err.message });
  }
};