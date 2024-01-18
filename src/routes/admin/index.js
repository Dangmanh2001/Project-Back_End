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
const calendarController = require("../../http/controllers/admin/calendar.controller");

/* GET home page. */
router.get("/", dashboardController.index);
router.get("/infor", dashboardController.infor);
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

//CRUD Teacher
router.get("/teachers", teacherController.teacher);
router.get("/teachers/exportExcel", teacherController.exportExcelTeacher);
router.get("/addTeacher", teacherController.addTeacher);
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

//CRUD Class
router.get("/classes", classController.class);
router.get("/classes/exportExcel", classController.exportExcelClass);
router.get("/addClass", classController.addClass);
router.post("/addClass", addClassMiddleware, classController.handleAddClass);
router.get("/class/addStudent/:id", classController.addStudentInClass);
router.post("/class/addStudent/:id", classController.handleAddStudentInClass);
router.get("/class/deleteStudent/:id", classController.deleteStudentInClass);
router.post(
  "/class/deleteStudent/:id",
  classController.handleDeleteStudentInClass
);
router.get("/class/addTeacher/:id", classController.addTeacherInClass);
router.get("/class/deleteTeacher/:id", classController.deleteTeacherInClass);

//Calendar
router.get("/calendar",calendarController.calendar)

module.exports = router;
