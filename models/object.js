const Sequelize = require("sequelize");
const { sequelize } = require("../db");
const GroupOfObject = require("./group_of_object");

const Object = sequelize.define("object", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_group: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

Object.belongsTo(GroupOfObject, {
  foreignKey: 'id_group',
  targetKey: 'id'
});

module.exports = Object;