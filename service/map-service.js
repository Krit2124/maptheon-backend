const Map = require('../models/map');

function mapWithImage(map, imagePath) {
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
    
        // Создаем массив для хранения объектов карт с изображениями
        const mapsWithImages = [];
    
        // Проходимся по каждой карте и добавляем объект карты с изображением в массив
        for (const map of maps) {
            // Формируем путь к изображению
            const imagePath = `img/mapsPreviews/${map.id}.jpg`;
            // Создаем объект карты с изображением и добавляем его в массив
            mapsWithImages.push(mapWithImage(map, imagePath));
        }
    
        // Возвращаем массив объектов карт с изображениями
        return mapsWithImages;
    }
}