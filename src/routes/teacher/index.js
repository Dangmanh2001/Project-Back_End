var express = require("express");
var router = express.Router();
const teacherController = require("../../http/controllers/teacher/home.controler");

/* GET home page. */
router.get("/", teacherController.index);
router.get("/infor", teacherController.infor);
router.get("/changePass",teacherController.changePass)
router.post("/changePass",teacherController.handleChangePass)
router.get("/delete/:provider",teacherController.deleteLink)

module.exports = router;
