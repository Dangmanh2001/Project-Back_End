const model = require("../../../models/index");
const { Op } = require("sequelize");
const exportExcel = require("../../utils/exportExcel");
const sequelize = require("sequelize")

let data = null;

module.exports = {
  class: async (req, res) => {
    const user = req.user;
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
      [Op.and]: [...filters]
    };

    const { count, rows: classes } = await model.Classes?.findAndCountAll({
      
      include: [
        {
          model:model.User,
          where:{
            id:11
          }
        },
        
       
      ],
      where: whereCondition,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      raw: true,
      nest: true,
    });
    console.log(classes)
    
    
    

    const pageCount = Math.ceil(count / limit);

    const message = req.flash("message");
    

    res.render("teacher/products/class", {
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
    res.redirect("/teacher/classes");
  },

};
