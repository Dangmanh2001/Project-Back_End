"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Submid_exercises extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Submid_exercises.belongsTo(models.User, {
        foreignKey: "studentId",
      });
      Submid_exercises.belongsTo(models.Exercise, {
        foreignKey: "exerciseId",
      });
    }
  }
  Submid_exercises.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      studentId: DataTypes.INTEGER,
      exerciseId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      attachment: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Submid_exercises",
    }
  );
  return Submid_exercises;
};
