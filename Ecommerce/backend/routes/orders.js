const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authMiddleware, orderController.createOrder);
router.get('/', authMiddleware, orderController.getUserOrders);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.put('/:id/status', authMiddleware, roleMiddleware(['admin']), orderController.updateOrderStatus);

module.exports = router;