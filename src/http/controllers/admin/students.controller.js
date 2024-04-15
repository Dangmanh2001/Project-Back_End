const model = require("../../../models/index");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const exportExcel = require("../../utils/exportExcel");
let data = null;

module.exports = {
  student: async (req, res) => {
    const content = "Quản lý học viên"
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
      include: [
        {
          model: model.Student_class,
          
          include: [
            {
              model: model.Classes,
              // Thêm các tùy chọn hoặc thuộc tính cần thiết cho mối quan hệ Classes ở đây
            },
            {
              model: model.Learning_status,
              // Thêm các tùy chọn hoặc thuộc tính cần thiết cho mối quan hệ Learning_status ở đây
            }
          ],
          
          // Thêm các tùy chọn hoặc thuộc tính cần thiết cho mối quan hệ ở đây
        },
        
      ],
      where: whereCondition,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      raw: true,
    nest: true,
    });

    const pageCount = Math.ceil(count / limit);

    const message = req.flash("message");
    const success = req.flash("success");
    const user = req.user;


    res.render("admin/dashboard/student", {
      success,
      content,
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
    res.redirect("/admin/students");
  },
  addStudent: async (req, res) => {
    const content = "Thêm học viên"
    const success = req.flash("success");
    const user = req.user;

    const message = req.flash("message");
    res.render("admin/users/students/addStudent", { user, message,content,success });
  },
  handleAddStudent: async (req, res) => {
    const { name, email, password } = req.body;

    const passwordHash = bcrypt.hash(password, 10);
    const hash = await passwordHash;

    await model.User.create({ name, email, password: hash, typeId: 3 });

    res.redirect("/admin/addStudent");
  },
  editStudent: async (req, res) => {
    const success = req.flash("success");
    const content = "Sửa học viên"
    const user = req.user;
    const message = req.flash("message");
    const {id} = req.params
    const student = await model.User.findOne({where:{id}})

    res.render("admin/users/students/editStudent", { user, message,content,student,success });
  },

  handleEditStudent: async (req, res) => {
    const { email, name, password,address,phoneNumber } = req.body;
    const { id } = req.params;

    console.log(id);
    const passwordHash = bcrypt.hash(password, 10);
    const hash = await passwordHash;
    await model.User.update({ name, email, password: hash,address,phoneNumber }, { where: { id } });
    res.redirect(`/admin/editStudent/${id}`);
  },
  deleteStudent:async(req,res)=>{
    const {id}=req.params
    await model.Login_token.destroy({where:{
      userId:id
    }})
    await model.User.destroy({where:{id}})
    req.flash("success","Xóa thành công")
    res.redirect("/admin/students")
  }
};
