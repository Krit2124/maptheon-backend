module.exports = class UserDto {
    id;
    username;
    accessType;

    constructor(model) {
        this.id = model.id;
        this.username = model.username;
        this.accessType = model.id_access_type;
    }
}