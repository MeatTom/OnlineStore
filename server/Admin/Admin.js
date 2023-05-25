const AdminBro = require('admin-bro');
const AdminBroSequelize = require('@admin-bro/sequelize');
const AdminBroExpress = require('@admin-bro/express');
const { User, Tovar, Cart, Size, Stock, Order, OrderTovar, DeliveryType, PaymentMethod, sequelize } = require('../models/db');

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
    ],
    rootPath: '/admin',
});

const router = AdminBroExpress.buildRouter(adminBro);

module.exports = router;
