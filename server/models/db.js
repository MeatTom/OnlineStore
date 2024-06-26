const { Sequelize } = require('sequelize');
const { DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
    }
);

const VerificationCode = sequelize.define('VerificationCode', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
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
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
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

const Size = sequelize.define('Size', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    size_name: {
        type: DataTypes.STRING,
        allowNull: false,
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
        allowNull: true,
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
    sizeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Size,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
});

const Stock = sequelize.define('Stock', {
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
    sizeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Size,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
});

const DeliveryType = sequelize.define('DeliveryType', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

const PaymentMethod = sequelize.define('PaymentMethod', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

const Status = sequelize.define('Status', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    deliveryTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: DeliveryType,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    paymentMethodId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PaymentMethod,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    delivery_address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    productIds: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
    },
    statusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        references: {
            model: Status,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
});

const OrderTovar = sequelize.define('OrderTovar', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Order,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    tovarId: {
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
    sizeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Size,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
});

const Favorite = sequelize.define('Favorite', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
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
});

Size.hasMany(Stock, { foreignKey: 'sizeId' });
Size.hasMany(OrderTovar, { foreignKey: 'sizeId' });
Stock.belongsTo(Size, { foreignKey: 'sizeId' });
Tovar.hasMany(Cart, { foreignKey: 'itemId' });
Cart.belongsTo(Tovar, { foreignKey: 'itemId' });
User.hasMany(Order, { foreignKey: 'customerId' });
Order.belongsTo(User, { foreignKey: 'customerId' });
DeliveryType.hasMany(Order, { foreignKey: 'deliveryTypeId' });
Order.belongsTo(DeliveryType, { foreignKey: 'deliveryTypeId' });
PaymentMethod.hasMany(Order, { foreignKey: 'paymentMethodId' });
Order.belongsTo(PaymentMethod, { foreignKey: 'paymentMethodId' });
Order.belongsToMany(Tovar, { through: 'OrderTovar',  foreignKey: 'orderId'});
Tovar.belongsToMany(Order, { through: 'OrderTovar', foreignKey: 'tovarId' });
Order.hasMany(OrderTovar, { as: 'orderTovars', foreignKey: 'orderId' });
OrderTovar.belongsTo(Order, { foreignKey: 'orderId' });
OrderTovar.belongsTo(Tovar, { as: 'tovar', foreignKey: 'tovarId' });
OrderTovar.belongsTo(Size, { foreignKey: 'sizeId', as: 'size' });
User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Favorite, { foreignKey: 'userId' });
Favorite.belongsTo(User, { foreignKey: 'userId' });
Tovar.hasMany(Favorite, { foreignKey: 'itemId' });
Favorite.belongsTo(Tovar, { foreignKey: 'itemId' });
Order.belongsTo(Status, { foreignKey: 'statusId' });

sequelize.sync().then(() => {
    console.log('Все модели синхронизированы успешно.');
}).catch(error => {
    console.error('При синхронизации БД возникла ошибка:', error);
});


module.exports = {
    User,
    Tovar,
    Cart,
    Size,
    Stock,
    DeliveryType,
    PaymentMethod,
    Order,
    OrderTovar,
    sequelize,
    VerificationCode,
    Favorite,
    Status
};
