"use strict";
const { Model } = require("sequelize");
const { mapFinderOptions } = require("sequelize/types/utils");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Course.belongsTo(models.User, {
        foreignKey: "teacherId",
      });
      Course.hasOne(models.Course_modules);
    }
  }
  Course.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      teacherId: DataTypes.INTEGER,
      number_of_trial: DataTypes.INTEGER,
      number_of_student: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Course",
    }
  );
  return Course;
};
