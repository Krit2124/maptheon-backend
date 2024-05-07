module.exports = class MapDto {
    id;
    id_creator;
    name;
    description;
    number_in_favourites;
    data;

    constructor(model) {
        this.id = model.id;
        this.username = model.username;
        this.accessType = model.id_access_type;
    }
}