const bcrypt = require('bcrypt');
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const TokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const tokenService = require('./token-service');

module.exports = new class UserService {
    async registration(username, email, password) {
        const userWithSameEmail = await User.findOne({ where: { email } });
        if (userWithSameEmail) {
            throw ApiError.BadRequest('Пользователь с таким email уже существует');
        }

        const userWithSameUsername = await User.findOne({ where: { username } });
        if (userWithSameUsername) {
            throw ApiError.BadRequest('Пользователь с таким именем уже существует');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ 
            username: username, 
            email: email, 
            password: hashedPassword,
            id_access_type: 2,
            is_banned: false,
        });

        const userDto = new UserDto(user);
        const tokens = TokenService.generateTokens({...userDto});
        await TokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }

    async login(emailOrUsername, password) {
        const user  = await User.findOne({ 
            where: {
                [Op.or]: [
                    { email: emailOrUsername },
                    { username: emailOrUsername }
                ]
            }
        });
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким именем или email не найден');
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw ApiError.BadRequest('Неверный пароль');
        }

        const userDto = new UserDto(user);
        const tokens = TokenService.generateTokens({...userDto});
        console.log('tokens: ', tokens);
        await TokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        const token = await TokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        console.log('refresh: ', refreshToken);

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await TokenService.findToken(refreshToken);
        if (!userData || !tokenFromDB) {
            throw ApiError.UnauthorizedError();
        }

        const user = await User.findByPk(userData.id);
        const userDto = new UserDto(user);
        
        const tokens = TokenService.generateTokens({...userDto});
        await TokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }

    getUserIdFromRequest(req) {
        const authorizationHeader = req.headers.authorization;
        const accessToken = authorizationHeader.split(' ')[1];
        const decodedToken = jwt.decode(accessToken);
        return decodedToken.id;
    }

    async getUserProfileInfo(id_user) {
        const user = await User.findByPk(id_user);

        return {
            id: user.id,
            username: user.username,
            description: user.description,
        }
    }
}