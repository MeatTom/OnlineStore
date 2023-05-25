const { DeliveryType, PaymentMethod, Order, OrderTovar, User, Tovar, Size } = require('../models/db');

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
    try {
        const { customerId, deliveryTypeId, paymentMethodId, deliveryAddress, total_price, products } = req.body;

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
            const orderTovarItem = {
                orderId,
                tovarId: itemId,
                amount,
                sizeId,
            };
            orderTovarItems.push(orderTovarItem);
        }

        const createdOrderTovars = await Promise.all(orderTovarItems.map(item => OrderTovar.findOrCreate({ where: item })));

        const productIds = createdOrderTovars.map(([orderTovar]) => orderTovar.id);
        await Order.update({ productIds }, { where: { id: orderId } });

        res.status(200).json({ message: 'Order placed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while placing the order.' });
    }
}




const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
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
            ],
        });

        res.status(200).json({ orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching user orders.' });
    }
};


module.exports = {
    getAllDeliveryTypes,
    getAllPaymentMethods,
    placeOrder,
    getUserOrders,
};
