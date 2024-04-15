const model = require("../../../../models/index");

module.exports = async (req, res, next) => {
  const { email, name, password } = req.body;
  const {id} = req.params
  const user = await model.User.findOne({ where: { email } });

  if (!email && !name && !password) {
    req.flash("message", "Vui lòng nhập đầy đủ thông tin");
    res.redirect(`/admin/editAdmin/${id}`);
    return;
  }
  if (!((email && name) || (email && password) || (name && password))) {
    req.flash("message", "Vui lòng nhập đầy đủ thông tin");
    res.redirect(`/admin/editAdmin/${id}`);
    return;
  }
  if (!email) {
    req.flash("message", "Vui lòng nhập email");
    res.redirect(`/admin/editAdmin/${id}`);
    return;
  }

  if (!name) {
    req.flash("message", "Vui lòng nhập tên");
    res.redirect(`/admin/editAdmin/${id}`);
    return;
  }
  if (!password) {
    req.flash("message", "Vui lòng nhập mật khẩu");
    res.redirect(`/admin/editAdmin/${id}`);
    return;
  }
  if (user&&user.id!==+id) {
    req.flash("message", "Email đã tồn tại");
    res.redirect(`/admin/editAdmin/${id}`);
    return;
  }
  req.flash("success","Sửa admin thành công")
  next();
};
