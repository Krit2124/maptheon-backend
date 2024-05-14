const TagService = require('../service/tag-service');
const UserService = require('../service/user-service');

module.exports = new class TagController {
    async getTagsByMap(req, res, next) {
        try {
            const { id_map } = req.params.id_map;
            const tags = await TagService.getAllTagsByMap(id_map);
            res.json(tags);
        } catch (e) {
            next(e);
        }
    }

    async bindTagToMap(req, res, next) {
        try {
            // Получение id пользователя, имени тега и id карты из запроса
            const id_user = UserService.getUserIdFromRequest(req);
            const { tag_name, id_map } = req.body;

            let tag = await TagService.getTagByName(tag_name);

            if (!tag) {
                tag = await TagService.addTag(tag_name, id_user);
            }

            await TagService.bindTagToMap(id_map, tag.id);

            return res.json('Данные успешно сохранены');
        } catch (e) {
            next(e);
        }
    }

    async deleteBindTagToMap(req, res, next) {
        try {
            // Получение id тега и id карты из запроса
            const { id_map, id_tag } = req.body;

            await TagService.deleteBindTagToMap(id_map, id_tag);

            return res.json('Данные успешно удалены');
        } catch (e) {
            next(e);
        }
    }
}