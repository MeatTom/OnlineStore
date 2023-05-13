const express = require('express')
//const userRouter = require('./routes/userRouters')
const tovarRouter = require('./routes/tovarRouters')
const cartRouter = require('./routes/cartRouters')
const cors = require('cors');
require('dotenv').config()
const PORT = process.env.PORT
const app = express()

app.use('/image_storage', express.static('image_storage'));

app.options('*', cors())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    next();
});
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

//app.use(userRouter);
app.use(tovarRouter);
app.use(cartRouter);

//проверка работы сервера
app.listen(PORT, (err) => {
   if (err){
    return console.log(err);
   } 
   console.log('Server successfully started')
})








