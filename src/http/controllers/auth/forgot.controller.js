const nodemailer = require("nodemailer");
const model = require("../../../models/index");
var rn = require("random-number");
const sendMail = require("../../utils/sendMail");

module.exports = {
  forgot: async (req, res) => {
    const message = req.flash("error");
    const title = "Forgot Password";

    res.render("auth/forgotPass", {
      layout: "layouts/auth.layout.ejs",
      message,
      title,
    });
  },
  handleForgot: async (req, res) => {
    const { email } = req.body;

    const random = {
      min: 1000,
      max: 9999,
      integer: true,
    };
    const user = await model.User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      req.flash("message", "Không hợp lệ");
      res.redirect("/auth/forgot");
      return;
    }
    const otp = await model.User_otp.findOne({
      where: {
        userId: user.id,
      },
    });
    if (!otp) {
      await model.User_otp.create({
        otp: rn(random),
        expires: new Date(),
        userId: user.id,
      });
    }
    await model.User_otp.update(
      { otp: rn(random) },
      {
        where: {
          userId: user.id,
        },
      }
    );
    const otpSend = await model.User_otp.findOne({
      where: {
        userId: user.id,
      },
    });

    sendMail(email, "OTP", "Hello", `<b>This is your otp:${otpSend.otp}</b>`);
    req.session.emailForgot = email;
    res.redirect("/auth/otp");
  },
};
