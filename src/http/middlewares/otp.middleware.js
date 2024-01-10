module.exports = (req, res, next) => {
  if (!req.session.emailForgot) {
    return res.redirect("/auth/login");
  }
  next();
};
