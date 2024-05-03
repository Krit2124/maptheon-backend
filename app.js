const express = require('express');
const cors = require("cors");
const cookieParser = require('cookie-parser');

const { sequelize } = require('./db');
const router = require('./router/index');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);

// Запуск сервера
sequelize.sync({}).then(()=>{
    app.listen(PORT, ()=>(
        console.log("Сервер запущен. Порт: ", PORT)
    ))
})

// Маршрут для авторизации пользователя
// app.post('/login', async (req, res) => {
//     console.log('Запрос на авторизацию');
//     const { emailOrUsername, password } = req.body;

//     try {
//         // Поиск пользователя по электронной почте и паролю
//         const user = await models.User.findOne({
//             where: {
//                 [Op.or]: [
//                     { email: emailOrUsername },
//                     { username: emailOrUsername }
//                 ],
//                 password: password
//             }
//         });

//         // Если пользователь найден, возвращаем успешный ответ (дополнительная проверка для учёта регистра пароля)
//         if (user) {
//             if (user.password === password) {
//                 res.status(200).json({ message: 'Успешная авторизация' });
//             } 
//         }else {
//             res.status(401).json({ message: 'Неверные email (логин) или пароль'});
//         }
//     } catch (error) {
//         console.error('Ошибка при авторизации:', error);
//         res.status(500).json({ message: 'Ошибка на стороне сервера'});
//     }
// });