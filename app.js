require('dotenv').config()
const express = require('express');
const cors = require("cors");
const cookieParser = require('cookie-parser');

const { sequelize } = require('./db');
const router = require('./router/index');
const errorMiddleware = require('./middlewares/error-middleware');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json({limit: '500mb'}));
app.use(express.urlencoded({limit: '500mb'}));
app.use(express.static('public'))
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use(router);
app.use(errorMiddleware);

// Запуск сервера
sequelize.sync({}).then(()=>{
    app.listen(PORT, ()=>(
        console.log("Сервер запущен. Порт: ", PORT)
    ))
})