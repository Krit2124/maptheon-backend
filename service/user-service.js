const bcrypt = require('bcrypt');

const User = require('../models/user');
const TokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');

class UserService {
    async registration(username, email, password) {
        const userWithSameEmail = await User.findOne({ where: { email } });
        if (userWithSameEmail) {
            throw new Error('Пользователь с таким email уже существует');
        }

        const userWithSameUsername = await User.findOne({ where: { username } });
        if (userWithSameUsername) {
            throw new Error('Пользователь с таким именем уже существует');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });

        const userDto = new UserDto(user);
        const tokens = TokenService.generateTokens({...UserDto});
        await TokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }
}

module.exports = new UserService();