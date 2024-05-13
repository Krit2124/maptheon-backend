const jwt = require('jsonwebtoken');

const MapService = require('../service/map-service');
const ApiError = require('../exceptions/api-error');

function getUserIdFromRequest(req) {
    const authorizationHeader = req.headers.authorization;
    const accessToken = authorizationHeader.split(' ')[1];
    const decodedToken = jwt.decode(accessToken);
    return decodedToken.id;
}

module.exports = new class MapController {
    async getMapsFromCurrentUser(req, res, next) {
        try {
            // Получение id пользователя и фильтров из запроса
            const id_user = getUserIdFromRequest(req);
            const { textToFind, sortByField } = req.body;

            const maps = await MapService.getMapsFromCurrentUser(id_user, textToFind, sortByField);
            return res.json(maps);
        } catch (e) {
            next(e);
        }
    }

    async getMapData(req, res, next) {
        try {
            // Получение id пользователя и карты из запроса
            const id_user = getUserIdFromRequest(req);
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
            const id_user = getUserIdFromRequest(req);
            const { id_map, data, mapImage } = req.body;

            const message = await MapService.saveMapData(id_map, id_user, data, mapImage);
            return res.json(message);
        } catch (e) {
            next(e);
        }
    }
}