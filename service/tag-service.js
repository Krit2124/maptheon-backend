const Tag = require('../models/tag');
const MapHasTag = require('../models/map_has_tag');
const Map = require('../models/map');

module.exports = new class TagService {
    async findTagByName(tag_name) {
        let tag = await Tag.findOne({
            where: {
                name: tag_name
            }
        });

        return tag;
    }

    async addTag(name, id_user) {
        let newTag = await Tag.create({
            name: name,
            id_creator: id_user
        });

        return newTag;
    }

    async bindTagToMap(id_map, id_tag) {
        let newBind = await MapHasTag.create({
            id_tag: id_tag,
            id_map: id_map,
        });

        return newBind;
    }

    async getAllTagsByMap(id_map) {
        const mapHasTags = await MapHasTag.findAll({
            where: {
                id_map: id_map
            }
        });

        const tagIds = mapHasTags.map(mht => mht.id_tag);

        const tags = await Tag.findAll({
            where: {
                id: tagIds
            }
        });

        return tags;
    }

    async deleteBindTagToMap(id_user, id_map, id_tag) {
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

        await MapHasTag.destroy({
            where: {
                id_map: id_map,
                id_tag: id_tag
            }
        });

        // Проверка, используется ли тег хоть один раз
        let bindedTag = await MapHasTag.findOne({
            where: {
                id_tag: id_tag
            }
        });

        // Если нет, то удаляем тег
        if (!bindedTag) {
            await Tag.destroy({
                where: {
                    id: id_tag
                }
            });
        }
    }

    async deleteAllBindTagToMap(map) {
        const { id } = map;
    
        // Получение всех тегов, связанных с картой
        const tagsToDelete = await MapHasTag.findAll({
            where: {
                id_map: id,
            }
        });
    
        // Удаление всех привязок тегов к карте
        await MapHasTag.destroy({
            where: {
                id_map: id,
            }
        });
    
        // Проверка и удаление тегов, если они не привязаны к другим картам
        for (const tag of tagsToDelete) {
            const tagId = tag.id_tag;
    
            // Проверка, используется ли тег в других картах
            const bindedTag = await MapHasTag.findOne({
                where: {
                    id_tag: tagId,
                }
            });
    
            // Если тег не используется в других картах, удаляем его
            if (!bindedTag) {
                await Tag.destroy({
                    where: {
                        id: tagId,
                    }
                });
            }
        }
    }
}