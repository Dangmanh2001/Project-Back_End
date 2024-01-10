const model = require("../../../models/index");
const { Op } = require("sequelize");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const os = require("os");
const exportExcel = require("../../utils/exportExcel");
let data = null;

module.exports = {
  course: async (req, res) => {
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

    const { count, rows: courses } = await model.Course?.findAndCountAll({
      where: whereCondition,
      include: model.User,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });

    const pageCount = Math.ceil(count / limit);

    const message = req.flash("message");
    const user = req.user;

    res.render("admin/dashboard/course", {
      user,
      message,
      req,
      courses,
      pageCount,
      currentPage: parseInt(page),
    });
  },
  exportExcelCourse: async (req, res) => {
    const courses = [];
    data.forEach((e, index) => {
      courses.push({
        Stt: index + 1,
        Name: e.name,
        Price: e.price,
        Teacher: e.User.name,
        Number_of_trial: e.number_of_trial,
        Number_of_student: e.number_of_student,
      });
    });
    exportExcel(courses, "exported_data_courses.xlsx");
    res.redirect("/admin/courses");
  },
  addCourse: async (req, res) => {
    const user = req.user;
    const message = req.flash("message");
    const teacher = await model.User.findAll({
      where: {
        typeId: 2,
      },
    });
    res.render("admin/users/courses/addCourse", { user, message, teacher });
  },
  handleAddCourse: async (req, res) => {
    const { name, price, teacher, number_of_trial, number_of_student } =
      req.body;
    const course = await model.Course.findOne({
      where: {
        name,
      },
    });
    if (!course) {
      await model.Course.create({
        name,
        price,
        teacherId: teacher,
        number_of_trial,
        number_of_student,
      });
    }
    req.flash("message", "Khóa học đã tồn tại");

    res.redirect("/admin/addCourse");
  },
  editCourse: async (req, res) => {
    const user = req.user;
    const message = req.flash("message");
    const teacher = await model.User.findAll({
      where: {
        typeId: 2,
      },
    });

    res.render("admin/users/courses/editCourse", { user, message, teacher });
  },
  handleEditCourse: async (req, res) => {
    const { name, price, teacher, number_of_trial, number_of_student } =
      req.body;
    const { id } = req.params;

    await model.Course.update(
      { name, price, teacher, number_of_trial, number_of_student },
      { where: { id } }
    );
    res.redirect(`/admin/editCourse/${id}`);
  },
};
