const cartController = require('../controllers/cartCon')
const express = require('express');
const router = express.Router();

router.post('/cart', async (req, res) => {
    try {
        const item = req.body;
        const token = req.headers.authorization; // Получаем токен из заголовка
        const addToCartResult = await cartController.addToCart(item, token); // Передаем токен в контроллер
        if (addToCartResult.success) {
            res.status(201).json(addToCartResult);
        } else {
            res.status(500).json(addToCartResult);
        }
    } catch (error) {
        console.error('Ошибка при обработке запроса на добавление в корзину:', error);
        res.status(500).json({ success: false, error: 'Внутренняя ошибка сервера' });
    }
});


router.get('/show_cart', async (req, res) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        if (!token) {
            return res.status(403).json({ error: 'У Вас нет доступа' });
        }
        const cartItems = await cartController.getCartItems(token);
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
            return res.status(200).json({ message: 'Товар успешно удалён из корзины' });
        } else {
            return res.status(404).json({ message: 'Товар с введённым id не найден' });
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
        res.status(200).json({ message: `Количество товара было успешно уменьшено` });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

router.put('/show_cart/increment/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        await cartController.incrementCartItem(itemId);
        res.status(200).json({ message: `Количество товара было успешно увеличено` });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

router.post("/cart/size", cartController.saveSizeToCart);

router.delete("/cart/clear", async (req, res) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        if (!token) {
            return res.status(403).json({ error: 'У Вас нет доступа' });
        }
        const success = await cartController.clearCartForUser(token);
        if (success) {
            return res.status(200).json({ message: 'Корзина успешно очищена' });
        } else {
            return res.status(404).json({ message: 'Возникла ошибка при очистке корзины' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;