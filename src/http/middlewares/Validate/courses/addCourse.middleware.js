module.exports = (req, res, next) => {
  const { name, price, teacher, number_of_trial, number_of_student } = req.body;
  function countTruthyValues(...args) {
    return args.filter(Boolean).length;
  }
  if (
    countTruthyValues(
      name,
      price,
      teacher,
      number_of_trial,
      number_of_student
    ) < 5
  ) {
    req.flash("message", "Vui lòng nhập đầy đủ thông tin");
    return res.redirect("/admin/addClass");
  }

  if (!name) {
    req.flash("message", "Vui lòng nhập tên");
    return res.redirect("/admin/addClass");
  }

  if (!price) {
    req.flash("message", "Vui lòng nhập giá");
    return res.redirect("/admin/addClass");
  }

  if (!number_of_trial) {
    req.flash("message", "Vui lòng nhập số lần học thử");
    return res.redirect("/admin/addClass");
  }

  if (!number_of_student) {
    req.flash("message", "Vui lòng nhập sĩ số");
    return res.redirect("/admin/addClass");
  }

  // Nếu tất cả điều kiện đều thoả mãn, chuyển sang middleware hoặc route tiếp theo
  next();
};
