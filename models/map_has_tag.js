const Sequelize = require("sequelize");
const { sequelize } = require("../db");
const Tag = require("./tag");
const Map = require("./map");

const MapHasTag = sequelize.define("map_has_tag", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_tag: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  id_map: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  timeStamps: false,
});

MapHasTag.belongsTo(Tag, {
  foreignKey: 'id_tag',
  targetKey: 'id'
});

MapHasTag.belongsTo(Map, {
  foreignKey: 'id_map',
  targetKey: 'id'
});

module.exports = MapHasTag;