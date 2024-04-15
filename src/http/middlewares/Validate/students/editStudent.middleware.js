const model = require("../../../../models/index");

module.exports = async (req, res, next) => {
  const {id} =req.params
  const { email, name, password,address,phoneNumber } = req.body;
  const user = await model.User.findOne({ where: { email } });

  function countTruthyValues(...args) {
    return args.filter(Boolean).length;
  }
  if (
    countTruthyValues(
      email, name, password,address,phoneNumber
    ) < 5
  ) {
    req.flash("message", "Vui lòng nhập đầy đủ thông tin");
    res.redirect(`/admin/editStudent/${id}`);
    return;
  }
  if (!email) {
    req.flash("message", "Vui lòng nhập email");
    res.redirect(`/admin/editStudent/${id}`);
    return;
  }

  if (!name) {
    req.flash("message", "Vui lòng nhập tên");
    res.redirect(`/admin/editStudent/${id}`);
    return;
  }
  if (!password) {
    req.flash("message", "Vui lòng nhập mật khẩu");
    res.redirect(`/admin/editStudent/${id}`);
    return;
  }
  if (!address) {
    req.flash("message", "Vui lòng nhập địa chỉ");
    res.redirect(`/admin/editStudent/${id}`);
    return;
  }
  if (!phoneNumber) {
    req.flash("message", "Vui lòng nhập số điện thoại");
    res.redirect(`/admin/editStudent/${id}`);
    return;
  }
  if (user&&user.id !== +id) {
    req.flash("message", "Email đã tồn tại");
    res.redirect(`/admin/editStudent/${id}`);
    return;
  }
  req.flash("success", "Sửa học viên thành công");
  next();
};
