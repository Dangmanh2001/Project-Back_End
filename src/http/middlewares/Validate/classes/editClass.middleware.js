const model = require("../../../../models/index");

module.exports = async (req, res, next) => {
    const {id}=req.params
  const {
    name,
    number_of_student,
    opening,
    closing,
    schedule,
    study_time_start,
    study_time_end,
    teacher
  } = req.body;
  function countTruthyValues(...args) {
    return args.filter(Boolean).length;
  }
  const classroom = await model.Classes.findOne({
    where: {
      name
    },
  });

  if (
    countTruthyValues(
      name,
      number_of_student,
      opening,
      closing,
      schedule,
      study_time_start,
      study_time_end
    ) < 6
  ) {
    req.flash("message", "Vui lòng nhập đầy đủ thông tin");
    res.redirect(`/admin/class/editClass/${id}`);
    return;
  }
  if (!name) {
    req.flash("message", "Vui lòng nhập tên");
    res.redirect(`/admin/class/editClass/${id}`);
    return;
  }
  if (classroom&&classroom.id!==+id) {
    req.flash("message", "Lớp học đã tồn tại");
    res.redirect(`/admin/class/editClass/${id}`);
    return;
  }
  if (!number_of_student) {
    req.flash("message", "Vui lòng nhập sĩ số học viên");
    res.redirect(`/admin/class/editClass/${id}`);
    return;
  }
  if (!opening) {
    req.flash("message", "Vui lòng nhập ngày khai giảng");
    res.redirect(`/admin/class/editClass/${id}`);
    return;
  }
  if (!closing) {
    req.flash("message", "Vui lòng nhập ngày bế giảng");
    res.redirect(`/admin/class/editClass/${id}`);
    return;
  }
  if (!schedule) {
    req.flash("message", "Vui lòng nhập lịch học");
    res.redirect(`/admin/class/editClass/${id}`);
    return;
  }
  if (!study_time_start) {
    req.flash("message", "Vui lòng nhập thời gian bắt đầu");
    res.redirect(`/admin/class/editClass/${id}`);
    return;
  }
  if (!study_time_end) {
    req.flash("message", "Vui lòng nhập thời gian kết thúc");
    res.redirect(`/admin/class/editClass/${id}`);
    return;
  }
  req.flash("success", "Sửa lớp học thành công");
  next();
};
