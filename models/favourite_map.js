const Sequelize = require("sequelize");
const { sequelize } = require("../db");
const User = require("./user");
const Map = require("./map");

const FavouriteMap = sequelize.define("favourite_map", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_user: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    id_map: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
});

FavouriteMap.belongsTo(User, {
  foreignKey: 'id_user',
  targetKey: 'id'
});

FavouriteMap.belongsTo(Map, {
  foreignKey: 'id_map',
  targetKey: 'id'
});

module.exports = FavouriteMap;