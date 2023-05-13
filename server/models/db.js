const { Sequelize } = require ('sequelize')
const { DataTypes } = require ('sequelize')

const sequelize = new Sequelize('socks_store', 'postgres', 'mitron16', {
    host: 'localhost',
    dialect: 'postgres',
});

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

const Tovar = sequelize.define('Tovars', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    image: {
        type: DataTypes.TEXT,
    },
});

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Tovar,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
});

Tovar.hasMany(Cart, { foreignKey: 'itemId' });
Cart.belongsTo(Tovar, { foreignKey: 'itemId' });

User.sync().then(() => {
    console.log('Table users created successfully');
});

Tovar.sync().then(() => {
    console.log('Table tovar created successfully');
});

Cart.sync().then(() => {
    console.log('Table cart created successfully');
});

module.exports = { User, Tovar, Cart };