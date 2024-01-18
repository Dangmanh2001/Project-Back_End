const bcrypt = require("bcrypt");
const model = require("../../../models/index");

module.exports = {
  changeP: (req, res) => {
    const message = req.flash("message");
    const title = "Change Password";
    res.render("auth/changePass", {
      layout: "layouts/auth.layout.ejs",
      title,
      message,
    });
  },
  handlechangeP: async (req, res) => {
    const { password } = req.body;

    if (!password) {
      req.flash("message", "Vui lòng nhập mật khẩu");
      res.redirect("/auth/change");
      return;
    }
    const password1 = bcrypt.hashSync(password, 10);
    await model.User.update(
      { password: password1 },
      {
        where: {
          email: req.session.emailForgot,
        },
      }
    );
      const user = await model.User.findOne({
        where:{
          email: req.session.emailForgot
        }
      })
    await model.User_otp.destroy({
      where: {
        userId:user.id,
      },
    });
    delete req.session.emailForgot;

    res.redirect("/auth/change");
  },
};
