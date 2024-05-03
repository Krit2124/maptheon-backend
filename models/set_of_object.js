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
  }
});

module.exports = SetOfObject;