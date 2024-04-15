const model = require("../../../models/index");
const { Op } = require("sequelize");
const exportExcel = require("../../utils/exportExcel");
const getAllDays = require("../../utils/getAllDays");

let data = null;

module.exports = {
  class: async (req, res) => {
    const content = "Quản lý lớp học"
    const success = req.flash("success");
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
      success,
      content,
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
    const success = req.flash("success");
    const content = "Thêm lớp học"
    const user = req.user;
    const message = req.flash("message");
    const teachers = await model.User.findAll({
      where: {
        typeId: 2,
      },
    });

    const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    res.render("admin/users/classes/addClass", {
      success,
      content,
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
       getAllDays(cls.opening,cls.closing,cls.schedule).forEach(async(e)=>{
        await model.Teacher_calendar.create({
          teacherId:teacher,
          classId:cls.id.toString(),
          scheduleDate:e
        })
      })
      
    }

    res.redirect("/admin/addClass");
  },
  editClass: async(req,res)=>{
    const {id}=req.params
    const content = "Sửa lớp học"
    const user = req.user
    const success = req.flash("success");
    const message = req.flash("message")
    const classes = await model.Classes.findOne({where:{
      id
    }})
    const teachers = await model.User.findAll({
      where: {
        typeId: 2,
      },
    });
    const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    res.render("admin/users/classes/editClass",{ content,user,message,id,teachers,days,classes,success })
  },
  handleEditClass:async(req,res)=>{
    const {id}=req.params
    const {name,number_of_student,opening,closing,schedule,study_time_start,study_time_end,teacher} = req.body
    
    await model.Classes.update({name,number_of_student,opening,closing,schedule,study_time:study_time_start+"-"+study_time_end},{where:{
      id
    }})
    const cls = await model.Classes.findOne({where:{id}})
    
    cls.setUsers(
      await model.User.findOne({
        where: {
          id: teacher,
        },
      })
    );
    
    getAllDays(cls.opening,cls.closing,cls.schedule).forEach(async(e)=>{
      await model.Teacher_calendar.create({
        teacherId:teacher,
        classId:cls.id.toString(),
        scheduleDate:e
      })
    })
    if(teacher==="Không"){

      

      await model.Teacher_calendar.destroy({where:{
        classId:id
      }})
      cls.removeUser(
        await model.User.findAll()
      )
    }
    
    res.redirect(`/admin/class/editClass/${id}`)
  },
  addStudentInClass: async (req, res) => {
    const content = "Thêm học viên vào lớp học"
    const success = req.flash("success");
    const user = req.user;
    const message = req.flash("message");
    const students = await model.User.findAll({
      where: {
        typeId: 3,
      },
      include: model.Student_class,
    });
    res.render("admin/users/classes/addStudentInClass", {
      success,
      content,
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
      req.flash("success","Thêm học viên vào lớp học thành công")
    } else {
      studentId.forEach(async (e) => {
        await model.Student_class.create({
          studentId: e,
          classId: id,
          statusId: 1,
        });
      });
      req.flash("success","Thêm học viên vào lớp học thành công")
    }
    res.redirect(`/admin/class/addStudent/${id}`);
  },
  deleteStudentInClass: async (req, res) => {
    const content = "Xóa học viên khỏi lớp học"
    const { id } = req.params;
    const user = req.user;
    const message = req.flash("message");
    const success = req.flash("success")
    const students = await model.User.findAll({
      where: {
        typeId: 3,
      },
      include: model.Student_class,
    });
    res.render("admin/users/classes/deleteStudentInClass", {content,
      user,
      message,
      students,
      id,
      success
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
      req.flash("success","Xóa học viên khỏi lớp học thành công")
    } else {
      studentId.forEach(async (e) => {
        await model.Student_class.destroy({
          where: {
            studentId: e,
            classId: id,
          },
        });
      });
      req.flash("success","Xóa học viên khỏi lớp học thành công")
    }
    res.redirect(`/admin/class/deleteStudent/${id}`);
  },
  deleteClass:async(req,res)=>{
    const {id}=req.params
    
    await model.Classes.destroy({where:{id}})
    req.flash("success","Xóa thành công")
    res.redirect("/admin/courses")
  }
};
