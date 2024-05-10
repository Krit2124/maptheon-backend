const Map = require('../models/map');
const fs = require('fs');
const path = require('path');
const fabric = require('fabric').fabric;
const sharp = require('sharp');

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

    async saveMapData(id_map, id_user, data) {
        const map = await Map.findOne({
            where: {
                id: id_map
            }
        });

        if (map.id_creator !== id_user) {
            throw ApiError.BadRequest('Отказано в доступе к карте');
        }

        // Преобразование JSON-данных в объекты холста fabric
        const lowerCanvasObjects = data.lowerCanvas;
        const middleCanvasObjects = data.middleCanvas;
        const upperCanvasObjects = data.upperCanvas;

        // Создание нового холста fabric и добавление объектов
        const canvas = new fabric.Canvas;

        lowerCanvasObjects.forEach(obj => {
            canvas.add(new fabric[obj.type](obj));
        });

        middleCanvasObjects.forEach(obj => {
            canvas.add(new fabric[obj.type](obj));
        });

        upperCanvasObjects.forEach(obj => {
            canvas.add(new fabric[obj.type](obj));
        });

        const mapImage = await tempCanvas.toDataURL({
            format: 'jpeg',
            quality: 1 // качество изображения
        });

        // Путь для сохранения полного изображения
        const fullPath = path.join(__dirname, '../public/img/mapsFullSize', `${id_map}.jpg`);

        // Сохранение полного изображения
        fs.writeFileSync(fullPath, mapImage, 'base64');

        // Путь для сохранения превью изображения
        const previewPath = path.join(__dirname, '../public/img/mapsPreviews', `${id_map}.jpg`);

        // Создание превью изображения с помощью Sharp
        await sharp(Buffer.from(mapImage, 'base64')).resize(350, 215).toFile(previewPath);

        map.data = data;
        await map.save();

        return 'Данные успешно сохранены';
    }
}