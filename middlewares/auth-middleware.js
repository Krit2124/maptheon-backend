const ApiError = require('../exceptions/api-error');
const TokenService = require('../service/token-service');

module.exports = function(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        const UserData = TokenService.validateAccessToken(accessToken);
        if (!UserData) {
            return next(ApiError.UnauthorizedError());
        }

        req.user = UserData;
        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
};