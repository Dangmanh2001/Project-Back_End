const model = require("../../../../models/index");

module.exports = async (req, res, next) => {
  const { email, name, password } = req.body;
  const user = await model.User.findOne({ where: { email } });

  if (!email && !name && !password) {
    req.flash("message", "Vui lòng nhập đầy đủ thông tin");
    res.redirect(`/admin/editTeacher/${id}`);
    return;
  }
  if (!((email && name) || (email && password) || (name && password))) {
    req.flash("message", "Vui lòng nhập đầy đủ thông tin");
    res.redirect(`/admin/editTeacher/${id}`);
    return;
  }
  if (!email) {
    req.flash("message", "Vui lòng nhập email");
    res.redirect(`/admin/editTeacher/${id}`);
    return;
  }

  if (!name) {
    req.flash("message", "Vui lòng nhập tên");
    res.redirect(`/admin/editTeacher/${id}`);
    return;
  }
  if (!password) {
    req.flash("message", "Vui lòng nhập mật khẩu");
    res.redirect(`/admin/editTeacher/${id}`);
    return;
  }
  if (user) {
    req.flash("message", "Email đã tồn tại");
    res.redirect(`/admin/editTeacher/${id}`);
    return;
  }
  next();
};
