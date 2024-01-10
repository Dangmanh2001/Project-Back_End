const model = require("../../../models/index");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
var randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const paginate = require("sequelize-paginate");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const os = require("os");
const exportExcel = require("../../utils/exportExcel");
let data = null;

module.exports = {
  class: async (req, res) => {
    const { keyword, page = 1, limit = 3 } = req.query;
    const filters = [];
    if (keyword) {
      filters.push({
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${keyword}%`,
            },
          },
        ],
      });
    }

    const whereCondition = {
      [Op.and]: [...filters],
    };

    const { count, rows: classes } = await model.Classes?.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });

    const pageCount = Math.ceil(count / limit);

    const message = req.flash("message");
    const user = req.user;

    res.render("admin/dashboard/class", {
      user,
      req,
      message,
      classes,
      pageCount,
      currentPage: parseInt(page),
    });
  },
  exportExcelClass: async (req, res) => {
    const classes = [];
    data.forEach((e, index) => {
      classes.push({
        Stt: index + 1,
        Name: e.name,
        Number_of_student: e.number_of_student,
        Opening: e.opening,
        Closing: e.closing,
        Schedule: e.schedule,
        Study_time: e.study_time,
      });
    });
    exportExcel(classes, "exported_data_classes.xlsx");
    res.redirect("/admin/classes");
  },
  addClass: async (req, res) => {
    const user = req.user;
    const message = req.flash("message");
    const teachers = await model.User.findAll({
      where: {
        typeId: 2,
      },
    });
    const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    res.render("admin/users/classes/addClass", {
      user,
      message,
      days,
      teachers,
    });
  },
  handleAddClass: async (req, res) => {
    const {
      name,
      number_of_student,
      opening,
      closing,
      schedule,
      study_time_start,
      study_time_end,
      teacher,
    } = req.body;

    const study_time = study_time_start + "-" + study_time_end;
    const cls = await model.Classes.create({
      name,
      number_of_student,
      opening,
      closing,
      schedule,
      study_time,
    });
    if (teacher !== "Không") {
      cls.addUser(
        await model.User.findOne({
          where: {
            id: teacher,
          },
        })
      );
    }

    res.redirect("/admin/addClass");
  },
  addStudentInClass: async (req, res) => {
    const user = req.user;
    const message = req.flash("message");
    const students = await model.User.findAll({
      where: {
        typeId: 3,
      },
      include: model.Student_class,
    });
    res.render("admin/users/classes/addStudentInClass", {
      user,
      message,
      students,
    });
  },

  handleAddStudentInClass: async (req, res) => {
    const { id } = req.params;
    const { studentId } = req.body;
    console.log(studentId);
    if (!studentId) {
      req.flash("message", "Vui lòng chọn");
      res.redirect(`/admin/class/addStudent/${id}`);
      return;
    }

    if (typeof studentId === "string") {
      await model.Student_class.create({ studentId, classId: id, statusId: 1 });
    } else {
      studentId.forEach(async (e) => {
        await model.Student_class.create({
          studentId: e,
          classId: id,
          statusId: 1,
        });
      });
    }
    res.redirect(`/admin/class/addStudent/${id}`);
  },
  deleteStudentInClass: async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const message = req.flash("message");
    const students = await model.User.findAll({
      where: {
        typeId: 3,
      },
      include: model.Student_class,
    });
    res.render("admin/users/classes/deleteStudentInClass", {
      user,
      message,
      students,
      id,
    });
  },
  handleDeleteStudentInClass: async (req, res) => {
    const { id } = req.params;
    const { studentId } = req.body;
    console.log(studentId);
    if (!studentId) {
      req.flash("message", "Vui lòng chọn");
      res.redirect(`/admin/class/deleteStudent/${id}`);
      return;
    }

    if (typeof studentId === "string") {
      await model.Student_class.destroy({
        where: {
          studentId,
          classId: id,
        },
      });
    } else {
      studentId.forEach(async (e) => {
        await model.Student_class.destroy({
          where: {
            studentId: e,
            classId: id,
          },
        });
      });
    }
    res.redirect(`/admin/class/deleteStudent/${id}`);
  },
  addTeacherInClass: async (req, res) => {
    const user = req.user;
    const message = req.flash("message");
    const { id } = req.params;
    const teachers = await model.User.findAll({
      where: {
        typeId: 2,
      },
      include: model.Classes,
    });

    res.render("admin/users/classes/addTeacherInClass", {
      user,
      message,
      teachers,
      id,
    });
  },
  deleteTeacherInClass: async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const message = req.flash("message");
    const teachers = await model.User.findAll({
      where: {
        typeId: 2,
      },
      include: model.Classes,
    });
    res.render("admin/users/classes/deleteTeacherInClass", {
      user,
      message,
      teachers,
      id,
    });
  },
};
