module.exports = class UserDto {
    username;
    id;
    accessType;

    constructor(model) {
        this.username = model.username;
        this.id = model.id;
        this.accessType = model.id_access_type;
    }
}