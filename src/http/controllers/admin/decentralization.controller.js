const model = require("../../../models/index");
const { Op } = require("sequelize");

module.exports = {
  decentralization: async (req, res) => {
    const user = req.user;
    const content = "Phân quyền";
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
        ],
      });
    }

    const whereCondition = {
      [Op.and]: [...filters],
    };
    const { count, rows: roles } = await model.Role.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });

    const pageCount = Math.ceil(count / limit);

    const message = req.flash("message");
    const success = req.flash("success");

    res.render("admin/dashboard/decentralization", {
      user,
      content,
      roles,
      pageCount,
      message,
      success,
      req,
      currentPage: parseInt(page),
    });
  },
  addRole: async (req, res) => {
    const user = req.user;
    const content = "Thêm vai trò";
    const users = await model.User.findAll({
      where: {
        typeId: 1,
      },
    });
    const message = req.flash("message");
    const success = req.flash("success");
    res.render("admin/users/decentralization/addRole", {
      message,
      success,
      user,
      content,
      users,
    });
  },
  handleAddRole: async (req, res) => {
    const data = req.body;
    if (!data.name) {
      req.flash("message", "Vui lòng nhập tên");
      return res.redirect("/admin/addRole");
    }
    if (
      data.name !== undefined &&
      data.user !== undefined &&
      Object.keys(data).length === 2
    ) {
      // Đoạn mã trong này sẽ được chạy nếu chỉ có thuộc tính 'name' và 'user' trong object
      req.flash("message", "Vui lòng nhập ít nhất 1 quyền");
      return res.redirect("/admin/addRole");
    }
    const role = await model.Role.create({ name: data.name });
    const userId = parseInt(data.user);
    const roleId = parseInt(role.id);
    await role.addUser(userId, roleId);
    Object.keys(data).forEach(async (key) => {
      const permission = await model.Permission.findOne({
        where: {
          value: key,
        },
      });

      if (permission) {
        const permissionId = permission.id;
        await role.addPermission(permissionId, roleId);
      }
    });
    req.flash("success", "Thêm quyền thành công");

    res.redirect("/admin/addRole");
  },
  editRole: async (req, res) => {
    const content = "Sửa vai trò";
    const { id } = req.params;
    const users = await model.User.findAll({
      where: {
        typeId: 1,
      },
    });

    const user = req.user;
    const message = req.flash("message");
    const success = req.flash("success");
    res.render("admin/users/decentralization/editRole", {
      message,
      success,
      user,
      content,
      id,
      users,
    });
  },
};
