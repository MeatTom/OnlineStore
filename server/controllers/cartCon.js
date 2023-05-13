const { Cart, Tovar } = require('../models/db');

const addToCart = async (item) => {
    try {
        const { id } = item;
        const amount = 1;

        const existingCartItem = await Cart.findOne({
            where: { itemId: id },
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

module.exports = {
    addToCart,
    getCartItems,
    deleteCartItem,
    incrementCartItem,
    decrementCartItem,
};
