const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderCon');
const { validatePlaceOrder } = require('../validation/order');

router.get('/delivery', orderController.getAllDeliveryTypes);

router.get('/payment', orderController.getAllPaymentMethods);

router.post('/order', validatePlaceOrder, orderController.placeOrder);

router.get('/orders', orderController.getUserOrders);

router.patch('/cancel-order/:orderId', orderController.cancelOrder);

module.exports = router;