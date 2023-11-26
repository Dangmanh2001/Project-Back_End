"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Information_persional extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Information_persional.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Information_persional.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      avatar: DataTypes.STRING,
      name: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      status: DataTypes.STRING,
      address: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Information_persional",
    }
  );
  return Information_persional;
};
