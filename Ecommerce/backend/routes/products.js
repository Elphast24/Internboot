const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', authMiddleware, roleMiddleware(['admin']), productController.createProduct);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), productController.updateProduct);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), productController.deleteProduct);

module.exports = router;