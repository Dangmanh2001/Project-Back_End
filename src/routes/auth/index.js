const passport = require("passport");
var express = require("express");
var router = express.Router();
const authController = require("../../http/controllers/auth/login.controller");
const authController1 = require("../../http/controllers/auth/forgot.controller");
const authController2 = require("../../http/controllers/auth/otp.controller");
const authController3 = require("../../http/controllers/auth/change.password.controller");


const otpMiddleware = require("../../http/middlewares/otp.middleware");
const redirectMiddleware = require("../../http/middlewares/redirect.middleware");

/* GET home page. */
router.get("/login", redirectMiddleware, authController.index);
router.get("/forgot", authController1.forgot);
router.post("/forgot", authController1.handleForgot);
router.get("/otp", otpMiddleware, authController2.otp);
router.post("/otp", otpMiddleware, authController2.handleOtp);
router.get("/change", otpMiddleware, authController3.changeP);
router.post("/change", otpMiddleware, authController3.handlechangeP);

router.get("/google/redirect", passport.authenticate("google"));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/login",
    failureFlash: true,
    successRedirect: "/redirect",
  })
);

router.get("/facebook/redirect", passport.authenticate("facebook"));
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/auth/login",
    failureFlash: true,
    successRedirect: "/redirect",
  })
);
router.get("/github/redirect", passport.authenticate("github"));
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/auth/login",
    failureFlash: true,
    successRedirect: "/redirect",
  })
);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: true,
    successRedirect: "/redirect",
  })
);
router.get("/logout", function (req, res, next) {
  req.logout()
    delete req.session.status
    delete req.session.verify
    res.clearCookie("token");
    res.redirect("/auth/login");
  
});
module.exports = router;
