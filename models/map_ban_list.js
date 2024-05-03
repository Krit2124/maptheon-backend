const Sequelize = require("sequelize");
const { sequelize } = require("../db");
const User = require("./user");
const Map = require("./map");

const MapBanList = sequelize.define("map_ban_list", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_map: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  id_admin: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  reason: {
    type: Sequelize.TEXT,
    allowNull: false
  }
});

MapBanList.belongsTo(User, {
  foreignKey: 'id_admin',
  targetKey: 'id'
});

MapBanList.belongsTo(Map, {
  foreignKey: 'id_map',
  targetKey: 'id'
});

module.exports = MapBanList;