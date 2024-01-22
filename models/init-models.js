var DataTypes = require("sequelize").DataTypes;
var _ProgramUsage = require("./ProgramUsage");
var _UserSettings = require("./UserSettings");
var _Users = require("./Users");
var _Warnings = require("./Warnings");

function initModels(sequelize) {
  var ProgramUsage = _ProgramUsage(sequelize, DataTypes);
  var UserSettings = _UserSettings(sequelize, DataTypes);
  var Users = _Users(sequelize, DataTypes);
  var Warnings = _Warnings(sequelize, DataTypes);

  ProgramUsage.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(ProgramUsage, { as: "ProgramUsages", foreignKey: "user_id"});
  UserSettings.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasOne(UserSettings, { as: "UserSetting", foreignKey: "user_id"});
  Warnings.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(Warnings, { as: "Warnings", foreignKey: "user_id"});

  return {
    ProgramUsage,
    UserSettings,
    Users,
    Warnings,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
