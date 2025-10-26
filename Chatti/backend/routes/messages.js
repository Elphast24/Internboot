const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/:chatId', protect, getMessages);
router.post('/', protect, upload.single('file'), sendMessage);

module.exports = router;