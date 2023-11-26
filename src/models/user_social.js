"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_social extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User_social.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  User_social.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: DataTypes.INTEGER,
      provider: DataTypes.STRING,
      providerId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User_social",
    }
  );
  return User_social;
};
