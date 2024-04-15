"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Login_token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Login_token.belongsTo(models.User, {
        foreignKey: "userId"
      });
    }
  }
  Login_token.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: DataTypes.INTEGER,
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Login_token",
    }
  );
  return Login_token;
};
