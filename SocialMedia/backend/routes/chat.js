const express = require('express');
const auth = require('../middleware/auth');
const {
  getChats,
  getChat,
  createChat,
  deleteChat,
} = require('../controllers/chatController');

const router = express.Router();

router.get('/', auth, getChats);
router.get('/:id', auth, getChat);
router.post('/', auth, createChat);
router.delete('/:id', auth, deleteChat);

module.exports = router;
