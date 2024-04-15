var express = require("express");
var router = express.Router();
const dashboardController = require("../../http/controllers/admin/dashboard.controller");
const adminController = require("../../http/controllers/admin/users.controller");
const teacherController = require("../../http/controllers/admin/teachers.controller");
const studentController = require("../../http/controllers/admin/students.controller");
const courseController = require("../../http/controllers/admin/courses.controller");
const classController = require("../../http/controllers/admin/classes.controller");
const addClassMiddleware = require("../../http/middlewares/Validate/classes/addClass.middleware");
const addCourseMiddleware = require("../../http/middlewares/Validate/courses/addCourse.middleware");
const addAdminMiddleware = require("../../http/middlewares/Validate/admins/addAdmin.middleware");
const addTeacherMiddleware = require("../../http/middlewares/Validate/teachers/addTeacher.middleware");
const editTeacherMiddleware = require("../../http/middlewares/Validate/teachers/editTeacher.middleware");
const editAdminMiddleware = require("../../http/middlewares/Validate/admins/editAdmin.middleware");
const addStudentMiddleware = require("../../http/middlewares/Validate/students/addStudent.middleware");
const editStudentMiddleware = require("../../http/middlewares/Validate/students/editStudent.middleware");
const editCoursesMiddleware = require("../../http/middlewares/Validate/courses/editCourses.middleware");
const editClassMiddleware = require("../../http/middlewares/Validate/classes/editClass.middleware");
const chartController = require("../../http/controllers/chart/chart.controller");
const  decentralizationController  = require("../../http/controllers/admin/decentralization.controller");


/* GET home page. */
router.get("/", dashboardController.index);
router.get("/infor", dashboardController.infor);
router.post("/infor",dashboardController.handleInfor)
router.get("/changePass", dashboardController.changePass);
router.post("/changePass", dashboardController.handleChangePass);
router.get("/delete/:provider", dashboardController.deleteLink);

//CRUD Admin
router.get("/users", adminController.user);
router.get("/users/exportExcel", adminController.exportExcelAdmin);
router.get("/users/importExcel", adminController.importExcelAdmin);
router.get("/addAdmin", adminController.addAdmin);
router.post("/addAdmin", addAdminMiddleware, adminController.handleAddAdmin);
router.get("/editAdmin/:id", adminController.editAdmin);
router.post(
  "/editAdmin/:id",
  editAdminMiddleware,
  adminController.handleEditAdmin
);
router.get("/deleteAdmin/:id",adminController.deleteAdmin)

//CRUD Teacher
router.get("/teachers", teacherController.teacher);
router.get("/teachers/exportExcel", teacherController.exportExcelTeacher);
router.get("/addTeacher", teacherController.addTeacher);
router.get("/teachers/calendar/:id",teacherController.calendar)
router.post(
  "/addTeacher",
  addTeacherMiddleware,
  teacherController.handleAddTeacher
);
router.get("/editTeacher/:id", teacherController.editTeacher);
router.post(
  "/editTeacher/:id",
  editTeacherMiddleware,
  teacherController.handleEditTeacher
);
router.get("/deleteTeacher/:id",teacherController.deleteTeacher)
//CRUD Student
router.get("/students", studentController.student);
router.get("/students/exportExcel", studentController.exportExcelStudent);
router.get("/addStudent", studentController.addStudent);
router.post(
  "/addStudent",
  addStudentMiddleware,
  studentController.handleAddStudent
);
router.get("/editStudent/:id", studentController.editStudent);
router.post(
  "/editStudent/:id",
  editStudentMiddleware,
  studentController.handleEditStudent
);
router.get("/deleteStudent/:id",studentController.deleteStudent)

//CRUD Course
router.get("/courses", courseController.course);
router.get("/courses/exportExcel", courseController.exportExcelCourse);
router.get("/addCourse", courseController.addCourse);
router.post(
  "/addCourse",
  addCourseMiddleware,
  courseController.handleAddCourse
);
router.get("/editCourse/:id", courseController.editCourse);
router.post(
  "/editCourse/:id",
  editCoursesMiddleware,
  courseController.handleEditCourse
);
router.get("/deleteCourse/:id",courseController.deleteCourse)

//CRUD Class
router.get("/classes", classController.class);
router.get("/classes/exportExcel", classController.exportExcelClass);
router.get("/addClass", classController.addClass);
router.post("/addClass", addClassMiddleware, classController.handleAddClass);
router.get("/class/addStudent/:id", classController.addStudentInClass);
router.post("/class/addStudent/:id", classController.handleAddStudentInClass);
router.get("/class/editClass/:id",classController.editClass)
router.post("/class/editClass/:id",editClassMiddleware,classController.handleEditClass)
router.get("/class/deleteStudent/:id", classController.deleteStudentInClass);
router.post(
  "/class/deleteStudent/:id",
  classController.handleDeleteStudentInClass
);
router.get("/deleteClass",classController.deleteClass)

//Chart
router.get("/chartStudent",chartController.student)
router.get("/chartClass",chartController.class)
router.get("/chartQuantity",chartController.quantity)

//Decentralization
router.get("/decentralization",decentralizationController.decentralization)
router.get("/addRole",decentralizationController.addRole)
router.post("/addRole",decentralizationController.handleAddRole)
router.get("/editRole/:id",decentralizationController.editRole)


module.exports = router;
