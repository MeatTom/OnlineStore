const { Cart, Tovar , Stock} = require('../models/db');
const jwt = require('jsonwebtoken');

const verifyAuthToken = (token, res) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        return decoded.userId;
    } catch (error) {
        throw new Error('Неверный токен');
    }
};

const addToCart = async (item, req) => {
    try {
        
        const { id } = item;
        const amount = 1;

        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

        const userId = verifyAuthToken(token);

        const existingCartItem = await Cart.findOne({
            where: { itemId: id, userId: userId },
        });

        if (existingCartItem) {
            const newAmount = existingCartItem.amount + 1;
            await existingCartItem.update({ amount: newAmount });
        } else {
            await Cart.create({ itemId: id, amount, userId });
        }

        return { success: true, message: 'Товар добавлен в корзину.' };
    } catch (err) {
        console.error(err);
        return { success: false, error: 'Ошибка при добавлении товара в корзину.' };
    }
};

const getCartItems = async (token, res) => {
    try {

        const userId = verifyAuthToken(token);



        const cartItems = await Cart.findAll({
            where: { userId },
            include: { model: Tovar },
        });

        const items = cartItems.map((item) => ({
            id: item.id,
            name: item.Tovar.name,
            description: item.Tovar.description,
            price: item.Tovar.price,
            image: item.Tovar.image,
            amount: item.amount,
            sizeId: item.sizeId,
            itemId: item.itemId,
            createdAt: item.createdAt
        }));

        return items;
    } catch (error) {
        console.error(error);
        throw new Error('Не удалось получить данные корзины');
    }
};

async function deleteCartItem(id) {
    try {
        const result = await Cart.destroy({
            where: { id },
        });
        return result > 0;
    } catch (error) {
        console.error(error);
        return false;
    }
}

const decrementCartItem = async (id) => {
    try {
        const cartItem = await Cart.findOne({ where: { id } });
        if (!cartItem) {
            const error = new Error(`Запись с id = ${id} в корзине не найдена`);
            error.statusCode = 404;
            throw error;
        }
        await cartItem.update({ amount: cartItem.amount - 1 });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
            error.message = 'Не удалось уменьшить количество товара';
        }
        throw error;
    }
};

const incrementCartItem = async (id) => {
    try {
        const cartItem = await Cart.findOne({ where: { id } });
        if (!cartItem) {
            const error = new Error(`Запись с id = ${id} в корзине не найдена`);
            error.statusCode = 404;
            throw error;
        }
        await cartItem.update({ amount: cartItem.amount + 1 });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
            error.message = 'Не удалось увеличить количество товара';
        }
        throw error;
    }
};

const resetCartItemBySize = async (itemId, sizeId) => {
    try {
        const cartItem = await Cart.findOne({ where: { itemId, sizeId } });
        if (!cartItem) {
            throw new Error(`Cart item with itemId ${itemId} and sizeId ${sizeId} not found`);
        }
        await cartItem.update({ amount: 1 });
    } catch (error) {
        console.error(error);
        throw new Error('Failed to reset cart item by size');
    }
};

const saveSizeToCart = async (req, res) => {
    try {
        const { itemId, sizeId } = req.body;
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        if (!token) {
            return res.status(401).json({ message: 'Токен не предоставлен' });
        }
        const userId = verifyAuthToken(token);

        const stockItem = await Stock.findOne({ where: { itemId, sizeId } });

        if (!stockItem) {
            res.status(404).send({ success: false, error: 'Товара нет на складе.' });
            return;
        }

        const availableQuantity = stockItem.quantity;

        const existingCartItem = await Cart.findOne({ where: { itemId, sizeId, userId } });

        if (existingCartItem) {
            if (existingCartItem.amount + 1 > availableQuantity) {
                res.status(400).send({ success: false, error: 'Нельзя добавить больше товара, чем доступно на складе.' });
                return;
            }
            await existingCartItem.update({ amount: existingCartItem.amount + 1 });
            res.send({ success: true, message: 'Количество товара в корзине увеличено.' });
        } else {
            if (1 > availableQuantity) {
                res.status(400).send({ success: false, error: 'Нельзя добавить больше товара, чем доступно на складе.' });
                return;
            }
            await Cart.create({ itemId, sizeId, amount: 1, userId });
            res.send({ success: true, message: 'Товар добавлен в корзину.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: 'Ошибка при сохранении размера в корзине' });
    }
};

const clearCartForUser = async (token) => {

    const userId = verifyAuthToken(token);

    if (!token) {
        return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    try {
        await Cart.destroy({
            where: { userId }
        });

        return { success: true, message: 'Корзина пользователя очищена успешно.' };
    } catch (error) {
        console.error(error);
        throw new Error('Ошибка при очистке корзины пользователя');
    }
};

module.exports = {
    addToCart,
    getCartItems,
    deleteCartItem,
    incrementCartItem,
    decrementCartItem,
    saveSizeToCart,
    clearCartForUser
};
