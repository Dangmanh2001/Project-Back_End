const model = require("../../../models/index");
const { Op } = require("sequelize");
module.exports = {
  otp: (req, res) => {
    const title = "Otp";
    const message = req.flash("message");
    res.render("auth/otp", {
      layout: "layouts/auth.layout.ejs",
      title,
      message,
    });
  },
  handleOtp: async (req, res) => {
    const message = req.flash("message");
    const { otp } = req.body;
    const user = await model.User.findOne({
      where: {
        email: req.session.emailForgot,
      },
    });
    const otp1 = await model.User_otp.findOne({
      where: {
        [Op.and]: [{ userId: user.id }, { otp }],
      },
    });

    if (!otp) {
      req.flash("message", "Vui lòng nhập OTP");
      res.redirect("/auth/otp");
      return;
    }
    if (!otp1) {
      req.flash("message", "OTP không hợp lệ");
      res.redirect("/auth/otp");
      return;
    }

    res.redirect("/auth/change");
  },
};
