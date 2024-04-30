const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./db');
const models = require('./models');
const cors = require("cors");
const { Op } = require("sequelize");

const app = express();
const PORT = 3051;

// Парсинг тела запроса в формате JSON
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());

// Маршрут для авторизации пользователя
app.post('/login', async (req, res) => {
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

    // Если пользователь найден, возвращаем успешный ответ
    if (user) {
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Запуск сервера
sequelize.sync({}).then(()=>{
    app.listen(PORT, ()=>(
        console.log("Сервер запущен. Порт: ", PORT)
    ))
})