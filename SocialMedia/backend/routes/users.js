const express = require('express');
const auth = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const {
  getProfile,
  updateProfile,
  followUser,
  searchUsers,
} = require('../controllers/userController');

const router = express.Router();

router.get('/search', auth, searchUsers);
router.get('/:id', auth, getProfile);
router.put('/profile', auth, upload.single('profilePicture'), updateProfile);
router.put('/:id/follow', auth, followUser);

module.exports = router;