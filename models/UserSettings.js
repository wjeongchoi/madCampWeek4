const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('UserSettings', {
    user_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    turtle: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    close: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    tilted: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    screen: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    alert: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'UserSettings',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
