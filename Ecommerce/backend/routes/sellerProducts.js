const express = require('express');
const sellerProductController = require('../controllers/sellerProductController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, sellerProductController.createProduct);
router.get('/', authMiddleware, sellerProductController.getSellerProducts);
router.get('/stats', authMiddleware, sellerProductController.getProductStats);
router.put('/:id', authMiddleware, sellerProductController.updateProduct);
router.delete('/:id', authMiddleware, sellerProductController.deleteProduct);

module.exports = router;