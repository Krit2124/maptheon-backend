const Map = require('../models/map');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const sharp = require('sharp');
const Buffer = require('buffer').Buffer;

const TagService = require('./tag-service');
const User = require('../models/user');
const BlobService = require('./blob-service');

function mapsFromMe(map) {
    return {
        id: map.id,
        name: map.name,
        updatedAt: map.updatedAt,
    };
}

function mapsFromCurrentUser(map) {
    return {
        id: map.id,
        name: map.name,
        number_in_favourites: map.number_in_favourites,
    };
}

function mapsFromAllUsers(map) {
    return {
        id: map.id,
        name: map.name,
        id_creator: map.id_creator,
        creator_name: map.user.username,
        number_in_favourites: map.number_in_favourites,
    };
}

module.exports = new class MapService {
    async getAllMaps(textToFind, sortByField) {
        const maps = await Map.findAll({ 
            where: {
                name: {
                    [Op.like]: `%${textToFind}%`
                },
                is_public: true,
            },
            include: [{
                model: User,
                as: 'user',
                attributes: ['username']
            }],
            order: [
                [sortByField, sortByField === 'name' || sortByField === 'number_in_favourites' ? 'ASC' : 'DESC'],
            ]
        });

        const mapsToReturn = [];
    
        // Проходимся по каждой карте и добавляем объект с нужными данными карты в массив
        for (const map of maps) {
            // Создаем объект карты и добавляем его в массив
            mapsToReturn.push(mapsFromAllUsers(map));
        }
    
        return mapsToReturn;
    }

    async getMyMaps(id_user, textToFind, sortByField) {
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
    
        const mapsToReturn = [];
    
        // Проходимся по каждой карте и добавляем объект с нужными данными карты в массив
        for (const map of maps) {
            // Создаем объект карты и добавляем его в массив
            mapsToReturn.push(mapsFromMe(map));
        }
    
        return mapsToReturn;
    }

    async getMapsFromUser(id_user, textToFind, sortByField) {
        const maps = await Map.findAll({ 
            where: {
                id_creator: id_user,
                name: {
                    [Op.like]: `%${textToFind}%`
                },
                is_public: true,
            },
            order: [
                [sortByField, sortByField === 'name' || sortByField === 'number_in_favourites' ? 'ASC' : 'DESC'],
            ]
        });
    
        const mapsToReturn = [];
    
        // Проходимся по каждой карте и добавляем объект с нужными данными карты в массив
        for (const map of maps) {
            // Создаем объект карты и добавляем его в массив
            mapsToReturn.push(mapsFromCurrentUser(map));
        }
    
        return mapsToReturn;
    }

    async getMapSettings(id_map, id_user) {
        const map = await Map.findOne({
            where: {
                id: id_map,
                id_creator: id_user
            }
        });

        return {
            id: map.id, 
            name:map.name,
            description: map.description,
            number_in_favourites: map.number_in_favourites,
            is_public: map.is_public,
            createdAt: map.createdAt,
            updatedAt: map.updatedAt,
        };
    }

    async getUserMapInfo(id_map, id_user) {
        const map = await Map.findOne({
            where: {
                id: id_map,
                id_creator: id_user
            },
            include: [{
                model: User,
                as: 'user',
                attributes: ['username']
            }],
        });

        return {
            id: map.id, 
            name: map.name,
            creator_name: map.user.username,
            description: map.description,
            number_in_favourites: map.number_in_favourites,
            createdAt: map.createdAt,
            updatedAt: map.updatedAt,
        };
    }

    // Метод для обновления названия карты
    async updateMapName(id_map, id_user, newName) {
        const map = await Map.findOne({
            where: {
                id: id_map,
                id_creator: id_user
            }
        });

        if (!map) {
            throw new ApiError('Отказано в доступе к карте или карта не найдена', 403);
        }

        map.name = newName;
        await map.save();
        return 'Данные успешно сохранены';
    }

    // Метод для обновления описания карты
    async updateMapDescription(id_map, id_user, newDescription) {
        const map = await Map.findOne({
            where: {
                id: id_map,
                id_creator: id_user
            }
        });

        if (!map) {
            throw new ApiError('Отказано в доступе к карте или карта не найдена', 403);
        }

        map.description = newDescription;
        await map.save();
        return 'Данные успешно сохранены';
    }

    // Метод для обновления публичности карты
    async updateMapPublicStatus(id_map, id_user, newPublicStatus) {
        const map = await Map.findOne({
            where: {
                id: id_map,
                id_creator: id_user
            }
        });

        if (!map) {
            throw new ApiError('Отказано в доступе к карте или карта не найдена', 403);
        }

        map.is_public = newPublicStatus;
        await map.save();
        return 'Данные успешно сохранены';
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
        const fullPath = `mapsFullSize/${id_map}.jpg`;
    
        // Сохранение полного изображения
        await BlobService.uploadImage(fullPath, bufferImage);
    
        // Путь для сохранения превью изображения
        const previewPath = `mapsPreviews/${id_map}.jpg`;
    
        // Создание превью изображения
        const previewBuffer = await sharp(bufferImage).resize(350, 215).toBuffer();

        // Сохранение превью изображения
        await BlobService.uploadImage(previewPath, previewBuffer);

        return id_map;
    }

    async deleteMap(id_user, id_map) {
        // Проверка, принадлежит ли карта пользователю
        const map = await Map.findOne({
            where: {
                id: id_map,
                id_creator: id_user
            }
        });

        if (!map) {
            throw new ApiError('Отказано в доступе к карте или карта не найдена', 403);
        }

        // Удаление всех привязанных тегов
        await TagService.deleteAllBindTagToMap(map);

        // Удаление карты из базы данных
        await map.destroy();

        // Пути к изображениям
        const previewImagePath = path.join(__dirname, '../public/img/mapsPreviews', `${id_map}.jpg`);
        const fullSizeImagePath = path.join(__dirname, '../public/img/mapsFullSize', `${id_map}.jpg`);

        // Удаление изображений
        try {
            await fs.unlink(previewImagePath);
        } catch (err) {
            // Игнорируем ошибку, если файл не найден
            if (err.code !== 'ENOENT') {
                console.error(`Ошибка при удалении файла ${previewImagePath}:`, err);
            }
        }

        try {
            await fs.unlink(fullSizeImagePath);
        } catch (err) {
            // Игнорируем ошибку, если файл не найден
            if (err.code !== 'ENOENT') {
                console.error(`Ошибка при удалении файла ${fullSizeImagePath}:`, err);
            }
        }

        return 'Данные успешно удалены';
    }
}