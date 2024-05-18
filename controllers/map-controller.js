const MapService = require('../service/map-service');
const UserService = require('../service/user-service');

module.exports = new class MapController {
    async getMapsFromCurrentUser(req, res, next) {
        try {
            // Получение id пользователя и фильтров из запроса
            const id_user = UserService.getUserIdFromRequest(req);
            const { textToFind, sortByField } = req.body;

            const maps = await MapService.getMapsFromCurrentUser(id_user, textToFind, sortByField);
            return res.json(maps);
        } catch (e) {
            next(e);
        }
    }

    async getMapSettings(req, res, next) {
        try {
            // Получение id пользователя и карты из запроса
            const id_user = UserService.getUserIdFromRequest(req);
            const id_map = req.params.id;

            // Получение и возврат настроек и изображения карты
            const mapData = await MapService.getMapSettings(id_map, id_user);
            return res.send(mapData);
        } catch (e) {
            next(e);
        }
    }

    async updateMapName(req, res, next) {
        try {
            const id_user = UserService.getUserIdFromRequest(req);
            const { id_map, newName } = req.body;

            const message = await MapService.updateMapName(id_map, id_user, newName);
            return res.json(message);
        } catch (e) {
            next(e);
        }
    }

    async updateMapDescription(req, res, next) {
        try {
            const id_user = UserService.getUserIdFromRequest(req);
            const { id_map, newDescription } = req.body;

            const message = await MapService.updateMapDescription(id_map, id_user, newDescription);
            return res.json(message);
        } catch (e) {
            next(e);
        }
    }

    async updateMapPublicStatus(req, res, next) {
        try {
            const id_user = UserService.getUserIdFromRequest(req);
            const { id_map, newPublicStatus } = req.body;

            const message = await MapService.updateMapPublicStatus(id_map, id_user, newPublicStatus);
            return res.json(message);
        } catch (e) {
            next(e);
        }
    }

    async getMapData(req, res, next) {
        try {
            // Получение id пользователя и карты из запроса
            const id_user = UserService.getUserIdFromRequest(req);
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
            const id_user = UserService.getUserIdFromRequest(req);
            const { id_map, data, mapImage } = req.body;

            const message = await MapService.saveMapData(id_map, id_user, data, mapImage);
            return res.json(message);
        } catch (e) {
            next(e);
        }
    }
}