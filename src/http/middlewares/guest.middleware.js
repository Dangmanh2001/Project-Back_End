module.exports = (req, res, next) => {
  if (req.user) {
    
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
      default:
        res.redirect("/auth/login");
    }
  }
  next();
};
