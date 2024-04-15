const model = require("../../../models/index");
const { Op } = require("sequelize");
const exportExcel = require("../../utils/exportExcel");
let data = null;

module.exports = {
  course: async (req, res) => {
    const content = "Quản lý khóa học"
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
    const success = req.flash("success");
    const user = req.user;

    res.render("admin/dashboard/course", {
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
    res.redirect("/admin/courses");
  },
  addCourse: async (req, res) => {
    const success = req.flash("success");
    const content = "Thêm khóa học"
    const user = req.user;
    const message = req.flash("message");
    const teacher = await model.User.findAll({
      where: {
        typeId: 2,
      },
    });
    res.render("admin/users/courses/addCourse", { user, message, teacher,content,success });
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
    

    res.redirect("/admin/addCourse");
  },
  editCourse: async (req, res) => {
    const success = req.flash("success");
    const content = "Sửa khóa học"
    const user = req.user;
    const message = req.flash("message");
    const { id } = req.params;
    const course = await model.Course.findOne({where:{id}})
    const teacher = await model.User.findAll({
      where: {
        typeId: 2,
      },
    });

    res.render("admin/users/courses/editCourse", { user, message, teacher,content,course,success });
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
  deleteCourse:async(req,res)=>{
    const {id}=req.params
    
    await model.Course.destroy({where:{id}})
    req.flash("success","Xóa thành công")
    res.redirect("/admin/courses")
  }
};
