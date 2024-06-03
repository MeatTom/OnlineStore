const AdminBro = require('admin-bro');
const AdminBroSequelize = require('@admin-bro/sequelize');
const AdminBroExpress = require('@admin-bro/express');
require('dotenv').config()
const { check, validationResult } = require('express-validator');
const { User, Tovar, Cart, Size, Stock, Order, OrderTovar, DeliveryType, PaymentMethod, sequelize, VerificationCode, Favorite, Status } = require('../models/db');

AdminBro.registerAdapter(AdminBroSequelize);

const adminBro = new AdminBro({
    databases: [sequelize],
    resources: [
        {resource: User},
        {resource: Tovar},
        {resource: Cart},
        {resource: Size},
        {resource: Stock},
        {resource: Order},
        {resource: OrderTovar},
        {resource: DeliveryType},
        {resource: PaymentMethod},
        {resource: VerificationCode},
        {resource: Favorite},
        {resource: Status},
    ],
    rootPath: '/admin',
    branding: {
        theme: {
            colors: {
                background: '#a2d4df',
                primary100: '#ea9682',
            },
        },
        companyName: "SocksHeaven",
        softwareBrothers: false,
    },
});

const ADMIN = {
    email: process.env.ADMIN_EMAIL ,
    password: process.env.ADMIN_PASSWORD ,
}

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
        const validateCredentials = [
            check('email')
                .isEmail().withMessage('Введите корректный email')
                .normalizeEmail().trim().escape(),
            check('password')
                .isLength({ min: 5 }).withMessage('Пароль должен содержать минимум 8 символов')
                .matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/).withMessage('Пароль содержит недопустимые символы')
                .trim().escape()
        ];
        const errors = validationResult(validateCredentials);
        if (!errors.isEmpty()) {
            return null
        }
        if (email === ADMIN.email && password === ADMIN.password) {
            return ADMIN
        }
        return null
    },
    cookiePassword: 'some-secret-password-used-to-secure-cookie',
});
module.exports = router;
