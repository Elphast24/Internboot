const express = require('express');
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, cartController.getCart);
router.post('/add', authMiddleware, cartController.addToCart);
router.put('/update', authMiddleware, cartController.updateCartItem);
router.delete('/clear', authMiddleware, cartController.clearCart);

module.exports = router;