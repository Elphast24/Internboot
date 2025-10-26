const Chat = require('../models/Chat');
const User = require('../models/User');
const Message = require('../models/Message');

// @desc    Access or create one-to-one chat
// @route   POST /api/chats
// @access  Private
const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'UserId param not sent' });
    }

    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate('users', '-password')
      .populate('latestMessage');

    isChat = await User.populate(isChat, {
      path: 'latestMessage.sender',
      select: 'name avatar email',
    });

    if (isChat.length > 0) {
      res.json(isChat[0]);
    } else {
      const chatData = {
        chatName: 'sender',
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        'users',
        '-password'
      );

      res.status(201).json(fullChat);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Fetch all chats for a user
// @route   GET /api/chats
// @access  Private
const fetchChats = async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: 'latestMessage.sender',
      select: 'name avatar email',
    });

    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create group chat
// @route   POST /api/chats/group
// @access  Private
const createGroupChat = async (req, res) => {
  try {
    if (!req.body.users || !req.body.name) {
      return res.status(400).json({ message: 'Please fill all the fields' });
    }

    let users = JSON.parse(req.body.users);

    if (users.length < 2) {
      return res
        .status(400)
        .json({ message: 'More than 2 users are required to form a group' });
    }

    users.push(req.user._id);

    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(201).json(fullGroupChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Rename group
// @route   PUT /api/chats/group/rename
// @access  Private
const renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!updatedChat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(updatedChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add user to group
// @route   PUT /api/chats/group/add
// @access  Private
const addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!added) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(added);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove user from group
// @route   PUT /api/chats/group/remove
// @access  Private
const removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!removed) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(removed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};