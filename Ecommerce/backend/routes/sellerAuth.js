const express = require('express');
const sellerAuthController = require('../controllers/sellerAuthController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', sellerAuthController.registerSeller);
router.post('/login', sellerAuthController.loginSeller);
router.get('/profile', authMiddleware, sellerAuthController.getSellerProfile);
router.put('/profile', authMiddleware, sellerAuthController.updateSellerProfile);

module.exports = router;