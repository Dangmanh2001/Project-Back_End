const model = require("../../../models/index");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const exportExcel = require("../../utils/exportExcel");
const moment = require('moment');
let data = null;

module.exports = {
  teacher: async (req, res) => {
    const content = "Quản lý giảng viên"
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
      [Op.and]: [{ typeId: 2 }, ...filters],
    };

    const { count, rows: teachers } = await model.User.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });
    

    const pageCount = Math.ceil(count / limit);

    const message = req.flash("message");
    const success = req.flash("success");
    const user = req.user;

    res.render("admin/dashboard/teacher", {
      success,
      content,
      message,
      user,
      req,
      teachers,
      pageCount,
      currentPage: parseInt(page),
    });
  },
  exportExcelTeacher: async (req, res) => {
    const teachers = [];
    data.forEach((e, index) => {
      teachers.push({ Stt: index + 1, Name: e.name, Email: e.email });
    });
    exportExcel(teachers, "exported_data_teachers.xlsx");
    res.redirect("/admin/teachers");
  },
  addTeacher: async (req, res) => {
    const success = req.flash("success");
    const content = "Thêm giảng viên"
    const user = req.user;

    const message = req.flash("message");
    res.render("admin/users/teachers/addTeacher", { user, message,content,success });
  },
  handleAddTeacher: async (req, res) => {
    const { name, email, password } = req.body;

    const passwordHash = bcrypt.hash(password, 10);
    const hash = await passwordHash;

    await model.User.create({ name, email, password: hash, typeId: 2 });

    res.redirect("/admin/addTeacher");
  },

  editTeacher: async (req, res) => {
    const content = "Sửa giảng viên"
    const success = req.flash("success");
    const user = req.user;
    const message = req.flash("message");
    const { id } = req.params;
    const teacher =await model.User.findOne({where:{id}})


    res.render("admin/users/teachers/editTeacher", { user, message ,content,teacher,success});
  },

  handleEditTeacher: async (req, res) => {
    const { email, name, password } = req.body;
    const { id } = req.params;
    const passwordHash = bcrypt.hash(password, 10);
    const hash = await passwordHash;
    await model.User.update({ name, email, password: hash }, { where: { id } });
    res.redirect(`/admin/editTeacher/${id}`);
  },
  calendar:async(req,res)=>{
    const {id} = req.params
    
    const user = req.user
    const content = "Calendar"
    const teacherCalendar =await model.Teacher_calendar.findAll({
      where:{
        teacherId:id
      },
      include: model.Classes
    })
    console.log(teacherCalendar)
const events = teacherCalendar.map((e) => {
  const isoDate = e.scheduleDate;
    const formattedDate = moment(isoDate).format('YYYY-MM-DD');




     return {
      title: e.Class?.name+" "+e.Class?.study_time,
      start: formattedDate
    }
   
});
    

    
    res.render("admin/users/teachers/calendar",{user,content,events,id})
},
deleteTeacher:async(req,res)=>{
  const {id}=req.params
  await model.Login_token.destroy({where:{
    userId:id
  }})
  await model.User.destroy({where:{id}})
  req.flash("success","Xóa thành công")
  res.redirect("/admin/teachers")
}
};
