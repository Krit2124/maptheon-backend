const Sequelize = require("sequelize");
const { sequelize } = require("../db");
const User = require("./user");

const Map = sequelize.define("map", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_creator: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  number_in_favourites: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  data: {
    type: Sequelize.JSON,
    allowNull: false
  },
  is_public: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  is_banned: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

Map.belongsTo(User, {
  foreignKey: 'id_creator',
  targetKey: 'id'
});

module.exports = Map;