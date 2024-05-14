const Sequelize = require("sequelize");
const { sequelize } = require("../db");
const User = require("./user");

const Tag = sequelize.define("tag", {
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
  }
});

Tag.belongsTo(User, {
  foreignKey: 'id_creator',
  targetKey: 'id'
});

module.exports = Tag;