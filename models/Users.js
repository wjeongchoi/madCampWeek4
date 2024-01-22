const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Users', {
    id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nose: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    leftEar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    rightEar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    leftShoulder: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    rightShoulder: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Users',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
