const model = require("../../../models/index");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = {
  index: async (req, res) => {
    const user = req.user;
    res.render("admin/dashboard/index", { user });
  },
  infor: async (req, res) => {
    const message = req.flash("message");
    const user = req.user;
    const providerFb = await model.User_social.findOne({
      where: {
        [Op.and]: [{ userId: user.id }, { provider: "facebook" }],
      },
    });

    const providerGg = await model.User_social.findOne({
      where: {
        [Op.and]: [{ userId: user.id }, { provider: "google" }],
      },
    });

    const providerGh = await model.User_social.findOne({
      where: {
        [Op.and]: [{ userId: user.id }, { provider: "github" }],
      },
    });
    res.render("admin/users/index", {
      message,
      user,
      providerFb,
      providerGg,
      providerGh,
    });
  },
  deleteLink: async (req, res) => {
    const { provider } = req.params;
    const user = req.user;
    console.log(provider);
    await model.User_social.destroy({
      where: { [Op.and]: [{ provider: provider }, { userId: user.id }] },
    });
    res.redirect("/admin/infor");
  },
  user: async (req, res) => {
    const { keyword, page = 1, limit = 3 } = req.query;
    const filters = [];
    if (keyword) {
      filters.push({
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${keyword}%`,
            },
          },
          {
            email: {
              [Op.like]: `%${keyword}%`,
            },
          },
        ],
      });
    }

    const whereCondition = {
      [Op.and]: [{ typeId: 1 }, ...filters],
    };

    const { count, rows: users } = await model.User.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });

    data = users;
    const pageCount = Math.ceil(count / limit);

    const message = req.flash("message");
    const user = req.user;

    res.render("admin/dashboard/user", {
      message,
      user,
      req,
      users,
      pageCount,
      currentPage: parseInt(page),
    });
  },

  changePass: async (req, res) => {
    const message = req.flash("message");
    const user = req.user;
    res.render("admin/dashboard/changePass", { user, message });
  },
  handleChangePass: async (req, res) => {
    const user = req.user;
    const { password, password1 } = req.body;

    if (password != password1) {
      req.flash("message", "Mật khẩu không giống nhau");
      res.redirect("/admin/changePass");
      return;
    }
    const hash = bcrypt.hashSync(password, 10);
    await model.User.update(
      { password: hash, first_login: 1 },
      {
        where: {
          id: user.id,
        },
      }
    );
    res.redirect("/admin");
  },
};
