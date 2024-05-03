const Sequelize = require("sequelize");
const { sequelize } = require("../db");

const AccessType = sequelize.define("access_type", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false
    }
});

module.exports = AccessType;