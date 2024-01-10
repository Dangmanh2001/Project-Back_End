const model = require("../../../models/index");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const os = require("os");
const exportExcel = require("../../utils/exportExcel");
let data = null;

module.exports = {
  student: async (req, res) => {
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
          {
            email: {
              [Op.like]: `%${keyword}%`,
            },
          },
        ],
      });
    }

    const whereCondition = {
      [Op.and]: [{ typeId: 3 }, ...filters],
    };

    const { count, rows: students } = await model.User.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });

    const pageCount = Math.ceil(count / limit);

    const message = req.flash("message");
    const user = req.user;

    res.render("admin/dashboard/student", {
      message,
      user,
      req,
      students,
      pageCount,
      currentPage: parseInt(page),
    });
  },
  exportExcelStudent: async (req, res) => {
    const students = [];
    data.forEach((e, index) => {
      students.push({ Stt: index + 1, Name: e.name, Email: e.email });
    });
    exportExcel(students, "exported_data_students.xlsx");
    res.redirect("/admin/teachers");
  },
  addStudent: async (req, res) => {
    const user = req.user;

    const message = req.flash("message");
    res.render("admin/users/students/addStudent", { user, message });
  },
  handleAddStudent: async (req, res) => {
    const { name, email, password } = req.body;

    const passwordHash = bcrypt.hash(password, 10);
    const hash = await passwordHash;

    await model.User.create({ name, email, password: hash, typeId: 3 });

    res.redirect("/admin/addStudent");
  },
  editStudent: async (req, res) => {
    const user = req.user;
    const message = req.flash("message");

    res.render("admin/users/students/editStudent", { user, message });
  },

  handleEditStudent: async (req, res) => {
    const { email, name, password } = req.body;
    const { id } = req.params;

    console.log(id);
    const passwordHash = bcrypt.hash(password, 10);
    const hash = await passwordHash;
    await model.User.update({ name, email, password: hash }, { where: { id } });
    res.redirect(`/admin/editStudent/${id}`);
  },
};
