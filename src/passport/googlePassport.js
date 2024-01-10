//Xử lý đăng nhập thông qua mạng xã hội
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const model = require("../models/index");
const { Op } = require("sequelize");

const User = model.User;
const User_social = model.User_social;

module.exports = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ["profile", "email"],
    passReqToCallback: true,
  },
  async (req, token, refreshToken, profile, done) => {
    const { id, provider } = profile;

    if (!req.user) {
      const providerLogin = await User_social.findOne({
        where: {
          [Op.and]: [{ provider: provider }, { providerId: id }],
        },
      });

      if (!providerLogin) {
        return done(null, false, { message: "Tài khoản chưa được liên kết" });
      }
      const user = await User.findOne({
        where: {
          id: providerLogin.userId,
        },
      });
      req.session.verify = "done";
      return done(null, user);
    }
    const providerLink = await User_social.findOne({
      where: {
        [Op.and]: [{ providerId: id }, { provider: provider }],
      },
    });

    if (!providerLink) {
      await User_social.create({
        userId: req.user.id,
        provider,
        providerId: id,
      });
      req.session.verify = "done";
      req.session.status = "1"
      return done(null, req.user);
    }

    return done(null, false, {
      message: "Tài khoản này đã được liên kết",
    });
  }
);
