const { Cart, Tovar } = require('../models/db');

const addToCart = async (item) => {
    try {
        const { id } = item;
        const amount = 1;

        const existingCartItem = await Cart.findOne({
            where: { itemId: id},
        });

        if (existingCartItem) {
            const newAmount = existingCartItem.amount + 1;
            await existingCartItem.update({ amount: newAmount });
        } else {
            await Cart.create({ itemId: id, amount });
        }

        return { success: true, message: 'Товар добавлен в корзину.' };
    } catch (err) {
        console.error(err);
        return { success: false, error: 'Ошибка при добавлении товара в корзину.' };
    }
};


async function getCartItems() {
    try {
        const cartItems = await Cart.findAll({
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
        }));

        return items;
    } catch (error) {
        console.error(error);
    }
}

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
            throw new Error(`Cart item with id ${id} not found`);
        }

        if (cartItem.amount > 1) {
            await cartItem.update({ amount: cartItem.amount - 1 });
        } else {
            await Cart.destroy({ where: { id } });
        }
    } catch (error) {
        console.error(error);
        throw new Error('Failed to decrement cart item');
    }
};

const incrementCartItem = async (id) => {
    try {
        const cartItem = await Cart.findOne({ where: { id } });
        if (!cartItem) {
            throw new Error(`Cart item with id ${id} not found`);
        }
        await cartItem.update({ amount: cartItem.amount + 1 });
    } catch (error) {
        console.error(error);
        throw new Error('Failed to increment cart item');
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

        const existingCartItem = await Cart.findOne({ where: { itemId} });

        if (existingCartItem && existingCartItem.sizeId === sizeId) {
            res.send({ success: true, message: 'Размер товара уже сохранен в корзине.' });
            return;
        }

        if (existingCartItem) {
            await resetCartItemBySize(itemId, existingCartItem.sizeId);
            await existingCartItem.update({ sizeId });
            res.send({ success: true, message: 'Размер успешно изменен в корзине.' });
        } else {
            await Cart.create({ itemId, sizeId, amount: 1 });
            res.send({ success: true, message: 'Товар добавлен в корзину.'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: 'Ошибка при сохранении размера в корзине' });
    }
};



module.exports = {
    addToCart,
    getCartItems,
    deleteCartItem,
    incrementCartItem,
    decrementCartItem,
    saveSizeToCart
};
