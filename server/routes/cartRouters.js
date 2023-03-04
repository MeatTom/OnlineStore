const cartController = require('../controllers/cartCon')
const express = require('express');
const router = express.Router();

router.post('/cart', async (req, res) => {
    const item = req.body;
    const addToCartResult = await cartController.addToCart(item);
    if (addToCartResult.success) {
        res.status(201).json(addToCartResult);
    } else {
        res.status(500).json(addToCartResult);
    }
});

router.get('/show_cart', async (req, res) => {
    try {
        const cartItems = await cartController.getCartItems();
        res.json(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/show_cart/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const success = await cartController.deleteCartItem(id);
        if (success) {
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/show_cart/decrement/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await cartController.decrementCartItem(id);
        res.status(200).json({ message: `Item with id ${id} has been decremented` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/show_cart/increment/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        await cartController.incrementCartItem(itemId);
        res.status(200).json({ message: `Item with id ${itemId} has been incremented` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;