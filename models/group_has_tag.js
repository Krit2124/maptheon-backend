const Sequelize = require("sequelize");
const { sequelize } = require("../db");
const Tag = require("./tag");
const GroupOfObject = require("./group_of_object");

const GroupHasTag = sequelize.define("group_has_tag", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_tag: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  id_group: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  timeStamps: false,
});

GroupHasTag.belongsTo(Tag, {
  foreignKey: 'id_tag',
  targetKey: 'id'
});

GroupHasTag.belongsTo(GroupOfObject, {
  foreignKey: 'id_group',
  targetKey: 'id'
});

module.exports = GroupHasTag;