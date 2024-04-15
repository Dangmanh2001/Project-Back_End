const model = require("../../../models/index");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const exportExcel = require("../../utils/exportExcel");
const moment = require('moment');
let data = null;

module.exports = {
  student: async (req, res) => {
    const content = "Quản lý học viên"
    const { keyword, page = 1, limit = 3 } = req.query;
    const user = req.user;
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

    const teachers = await model.User.findOne({
      where:{id:user.id},
      include:model.Classes
    })
const id = teachers.Classes.map(e=>{
  return e.id
})
console.log(id)
    const { count, rows: students } = await model.User.findAndCountAll({
      attributes: [
        'id', 'name', 'email', 'password', 'address', 'phoneNumber', 'first_login', 'createdAt', 'updatedAt'
      ],
      include: [
        {
          model: model.Student_class,
          where:{
            classId:{
              [Op.in]:id
            }
          },
          attributes: [
            'id', 'studentId', 'classId', 'statusId', 'completeDate', 'dropDate', 'recover', 'createdAt', 'updatedAt'
          ],
          include: [
            {
              model: model.Classes,
              attributes: [
                'id', 'name', 'number_of_student', 'opening', 'closing', 'schedule', 'study_time', 'createdAt', 'updatedAt'
              ],
              
              include: [
                {
                  model: model.User,
                  as: 'Users',
                  attributes: [
                    'id', 'name', 'email', 'password', 'address', 'phoneNumber', 'first_login', 'createdAt', 'updatedAt', 'TypeId'
                  ],
                }
              ]
            },
            {
              model: model.Learning_status,
              attributes: ['id', 'name', 'createdAt', 'updatedAt']
            }
          ]
        }
      ],
      where: whereCondition,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      raw: true,
      nest: true,
    });
    
    
    const studentsWithUserId = students.filter(student => student.Student_class && student.Student_class.Class && student.Student_class.Class.Users && student.Student_class.Class.Users.id === user.id);





    const pageCount = Math.ceil(count / limit);

    const message = req.flash("message");
    const success = req.flash("success");
    

    res.render("teacher/products/student", {
      success,
      content,
      message,
      user,
      req,
      studentsWithUserId,
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
    res.redirect("/teacher/students");
  },

};
