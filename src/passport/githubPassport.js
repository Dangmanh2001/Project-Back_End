var GitHubStrategy = require("passport-github2").Strategy;
const model = require("../models/index");
const { Op } = require("sequelize");

const User_social = model.User_social;
const User = model.User;
module.exports = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    scope: ["user:email"],
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    passReqToCallback: true,
  },
  async function (req, accessToken, refreshToken, profile, cb) {
    const { _json, emails, provider } = profile;
    const { id, login } = _json;

    if (!req.user) {
      const providerLogin = await User_social.findOne({
        where: {
          [Op.and]: [{ provider: provider }, { providerId: id }],
        },
      });
      if (!providerLogin) {
        return cb(null, false, { message: "Tài khoản chưa được liên kết" });
      }
      const user = await User.findOne({
        where: {
          id: providerLogin.userId,
        },
      });
      req.session.verify = "done";
      
      return cb(null, user);
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
      req.session.status = "1"
      req.session.verify = "done";
      return cb(null, req.user);
    }

    return cb(null, false, {
      message: "Tài khoản này đã được liên kết",
    });
  }
);
