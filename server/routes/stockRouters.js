const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockCon');

router.get('/stock', stockController.getStockItems);
router.get('/stock/item/:itemId', stockController.getStockItem);
router.post('/stock/add', stockController.addToStock);
router.put('/stock/update/:id', stockController.updateStockItem);
router.delete('/stock/delete/:id', stockController.deleteStockItem);
router.get('/stock/check_quantity/:itemId/:sizeId', stockController.check_quantity);

module.exports = router;
