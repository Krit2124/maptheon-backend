const Sequelize = require("sequelize");
const { sequelize } = require("../db");
const GroupOfObject = require("./group_of_object");
const SetOfObject = require("./set_of_object");

const SetHasGroup = sequelize.define("set_has_group", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_set: {
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

SetHasGroup.belongsTo(GroupOfObject, {
  foreignKey: 'id_group',
  targetKey: 'id'
});

SetHasGroup.belongsTo(SetOfObject, {
  foreignKey: 'id_set',
  targetKey: 'id'
});

module.exports = SetHasGroup;