module.exports = (req, res, next) => {
  if (!req.user) {
    delete req.session.status
    res.redirect("/auth/login");
    return;
  }
  next();
};
