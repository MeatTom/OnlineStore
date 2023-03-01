const tovarController = require('../controllers/tovarCon')
const express = require('express');
const router = express.Router();

router.get('/tovars', tovarController.getAllTovars)
router.get('/tovar/:id', tovarController.getTovar)
router.post('/tovars/addTovar', tovarController.addProduct)
router.put('/tovars/info/:id', tovarController.updateProductInfo)
router.put('/tovars/image/:id', tovarController.updateProductImage)
router.delete('/tovars/:id', tovarController.deleteTovar)

module.exports = router;