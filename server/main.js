const express = require('express')

const userRouter = require('./routes/userRouters')
const tovarRouter = require('./routes/tovarRouters')
const cartRouter = require('./routes/cartRouters')
const sizeRouter = require('./routes/sizeRouters')
const stockRouter = require('./routes/stockRouters')
const favoriteRouter = require('./routes/favoriteRouters')
const orderRouter = require('./routes/orderRouters')

const adminRouter = require('./Admin/Admin')

const cors = require('cors');

const PORT = process.env.PORT
const app = express()

require('dotenv').config()
require('./cronJobs/cronJobs')

app.use('/image_storage', express.static('image_storage'));

app.options('*', cors())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    next();
});
app.use(cors());
app.use(express.json());



app.use(userRouter);
app.use(tovarRouter);
app.use(cartRouter);
app.use(sizeRouter);
app.use(stockRouter);
app.use(orderRouter);
app.use(favoriteRouter);

app.use('/admin', adminRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    if (!res.headersSent) {
        res.status(500).send('Что-то пошло не так!');
    } else {
        next(err);
    }
});

app.listen(PORT, (err) => {
    if (err){
        return console.log(err);
    }
    console.log(`Сервер успешно запущен на порте: ${PORT}`);
});







