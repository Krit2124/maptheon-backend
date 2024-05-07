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
}