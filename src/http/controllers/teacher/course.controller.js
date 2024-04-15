const model = require("../../../models/index");
const { Op } = require("sequelize");
const exportExcel = require("../../utils/exportExcel");
let data = null;

module.exports = {
  course: async (req, res) => {
    const content = "Quản lý khóa học"
    const user = req.user;
    const { keyword, page = 1, limit = 3 } = req.query;
    const filters = [];
    if (keyword) {
      filters.push({
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${keyword}%`,
            }
          },
        ],
      });
    }

    const whereCondition = {
        teacherId:user.id,
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
    const success = req.flash("success");
    

    res.render("teacher/products/course", {
      success,
      content,
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
    res.redirect("/teacher/courses");
  },

};
