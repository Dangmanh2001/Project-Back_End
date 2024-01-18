const model = require("../../../models/index");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
var randomstring = require("randomstring");
const sendMail = require("../../utils/sendMail");
const exportExcel = require("../../utils/exportExcel");
let data = null;
module.exports = {
  user: async (req, res) => {
    const content = "Quản lý Admin"
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
      content,
      message,
      user,
      req,
      users,
      pageCount,
      currentPage: parseInt(page),
    });
  },
  exportExcelAdmin: async (req, res) => {
    const users = [];
    data.forEach((e, index) => {
      users.push({ Stt: index + 1, Name: e.name, Email: e.email });
    });
    exportExcel(users, "exported_data_users.xlsx");

    res.redirect("/admin/users");
  },
  importExcelAdmin: async (req, res) => {
    console.log(req.body);
    res.redirect("/admin/users");
  },
  addAdmin: async (req, res) => {
    const content = "Thêm Admin"
    const user = req.user;

    const message = req.flash("message");

    res.render("admin/users/admins/addAdmin", { user, message ,content});
  },
  handleAddAdmin: async (req, res) => {
    const { name, email } = req.body;
    const passGenerate = randomstring.generate(7);

    const passwordHash = bcrypt.hash(passGenerate, 10);
    const hash = await passwordHash;

    await model.User.create({ name, email, password: hash, typeId: 1 });
    sendMail(
      email,
      "OTP",
      "Hello",
      `<a>This is your password:${passGenerate}</a>`
    );

    res.redirect("/admin/addAdmin");
  },

  editAdmin: async (req, res) => {
    const content = "Sửa Admin"
    const user = req.user;
    const message = req.flash("message");

    res.render("admin/users/admins/editAdmin", { user, message, content });
  },

  handleEditAdmin: async (req, res) => {
    const { email, name, password } = req.body;
    const { id } = req.params;

    console.log(id);
    const passwordHash = bcrypt.hash(password, 10);
    const hash = await passwordHash;
    await model.User.update({ name, email, password: hash }, { where: { id } });
    res.redirect(`/admin/editAdmin/${id}`);
  },
};
