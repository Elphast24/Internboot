const express = require('express');
const auth = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const {
  createPost,
  getFeed,
  likePost,
  commentOnPost,
  deletePost,
} = require('../controllers/postController');

const router = express.Router();

router.post('/', auth, upload.single('image'), createPost);
router.get('/feed', auth, getFeed);
router.put('/:id/like', auth, likePost);
router.post('/:id/comment', auth, commentOnPost);
router.delete('/:id', auth, deletePost);

module.exports = router;