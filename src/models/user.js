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
      User.hasMany(models.Classes);
      User.hasOne(models.User_social);
      User.hasOne(models.User_otp);
      User.hasOne(models.User_column);
      User.hasMany(models.Teacher_calendar);
      User.hasMany(models.Submid_exercises);
      User.hasMany(models.Student_class);
      User.hasMany(models.Student_attendance);
      User.hasOne(models.Login_token);
      User.hasOne(models.Information_persional);
      User.hasMany(models.Course);
      User.hasMany(models.Comment);
      User.belongsToMany(models.Role, {
        through: "user_role",
        foreignKey: "userId",
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
