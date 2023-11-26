"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_otp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User_otp.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  User_otp.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      otp: DataTypes.STRING,
      expires: DataTypes.DATE,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User_otp",
    }
  );
  return User_otp;
};
