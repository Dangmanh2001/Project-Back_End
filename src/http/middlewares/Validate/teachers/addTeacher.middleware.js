const model = require("../../../../models/index");

module.exports = async (req, res, next) => {
  const { email, name, password } = req.body;
  const user = await model.User.findOne({
    where: {
      email,
    },
  });

  if (!email && !name && !password) {
    req.flash("message", "Vui lòng nhập đầy đủ thông tin");
    res.redirect("/admin/addTeacher");
    return;
  }
  if (!((email && name) || (email && password) || (name && password))) {
    req.flash("message", "Vui lòng nhập đầy đủ thông tin");
    res.redirect("/admin/addTeacher");
    return;
  }
  if (!email) {
    req.flash("message", "Vui lòng nhập email");
    res.redirect("/admin/addTeacher");
    return;
  }

  if (!name) {
    req.flash("message", "Vui lòng nhập tên");
    res.redirect("/admin/addTeacher");
    return;
  }
  if (!password) {
    req.flash("message", "Vui lòng nhập mật khẩu");
    res.redirect("/admin/addTeacher");
    return;
  }
  if (user) {
    req.flash("message", "Tài khoản đã tồn tại");
    res.redirect("/admin/addTeacher");
    return;
  }
  req.flash("success", "Thêm giảng viên thành công");
  next();
};
