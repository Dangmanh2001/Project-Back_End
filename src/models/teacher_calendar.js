"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Teacher_calendar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Teacher_calendar.belongsTo(models.User, {
        foreignKey: "teacherId",
      });
      Teacher_calendar.belongsTo(models.Classes, {
        foreignKey: "classId",
      });
    }
  }
  Teacher_calendar.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      teacherId: DataTypes.INTEGER,
      classId: DataTypes.INTEGER,
      scheduleDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Teacher_calendar",
    }
  );
  return Teacher_calendar;
};
