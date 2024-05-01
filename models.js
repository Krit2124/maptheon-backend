const Sequelize = require("sequelize");
const { sequelize } = require("./db");

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

const GroupHasTag = sequelize.define("group_has_tag", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_tag: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  id_group: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

const GroupOfObject = sequelize.define("group_of_object", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  id_creator: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  is_public: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

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
});

const Object = sequelize.define("object", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_group: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

const SetHasGroup = sequelize.define("set_has_group", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_set: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  id_group: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

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

const Tag = sequelize.define("tag", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  id_creator: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
});

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
    allowNull: false
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

// Определение связей между моделями
FavouriteMap.belongsTo(User, {
  foreignKey: 'id_user',
  targetKey: 'id'
});
FavouriteMap.belongsTo(Map, {
  foreignKey: 'id_map',
  targetKey: 'id'
});
GroupHasTag.belongsTo(Tag, {
  foreignKey: 'id_tag',
  targetKey: 'id'
});
GroupHasTag.belongsTo(GroupOfObject, {
  foreignKey: 'id_group',
  targetKey: 'id'
});
GroupOfObject.belongsTo(User, {
  foreignKey: 'id_creator',
  targetKey: 'id'
});
Map.belongsTo(User, {
  foreignKey: 'id_creator',
  targetKey: 'id'
});
MapBanList.belongsTo(User, {
  foreignKey: 'id_admin',
  targetKey: 'id'
});
MapBanList.belongsTo(Map, {
  foreignKey: 'id_map',
  targetKey: 'id'
});
MapHasTag.belongsTo(Tag, {
  foreignKey: 'id_tag',
  targetKey: 'id'
});
MapHasTag.belongsTo(Map, {
  foreignKey: 'id_map',
  targetKey: 'id'
});
Object.belongsTo(GroupOfObject, {
  foreignKey: 'id_group',
  targetKey: 'id'
});
SetHasGroup.belongsTo(GroupOfObject, {
  foreignKey: 'id_group',
  targetKey: 'id'
});
SetHasGroup.belongsTo(SetOfObject, {
  foreignKey: 'id_set',
  targetKey: 'id'
});
Tag.belongsTo(User, {
  foreignKey: 'id_creator',
  targetKey: 'id'
});
User.belongsTo(AccessType, {
  foreignKey: 'id_access_type',
  targetKey: 'id'
});
UserBanList.belongsTo(User, {
  foreignKey: 'id_admin',
  targetKey: 'id'
});
UserBanList.belongsTo(User, {
  foreignKey: 'id_banned_user',
  targetKey: 'id'
});

module.exports = {
  AccessType,
  FavouriteMap,
  GroupHasTag,
  GroupOfObject,
  Map,
  MapBanList,
  MapHasTag,
  Object,
  SetHasGroup,
  SetOfObject,
  Tag,
  User,
  UserBanList
};