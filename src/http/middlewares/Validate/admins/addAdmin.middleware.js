const model = require("../../../../models/index");

module.exports = async (req, res, next) => {
  const { email, name } = req.body;
  const user = await model.User.findOne({
    where: {
      email,
    },
  });

  if (!email && !name) {
    req.flash("message", "Vui lòng nhập đầy đủ thông tin");
    res.redirect("/admin/addAdmin");
    return;
  }
  if (!email) {
    req.flash("message", "Vui lòng nhập email");
    res.redirect("/admin/addAdmin");
    return;
  }
  if (!name) {
    req.flash("message", "Vui lòng nhập tên");
    res.redirect("/admin/addAdmin");
    return;
  }
  if (user) {
    req.flash("message", "Tài khoản đã tồn tại");
    res.redirect("/admin/addAdmin");
    return;
  }
  next()
};
