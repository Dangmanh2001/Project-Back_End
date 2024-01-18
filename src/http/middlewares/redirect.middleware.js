const model = require("../../models/index");

module.exports = async (req, res, next) => {
  const user = req.user;

  if (!user?.first_login) {
    if (user?.typeId === 2) {
      res.redirect("/teacher/changePass");
    } else if (user?.typeId === 3) {
      res.redirect("/student/changePass");
    } else if (user?.typeId === 1) {
      res.redirect("/admin/changePass");
    }else{
      next()
    }
    return
  }

  if(req.session.status){
    switch (req.user?.typeId) {
      case 1:
        delete req.session.status;

        res.redirect("/admin/infor");
        break;
      case 2:
        delete req.session.status;
        res.redirect("/teacher/infor");
        break;
      case 3:
        delete req.session.status;
        res.redirect("/student/infor");
        break;
      default:
        delete req.session.status;
        res.redirect("/auth/login");
        break;}
        return
  }
  
  if (user?.typeId === 2) {
    res.redirect("/teacher");
  } else if (user?.typeId === 3) {
    res.redirect("/student");
  } else if (user?.typeId === 1) {
    res.redirect("/admin");
  }

};
