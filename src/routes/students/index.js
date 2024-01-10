var express = require("express");
var router = express.Router();
const HomeController = require("../../http/controllers/students/home.controller");
/* GET home page. */
router.get("/", HomeController.index);
router.get("/infor", HomeController.infor);
router.get("/changePass",HomeController.changePass)
router.post("/changePass",HomeController.handleChangePass)
router.get("/delete/:provider",HomeController.deleteLink)

module.exports = router;
