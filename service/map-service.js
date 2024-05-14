const Map = require('../models/map');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const sharp = require('sharp');
const Buffer = require('buffer').Buffer;

function mapsWithImageFromCurrentUser(map, imagePath) {
    return {
        id: map.id,
        name: map.name,
        updatedAt: map.updatedAt,
        imagePath: imagePath
    };
}

module.exports = new class MapService {
    async getAllMaps() {
        const maps = await Map.find();
        return maps;
    }

    async getMapsFromCurrentUser(id_user, textToFind, sortByField) {
        const maps = await Map.findAll({ 
            where: {
                id_creator: id_user,
                name: {
                    [Op.like]: `%${textToFind}%`
                }
            },
            order: [
                [sortByField, sortByField === 'name' || sortByField === 'number_in_favourites' ? 'ASC' : 'DESC'],
            ]
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

    async getMapSettings(id_map, id_user) {
        const map = await Map.findOne({
            where: {
                id: id_map,
                id_creator: id_user
            }
        });

        const imagePath = `http://localhost:` + process.env.PORT + `/img/mapsFullSize/${id_map}.jpg`;
        return [
            map.id, 
            map.name,
            map.description,
            map.number_in_favourites,
            map.is_public,
            imagePath
        ];
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

    async saveMapData(id_map, id_user, data, mapImage) {
        const map = await Map.findOne({
            where: {
                id: id_map
            }
        });
    
        if (map) {
            if (map.id_creator !== id_user) {
                throw ApiError.BadRequest('Отказано в доступе к карте');
            }
        }
    
        // Если карта не найдена, создаем новую запись
        if (!map) {
            let newMap = await Map.create({
                id_creator: id_user,
                name: 'Новая карта',
                number_in_favourites: 0,
                data: data,
            });

            id_map = newMap.id;
        } else {
            map.data = data;
            await map.save();
        }

        // Получение данных изображения карты из URL
        var regex = /^data:.+\/(.+);base64,(.*)$/;
        var matches = mapImage.match(regex);
        var mapImageData = matches[2];
        var bufferImage = Buffer.from(mapImageData, 'base64');
            
        // Путь для сохранения полного изображения
        const fullPath = path.join(__dirname, '../public/img/mapsFullSize', `${id_map}.jpg`);
    
        // Сохранение полного изображения
        fs.writeFileSync(fullPath, bufferImage);
    
        // Путь для сохранения превью изображения
        const previewPath = path.join(__dirname, '../public/img/mapsPreviews', `${id_map}.jpg`);
    
        // Создание превью изображения с помощью Sharp
        await sharp(fullPath).resize(350, 215).toFile(previewPath);
        
        return 'Данные успешно сохранены';
    }
}