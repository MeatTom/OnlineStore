const express = require('express');
const router = express.Router();
const sizeController = require('../controllers/sizeCon');

router.get('/sizes', sizeController.getAllSizes);
router.get('/sizes/:id', sizeController.getSize);
router.post('/size/add', sizeController.addSize);
router.put('/size/update/:id', sizeController.updateSize);
router.delete('/size/delete/:id', sizeController.deleteSize);

module.exports = router;
