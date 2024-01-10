"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Student_attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Student_attendance.belongsTo(models.User, {
        foreignKey: "studentId",
      });
      Student_attendance.belongsTo(models.Classes, {
        foreignKey: "classId",
      });
    }
  }
  Student_attendance.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      learnDate: DataTypes.DATE,
      studentId: DataTypes.INTEGER,
      classId: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Student_attendance",
    }
  );
  return Student_attendance;
};
