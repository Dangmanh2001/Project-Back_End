const model = require("../../../../models/index")
module.exports = async (req, res, next) => {
  const { name, price, teacher, number_of_trial, number_of_student } = req.body;
  const { id } = req.params;
  const course = await model.Course.findOne({where:{name}})
  if (!name && !price && !teacher && !number_of_trial && !number_of_student) {
    req.flash("message", "Vui lòng nhập đầy đủ thông tin");
    res.redirect(`/admin/editCourse/${id}`);
    return;
  }
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
    ) < 4
  ) {
    req.flash("message", "Vui lòng nhập đầy đủ thông tin");
    res.redirect(`/admin/editCourse/${id}`);
    return;
  }
  if (!name) {
    req.flash("message", "Vui lòng nhập tên");
    res.redirect(`/admin/editCourse/${id}`);
    return;
  }
  if (course&&course.id!==+id){
    req.flash("message", "Khóa học đã tồn tại");
    res.redirect(`/admin/editCourse/${id}`);
    return;
  }
  if (!price) {
    req.flash("message", "Vui lòng nhập giá khóa học");
    res.redirect(`/admin/editCourse/${id}`);
    return;
  }
  if (!teacher) {
    req.flash("message", "Vui lòng thêm giảng viên dạy khóa học");
    res.redirect(`/admin/editCourse/${id}`);
    return;
  }
  if (!number_of_trial) {
    req.flash("message", "Vui lòng nhập số buổi học thử");
    res.redirect(`/admin/editCourse/${id}`);
    return;
  }
  if (!number_of_student) {
    req.flash("message", "Vui lòng nhập sĩ số học viên");
    res.redirect(`/admin/editCourse/${id}`);
    return;
  }
  req.flash("success", "Sửa khóa học thành công");
  next();
};
