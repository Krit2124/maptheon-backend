const jwt = require('jsonwebtoken');

const MapService = require('../service/map-service');
const ApiError = require('../exceptions/api-error');

module.exports = new class MapController {
    async getMapsFromCurrentUser(req, res, next) {
        try {
            const id_user = req.params.id;
            const maps = await MapService.getMapsFromCurrentUser(id_user);
            return res.json(maps);
        } catch (e) {
            next(e);
        }
    }

    async getMapData(req, res, next) {
        try {
            // Получение id пользователя и карты из запроса
            const authorizationHeader = req.headers.authorization;
            const accessToken = authorizationHeader.split(' ')[1];
            const decodedToken = jwt.decode(accessToken);
            const id_user = decodedToken.id;
            const id_map = req.params.id;

            // Получение и возврат данных карты
            const mapData = await MapService.getMapData(id_map, id_user);
            return res.send(mapData);
        } catch (e) {
            next(e);
        }
    }

    async saveMapData(req, res, next) {
        try {
            // Получение id пользователя и карты из запроса
            const authorizationHeader = req.headers.authorization;
            const accessToken = authorizationHeader.split(' ')[1];
            const decodedToken = jwt.decode(accessToken);
            const id_user = decodedToken.id;
            const { id_map, data } = req.body;

            const message = await MapService.saveMapData(id_map, id_user, data);
            return res.json(message);
        } catch (e) {
            next(e);
        }
    }
}