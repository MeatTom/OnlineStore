const pool = require('../models/db');

const addToCart = async (item) => {
    try {
        const { id } = item;
        const amount = 1;

        const existingCartItem = await pool.query(
            'SELECT * FROM online_store.cart WHERE itemId = $1',
            [id]
        );

        if (existingCartItem.rowCount > 0) {
            const newAmount = existingCartItem.rows[0].amount + 1;
            await pool.query(
                'UPDATE online_store.cart SET amount = $1 WHERE itemId = $2',
                [newAmount, id]
            );
        } else {
            await pool.query(
                'INSERT INTO online_store.cart (itemId, amount) VALUES ($1, $2)',
                [id, amount]
            );
        }

        return { success: true, message: 'Товар добавлен в корзину.' };
    } catch (err) {
        console.error(err);
        return { success: false, error: 'Ошибка при добавлении товара в корзину.' };
    }
};

async function getCartItems() {
    try {
        const cartItems = await pool.query(`
      SELECT * FROM online_store.cart
      JOIN online_store.tovar ON cart.itemId = tovar.id
    `);
        const items = cartItems.rows.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image,
            amount: item.amount,
        }));

        return items;
    } catch (error) {
        console.error(error);
    }
}

async function deleteCartItem(id) {
    try {
        const result = await pool.query(
            'DELETE FROM online_store.cart WHERE itemId = $1',
            [id]
        );
        return result.rowCount > 0;
    } catch (error) {
        console.error(error);
        return false;
    }
}

const decrementCartItem = async (itemId) => {
    try {
        const client = await pool.connect();
        await client.query('BEGIN');
        const result = await client.query('UPDATE online_store.cart SET amount = amount - 1 WHERE itemId = $1 RETURNING amount', [itemId]);
        if (result.rowCount === 0) {
            throw new Error(`Cart item with id ${itemId} not found`);
        } else if (result.rows[0].amount === 0) {
            await client.query('DELETE FROM online_store.cart WHERE itemId = $1', [itemId]);
        }
        await client.query('COMMIT');
        client.release();
    } catch (error) {
        console.error(error);
        throw new Error('Failed to decrement cart item');
    }
};

const incrementCartItem = async (itemId) => {
    try {
        const client = await pool.connect();
        await client.query('BEGIN');
        const result = await client.query('UPDATE online_store.cart SET amount = amount + 1 WHERE itemId = $1 RETURNING amount', [itemId]);
        if (result.rowCount === 0) {
            throw new Error(`Cart item with id ${itemId} not found`);
        }
        await client.query('COMMIT');
        client.release();
    } catch (error) {
        console.error(error);
        throw new Error('Failed to increment cart item');
    }
};


module.exports = {addToCart, getCartItems, deleteCartItem, incrementCartItem, decrementCartItem}


