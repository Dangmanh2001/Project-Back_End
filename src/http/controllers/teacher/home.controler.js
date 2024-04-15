const model = require("../../../models/index");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = {
  index: async (req, res) => {
    const user = req.user;
    const content = "Trang chủ"
    const success = req.flash("success")
    res.render("teacher/home/index", { user, type ,content,success});
  },
  infor: async (req, res) => {
    const content = "Thông tin cá nhân"
    const message = req.flash("error");
    const success = req.flash("success")
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
    res.render("teacher/products/index", {
      success,
      message,
      user,
      type,
      providerFb,
      providerGg,
      providerGh,
      content
    });
  },
  handleInfor:async(req,res)=>{
    const user = req.user
    const {name,phoneNumber,address}=req.body
    if(!address){
      req.flash("error","Vui lòng nhập địa chỉ")
      return res.redirect("/admin/infor")
      
    }
    if(!phoneNumber){
      req.flash("error","Vui lòng nhập số điện thoại")
      return res.redirect("/admin/infor")
    }
    
    await model.User.update({name,phoneNumber,address},{
      where:{id:user.id}
    })
    req.flash("success","Đổi thông tin thành công")
    res.redirect("/teacher/infor")
  },
  deleteLink: async (req, res) => {
    const { provider } = req.params;
    const user = req.user;
    console.log(provider);
    await model.User_social.destroy({
      where: { [Op.and]: [{ provider: provider }, { userId: user.id }] },
    });
    res.redirect("/teacher/infor");
  },
  changePass: async (req, res) => {
    const content = "Đổi mật khẩu"
    const message = req.flash("message");
    const user = req.user;
    res.render("teacher/home/changePass", { user, message,content });
  },
  handleChangePass: async (req, res) => {
    const user = req.user;
    const { password, password1 } = req.body;

    if (password != password1) {
      req.flash("message", "Mật khẩu không giống nhau");
      res.redirect("/teacher/changePass");
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
    req.flash("success","Đổi mật khẩu thành công")
    res.redirect("/teacher");
  },
};
