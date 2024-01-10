var express = require("express");
var router = express.Router();
const verificationController = require("../../http/controllers/verification/home.controller")


/* GET home page. */
router.get("/",verificationController.index)
router.post("/",verificationController.handleVerify)

module.exports = router;
