const Sequelize = require("sequelize");
const { sequelize } = require("../db");

const AccessType = sequelize.define("access_type", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: Sequelize.STRING(31),
      allowNull: false
    }
}, {
  timeStamps: false,
});

module.exports = AccessType;