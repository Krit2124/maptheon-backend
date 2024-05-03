const jwt = require('jsonwebtoken');
const Token = require('../models/token');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
        return { accessToken, refreshToken };
    }

    async saveToken(id_user, refreshToken) {
        const existingToken = await Token.findOne({ id_user });
        if (existingToken) {
            existingToken.refreshToken = refreshToken;
            return existingToken.save();
        }
        const newToken = await Token.create({ id_user, refresh_token: refreshToken });
        return newToken;
    }
}

module.exports = new TokenService();