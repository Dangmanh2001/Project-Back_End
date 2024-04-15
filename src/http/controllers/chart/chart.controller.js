const model = require("../../../models/index");
const chartClass = require("../../utils/chartClass");
const chartStudent = require("../../utils/chartStudent");
module.exports = {
    student:async(req,res)=>{
        const user = req.user
        const content = "Biểu đồ học viên năm 2024"
        const data = [0,0,0,0,0,0,0,0,0,0,0,0];
    const users = await model.User.findAll({where:{
      typeId:3
    }})
    chartStudent(users,data)
 res.render("admin/users/charts/chartStudent",{user,content,data})
    },
   class:async(req,res)=>{
    const user = req.user
    const content = "Biểu đồ lớp học năm 2024"
    const data = [0,0,0,0,0,0,0,0,0,0,0,0];
const classes = await model.Classes.findAll()
chartClass(classes,data)
res.render("admin/users/charts/chartClass",{user,content,data})
},
  quantity:async(req,res)=>{
    const user = req.user
    const content = "Biểu đồ thống kê số lượng"
    
    const {count:quantityStudent,row:students} = await model.User.findAndCountAll({
      where:{
        typeId:3
      }
    })
    const {count:quantityTeacher,row:teachers} = await model.User.findAndCountAll({
      where:{
        typeId:2
      }
    })
    const {count:quantityTutors,row:tutors} = await model.User.findAndCountAll({
      where:{
        typeId:4
      }
    })
    const {count:quantityCourse,row:courses} = await model.Course.findAndCountAll({})
    const {count:quantityClass,row:classes} = await model.Classes.findAndCountAll({})
    const datasets = [quantityStudent, quantityCourse, quantityClass, quantityTeacher,quantityTutors];
    console.log(datasets)
    
    res.render("admin/users/charts/chartQuantity",{user,content,datasets})
  }
}
