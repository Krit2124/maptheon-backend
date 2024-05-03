const Sequelize = require("sequelize");
const { sequelize } = require("../db");
const User = require("./user");

const Token = sequelize.define("token", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_user: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    refresh_token: {
      type: Sequelize.STRING,
      allowNull: false
    }
});

Token.belongsTo(User, {
  foreignKey: 'id_user',
  targetKey: 'id'
});

module.exports = Token;