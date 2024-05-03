const Sequelize = require("sequelize");
const { sequelize } = require("../db");
const User = require("./user");

const GroupOfObject = sequelize.define("group_of_object", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  id_creator: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  is_public: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

GroupOfObject.belongsTo(User, {
  foreignKey: 'id_creator',
  targetKey: 'id'
});

module.exports = GroupOfObject;