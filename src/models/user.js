"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Classes, {
        through: "classes_teachers",
        foreignKey:"teacherId"
      });
      User.hasMany(models.User_social);
      User.hasOne(models.User_otp);
      User.hasOne(models.User_column);
      User.hasMany(models.Teacher_calendar,{
        foreignKey:"teacherId"
      });
      User.hasMany(models.Submid_exercises);
      User.hasOne(models.Student_class, {
        foreignKey: "studentId",
      });
      User.hasMany(models.Student_attendance);
      User.hasOne(models.Login_token);
      User.hasOne(models.Information_persional);
      User.hasMany(models.Course, {
        foreignKey: "teacherId",
      });
      User.hasMany(models.Comment);
      User.belongsToMany(models.Role, {
        through: "user_role",
        foreignKey: "userId",
      });
      User.belongsTo(models.Type, {
        foreignKey: "typeId",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      typeId: DataTypes.INTEGER,
      first_login: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
