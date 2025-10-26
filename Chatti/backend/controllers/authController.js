const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Generate Avatar URL
const generateAvatar = (seed) => {
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters' 
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });

    if (userExists) {
      return res.status(400).json({ 
        message: 'User already exists with this email' 
      });
    }

    // Generate avatar using DiceBear if not provided
    const userAvatar = avatar || generateAvatar(name);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      avatar: userAvatar,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ 
        message: 'Invalid user data' 
      });
    }
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: error.message 
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: error.message 
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    res.json(user);
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

// @desc    Search users
// @route   GET /api/auth/users?search=
// @access  Private
const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
          ],
        }
      : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    
    res.json(users);
  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  searchUsers,
};