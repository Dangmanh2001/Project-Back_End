const { v4: uuidv4 } = require("uuid");
const model = require("../../models/index");

module.exports = async (req, res, next) => {
  const { id } = req.user;

  const token = uuidv4();

  const loginToken = await model.Login_token.findOne({
    where: { userId: id },
  });
  if (!loginToken) {
    await model.Login_token.create({ userId: id, token });
    res.cookie("token", token, {
      maxAge: 90000000,
      httpOnly: true,
      secure: false,
      overwrite: true,
    });

    next();
    return;
  }

  if (!req.cookies?.token) {
    await model.Login_token.update(
      { token: token },
      {
        where: {
          userId: id,
        },
      }
    );

    res.cookie("token", token, {
      maxAge: 90000000,
      httpOnly: true,
      secure: false,
      overwrite: true,
    });
  }

  const tokenDb = await model.Login_token.findOne({
    where: { userId: id },
  });

  const cookie = req.cookies;
  if (cookie.token && cookie.token !== tokenDb.token) {
    res.clearCookie("token");
    res.redirect("/auth/logout");
    return;
  }

  next();
};
