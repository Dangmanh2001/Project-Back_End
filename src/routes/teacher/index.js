var express = require("express");
var router = express.Router();
const homeController = require("../../http/controllers/teacher/home.controler");
const studentsController = require("../../http/controllers/teacher/students.controller");
const classesController = require("../../http/controllers/teacher/classes.controller");
const courseController = require("../../http/controllers/teacher/course.controller");

/* GET home page. */
router.get("/", homeController.index);
router.get("/infor", homeController.infor);
router.post("/infor",homeController.handleInfor)
router.get("/changePass",homeController.changePass)
router.post("/changePass",homeController.handleChangePass)
router.get("/delete/:provider",homeController.deleteLink)

//Student
router.get("/students", studentsController.student);
router.get("/students/exportExcel", studentsController.exportExcelStudent);

//Class
router.get("/classes", classesController.class);
router.get("/classes/exportExcel", classesController.exportExcelClass);

//Course
router.get("/courses", courseController.course);
router.get("/courses/exportExcel", courseController.exportExcelCourse);


module.exports = router;
