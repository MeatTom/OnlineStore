const { body } = require('express-validator');

const validatePlaceOrder = [
    body('deliveryTypeId')
        .notEmpty().withMessage('Тип доставки обязателен')
        .isInt().withMessage('Тип доставки должен быть числом'),
    body('paymentMethodId')
        .notEmpty().withMessage('Метод оплаты обязателен')
        .isInt().withMessage('Метод оплаты должен быть числом'),
    body('total_price')
        .notEmpty().withMessage('Общая цена обязательна')
        .isFloat({ gt: 0 }).withMessage('Общая цена должна быть положительным числом'),
    body('products')
        .isArray({ min: 1 }).withMessage('Продукты обязательны'),
    body('deliveryAddress').custom((value, { req }) => {
        if (req.body.deliveryTypeId === 2 && !value) {
            throw new Error('Адрес обязателен при доставке курьером');
        }
        return true;
    }).if(body('deliveryTypeId').equals(2)).isString().withMessage('Адрес доставки должен быть строкой'),
];

module.exports = {
    validatePlaceOrder,
};
