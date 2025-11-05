const express = require('express');
const sellerOrderController = require('../controllers/sellerOrderController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, sellerOrderController.getSellerOrders);
router.put('/:id/status', authMiddleware, sellerOrderController.updateOrderStatus);
router.get('/dashboard/stats', authMiddleware, sellerOrderController.getSellerDashboard);

module.exports = router;