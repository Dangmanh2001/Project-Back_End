"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_column extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User_column.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  User_column.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: DataTypes.INTEGER,
      featureName: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      position: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User_column",
    }
  );
  return User_column;
};
