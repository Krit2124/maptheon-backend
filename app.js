const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./db');
const models = require('./models');
const cors = require("cors");
const { Op } = require("sequelize");

const app = express();
const PORT = 3051;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());

// Маршрут для авторизации пользователя
app.post('/login', async (req, res) => {
    console.log('Запрос на авторизацию');
    const { emailOrUsername, password } = req.body;

    try {
        // Поиск пользователя по электронной почте и паролю
        const user = await models.User.findOne({
            where: {
                [Op.or]: [
                    { email: emailOrUsername },
                    { username: emailOrUsername }
                ],
                password: password
            }
        });

        // Если пользователь найден, возвращаем успешный ответ (дополнительная проверка для учёта регистра пароля)
        if (user) {
            if (user.password === password) {
                res.status(200).json({ message: 'Успешная авторизация' });
            } 
        }else {
            res.status(401).json({ message: 'Неверные email (логин) или пароль'});
        }
    } catch (error) {
        console.error('Ошибка при авторизации:', error);
        res.status(500).json({ message: 'Ошибка на стороне сервера'});
    }
});

// Запуск сервера
sequelize.sync({}).then(()=>{
    app.listen(PORT, ()=>(
        console.log("Сервер запущен. Порт: ", PORT)
    ))
})