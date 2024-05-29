const Sequelize = require("sequelize");
const { sequelize } = require("../db");

const SetOfObject = sequelize.define("set_of_object", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.INTEGER,
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
  },
});

SetOfObject.belongsTo(User, {
  foreignKey: 'id_creator',
  targetKey: 'id'
});

module.exports = SetOfObject;