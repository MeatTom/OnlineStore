const express = require('express')
const router = require('./routes/userRouters')
require('dotenv').config()
const PORT = process.env.PORT
const app = express()

app.use(express.json())
app.use(router);

//проверка работы сервера
app.listen(PORT, (err) => {
   if (err){
    return console.log(err);
   } 
   console.log('Server successfully started')
})







