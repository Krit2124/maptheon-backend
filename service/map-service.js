const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const sharp = require('sharp');
const Buffer = require('buffer').Buffer;

const TagService = require('./tag-service');
const BlobService = require('./blob-service');

const Map = require('../models/map');
const User = require('../models/user');
const FavouriteMap  = require('../models/favourite_map');

// Функция для оформления данных карт текущего пользователя
function mapsFromMe(map) {
    return {
        id: map.id,
        name: map.name,
        updatedAt: map.updatedAt,
    };
}

// Функция для оформления данных карт выбранного пользователя
function mapsFromCurrentUser(map, wasFavourite) {
    return {
        id: map.id,
        name: map.name,
        number_in_favourites: map.number_in_favourites,
        wasFavourite: wasFavourite,
    };
}

// Функция для оформления данных карт всех пользователей
function mapsFromAllUsers(map, wasFavourite) {
    return {
        id: map.id,
        name: map.name,
        id_creator: map.id_creator,
        creator_name: map.user.username,
        number_in_favourites: map.number_in_favourites,
        wasFavourite: wasFavourite,
    };
}

module.exports = new class MapService {
    // Получение данных всех карт
    async getAllMaps(id_user, textToFind, sortByField) {
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
                [sortByField, sortByField === 'name' ? 'ASC' : 'DESC'],
            ]
        });

        const mapsToReturn = [];
    
        // Проходимся по каждой карте и добавляем объект с нужными данными карты в массив
        for (const map of maps) {
            let bind = await FavouriteMap.findOne({
                where: {
                    id_user: id_user,
                    id_map: map.id,
                }
            });

            let wasFavourite = bind ? true : false;


            // Создаем объект карты и добавляем его в массив
            mapsToReturn.push(mapsFromAllUsers(map, wasFavourite));
        }
    
        return mapsToReturn;
    }

    // Получение данных всех карт текущего пользователя
    async getMyMaps(id_user, textToFind, sortByField) {
        const maps = await Map.findAll({ 
            where: {
                id_creator: id_user,
                name: {
                    [Op.like]: `%${textToFind}%`
                }
            },
            order: [
                [sortByField, sortByField === 'name' ? 'ASC' : 'DESC'],
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

    // Получение данных всех карт выбранного пользователя
    async getMapsFromUser(id_current_user, id_user, textToFind, sortByField) {
        const maps = await Map.findAll({ 
            where: {
                id_creator: id_user,
                name: {
                    [Op.like]: `%${textToFind}%`
                },
                is_public: true,
            },
            order: [
                [sortByField, sortByField === 'name' ? 'ASC' : 'DESC'],
            ]
        });
    
        const mapsToReturn = [];
    
        // Проходимся по каждой карте и добавляем объект с нужными данными карты в массив
        for (const map of maps) {
            let bind = await FavouriteMap.findOne({
                where: {
                    id_user: id_current_user,
                    id_map: map.id,
                }
            });

            let wasFavourite = bind ? true : false;

            // Создаем объект карты и добавляем его в массив
            mapsToReturn.push(mapsFromCurrentUser(map, wasFavourite));
        }
    
        return mapsToReturn;
    }

    // Получение параметров карты текущего пользователя
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

    // Получение параметров карты выбранного пользователя
    async getUserMapInfo(id_current_user, id_map, id_user) {
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

        let bind = await FavouriteMap.findOne({
            where: {
                id_user: id_current_user,
                id_map: map.id,
            }
        });

        return {
            id: map.id, 
            name: map.name,
            creator_name: map.user.username,
            description: map.description,
            number_in_favourites: map.number_in_favourites,
            wasFavourite: bind ? true : false,
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

    // Получение данных содержимого карты
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

    // Сохранение содержимого карты
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

    // Удаление карты
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

    // Получение избранных карт
    async getAllFavouriteMaps(id_user, textToFind, sortByField) {
        // Получение списка избранных карт
        const binds = await FavouriteMap.findAll({
            where: {
                id_user: id_user
            }
        });

        const mapsToReturn = [];

        // Получение данных избранных карт
        for (const bind of binds) {
            const map = await Map.findOne({
                where: {
                    id: bind.id_map,
                    is_public: true,
                    name: {
                        [Op.like]: `%${textToFind}%`
                    },
                },
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['username']
                }],
                order: [
                    [sortByField, sortByField === 'name' ? 'ASC' : 'DESC'],
                ]
           });

            // Создаем объект карты и добавляем его в массив
            if (map) {
                mapsToReturn.push(mapsFromAllUsers(map, true));
            }
        }
    
        return mapsToReturn;
    }

    // Добавление карты в избранное
    async addMapToFavourite(id_user, id_map) {
        let newBind = await FavouriteMap.create({
            id_user: id_user,
            id_map: id_map,
        });

        const map = await Map.findByPk(id_map);

        map.number_in_favourites += 1;
        await map.save();

        return map.number_in_favourites;
    }

    // Удаление карты из избранного
    async deleteMapFromFavourite(id_user, id_map)  {
        const bind = await FavouriteMap.findOne({
            where: {
                id_user: id_user,
                id_map: id_map,
            }
        });

        bind.destroy();

        const map = await Map.findByPk(id_map);

        map.number_in_favourites -= 1;
        await map.save();

        return map.number_in_favourites;
    }
}