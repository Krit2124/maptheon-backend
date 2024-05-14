const Tag = require('../models/tag');
const MapHasTag = require('../models/map_has_tag');

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

    async deleteBindTagToMap(id_map, id_tag) {
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
}