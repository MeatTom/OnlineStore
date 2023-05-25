const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderCon');


router.get('/delivery', orderController.getAllDeliveryTypes);

router.get('/payment', orderController.getAllPaymentMethods);

router.post('/order', orderController.placeOrder);
router.get('/orders/:userId', orderController.getUserOrders);

module.exports = router;