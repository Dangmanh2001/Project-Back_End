var express = require("express");
var router = express.Router();
const HomeController = require("../../http/controllers/students/home.controller");
/* GET home page. */
router.get("/", HomeController.index);

module.exports = router;
