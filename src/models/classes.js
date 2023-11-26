"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Classes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Classes.belongsToMany(models.User, {
        foreignKey: "userId",
      });
      Classes.hasMany(models.Teacher_calendar);
      Classes.hasMany(models.Student_class);
      Classes.hasMany(models.Student_attendance);
      Classes.hasMany(models.Comment);
    }
  }
  Classes.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      number_of_student: DataTypes.INTEGER,
      opening: DataTypes.DATE,
      closing: DataTypes.DATE,
      schedule: DataTypes.BOOLEAN,
      study_time: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Classes",
    }
  );
  return Classes;
};
