const jwt = require('jsonwebtoken');
const Token = require('../models/token');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
        return { accessToken, refreshToken };
    }

    validateAccessToken(token) {
        try {
           const userData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
           return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
            return userData;
         } catch (e) {
            return null;
        }
    }

    async saveToken(id_user, refreshToken) {
        const existingToken = await Token.findOne({ 
            where: {
                id_user: id_user,
            } 
        });
        if (existingToken) {
            existingToken.refresh_token = refreshToken;
            return existingToken.save();
        }
        const newToken = await Token.create({ id_user, refresh_token: refreshToken });
        return newToken;
    }

    async removeToken(refreshToken) {
        const tokenData = await Token.destroy({
            where: {
                refresh_token: refreshToken
            }
        });
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await Token.findOne({
            where: {
                refresh_token: refreshToken
            }
        });
        return tokenData;
    }
}

module.exports = new TokenService();