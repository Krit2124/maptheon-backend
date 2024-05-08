const Map = require('../models/map');

function mapsWithImageFromCurrentUser(map, imagePath) {
    return {
        id: map.id,
        name: map.name,
        is_public: map.is_public,
        updatedAt: map.updatedAt,
        imagePath: imagePath
    };
}

module.exports = new class MapService {
    async getAllMaps() {
        const maps = await Map.find();
        return maps;
    }

    async getMapsFromCurrentUser(id_user) {
        const maps = await Map.findAll({ 
            where: {
                id_creator: id_user
            }
        });
    
        // Массив для хранения карт с изображениями
        const mapsWithImages = [];
    
        // Проходимся по каждой карте и добавляем объект карты с изображением в массив
        for (const map of maps) {
            // Формируем путь к изображению
            const imagePath = `http://localhost:` + process.env.PORT + `/img/mapsPreviews/${map.id}.jpg`;
            // Создаем объект карты с изображением и добавляем его в массив
            mapsWithImages.push(mapsWithImageFromCurrentUser(map, imagePath));
        }
    
        // Возвращаем массив объектов карт с изображениями
        return mapsWithImages;
    }

    async getMapData(id_map, id_user) {
        const map = await Map.findOne({
            where: {
                id: id_map
            }
        });

        if (map.id_creator !== id_user) {
            throw ApiError.BadRequest('Отказано в доступе к карте');
        }

        return map.data;
    }
}