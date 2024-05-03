const Sequelize = require("sequelize");
const { sequelize } = require("../db");
const AccessType = require("./access_type");

const User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: Sequelize.STRING(127),
      allowNull: false,
      unique: true
    },
    email: {
      type: Sequelize.STRING(127),
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING(63),
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    id_access_type: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    is_banned: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
});

User.belongsTo(AccessType, {
  foreignKey: 'id_access_type',
  targetKey: 'id'
});

module.exports = User;