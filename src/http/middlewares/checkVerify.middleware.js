module.exports = (req, res, next) => {
  if (req.session.verify) {
    
    switch (req.user?.typeId) {
      case 1:
        res.redirect("/admin");
        break;
      case 2:
        res.redirect("/teacher");
        break;
      case 3:

        res.redirect("/student");
        break;
        case 4:
        res.redirect("/teacher");
        break;
      default:
        res.redirect("/auth/login");
    }
  }
  next();
};
