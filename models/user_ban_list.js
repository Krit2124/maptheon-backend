const Sequelize = require("sequelize");
const { sequelize } = require("../db");
const User = require("./user");

const UserBanList = sequelize.define("user_ban_list", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_banned_user: {
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
  },
  banned_until: {
    type: Sequelize.DATE,
    allowNull: false
  }
});

UserBanList.belongsTo(User, {
  foreignKey: 'id_admin',
  targetKey: 'id'
});
UserBanList.belongsTo(User, {
  foreignKey: 'id_banned_user',
  targetKey: 'id'
});

module.exports = UserBanList;