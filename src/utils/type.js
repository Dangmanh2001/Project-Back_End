module.exports = (req, res, next) => {
  const user = req.user;
  if (user.typeId === 2) {
    type = "teacher";
  } else if (user.typeId === 3) {
    type = "student";
  } else if (user.typeId === 1) {
    type = "admin";
  }
  next();
};
