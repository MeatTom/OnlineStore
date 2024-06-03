const { DeliveryType, PaymentMethod, Order, Status, OrderTovar, Tovar, Size, Stock, Cart } = require('../models/db');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;
const { validationResult } = require('express-validator');

const getAllDeliveryTypes = async (req, res) => {
    try {
        const deliveryTypes = await DeliveryType.findAll();
        res.json(deliveryTypes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllPaymentMethods = async (req, res) => {
    try {
        const paymentMethods = await PaymentMethod.findAll();
        res.json(paymentMethods);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

async function placeOrder(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const { deliveryTypeId, paymentMethodId, deliveryAddress, total_price, products } = req.body;

        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        if (!token) {
            return res.status(403).json({ error: 'У Вас нет доступа' });
        }

        const decoded = jwt.verify(token, process.env.SECRET);
        const customerId = decoded.userId;

        const order = await Order.create({
            customerId,
            deliveryTypeId,
            paymentMethodId,
            delivery_address: deliveryAddress,
            total_price,
        });

        const orderId = order.id;
        const orderTovarItems = [];

        for (const product of products) {
            const { itemId, amount, sizeId } = product;

            const stockItem = await Stock.findOne({ where: { itemId, sizeId } });
            if (!stockItem) {
                return res.status(400).json({ error: `Товар с ID ${itemId} и размером ${sizeId} не найден на складе` });
            }

            if (stockItem.quantity < amount) {
                return res.status(400).json({ error: `Недостаточно товара на складе для ID ${itemId} и размером ${sizeId}` });
            }

            stockItem.quantity -= amount;
            await stockItem.save();

            const orderTovarItem = {
                orderId,
                tovarId: itemId,
                amount,
                sizeId,
            };
            orderTovarItems.push(orderTovarItem);
        }

        await OrderTovar.bulkCreate(orderTovarItems);

        const createdOrderTovars = await OrderTovar.findAll({
            where: { orderId }
        });

        const productIds = createdOrderTovars.map(orderTovar => orderTovar.id);
        await Order.update({ productIds }, { where: { id: orderId } });

        await Cart.destroy({ where: { userId: customerId } });

        res.status(200).json({ message: 'Заказ оформлен успешно.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Во время оформления заказа возникла ошибка.' });
    }
}



const getUserOrders = async (req, res) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

        if (!token) {
            return res.status(401).json({ message: 'У Вас нет доступа' });
        }

        const decoded = jwt.verify(token, SECRET);
        const userId = decoded.userId;

        if (!userId) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        const orders = await Order.findAll({
            where: { customerId: userId },
            include: [
                {
                    model: OrderTovar,
                    as: 'orderTovars',
                    include: [
                        {
                            model: Tovar,
                            as: 'tovar',
                            attributes: ['name'],
                        },
                        {
                            model: Size,
                            as: 'size',
                            attributes: ['size_name'],
                        },
                    ],
                    attributes: ['amount'],
                },
                {
                    model: Status,
                    as: 'Status',
                    attributes: ['name'],
                },
            ],
        });

        res.status(200).json({ orders });
    } catch (error) {
        console.error(error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Недействительный токен' });
        }
        res.status(500).json({ message: 'Произошла ошибка при получении заказов пользователя.' });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Заказ не найден' });
        }

        if (order.statusId === 3) {
            return res.status(400).json({ message: 'Заказ уже отменен' });
        }

        await order.update({ statusId: 3 });

        res.status(200).json({ message: 'Заказ успешно отменен' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Произошла ошибка при отмене заказа' });
    }
};



module.exports = {
    getAllDeliveryTypes,
    getAllPaymentMethods,
    placeOrder,
    getUserOrders,
    cancelOrder
};
