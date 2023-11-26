"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Student_class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Student_class.belongsTo(models.User, {
        foreignKey: "studentId",
      });
      Student_class.belongsTo(models.Classes, {
        foreignKey: "classId",
      });
    }
  }
  Student_class.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      studentId: DataTypes.INTEGER,
      classId: DataTypes.INTEGER,
      statusId: DataTypes.INTEGER,
      completeDate: DataTypes.DATE,
      dropDate: DataTypes.DATE,
      recover: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Student_class",
    }
  );
  return Student_class;
};
