const model = require("../../../models/index");
const {Op}= require("sequelize")
const bcrypt = require("bcrypt")

module.exports = {
  index: async (req, res) => {
    const message = req.flash("message");
    const user = req.user;
    console.log(message);
    res.render("students/home/index", { message, user, type });
  },
  infor: async (req, res) => {
    const message = req.flash("message");
    const user = req.user;
    const providerFb = await model.User_social.findOne({
      where: {
        [Op.and]:[{userId: user.id},{provider:'facebook'}]
      },
    });

    const providerGg = await model.User_social.findOne({
      where: {
        [Op.and]:[{userId: user.id},{provider:'google'}]
      },
    });

    const providerGh = await model.User_social.findOne({
      where: {
        [Op.and]:[{userId: user.id},{provider:'github'}]
      },
    });

    res.render("students/products/index", { message, user, type,providerFb,providerGg,providerGh });
  },
  deleteLink:async(req,res)=>{
    const {provider} = req.params
    const user = req.user
    console.log(provider)
    await model.User_social.destroy({
      where:{[Op.and]:[{provider:provider},{userId:user.id}]}
    })
    res.redirect("/student/infor")
  },
  changePass:async(req,res)=>{
    const message = req.flash("message")
    const user = req.user
    res.render("students/home/changePass",{user, message})
  },
  handleChangePass:async(req,res)=>{
    const user = req.user
    const {password,password1} = req.body

    if(password!=password1){
      req.flash("message","Mật khẩu không giống nhau")
      res.redirect("/student/changePass")
      return
    }
    const hash = bcrypt.hashSync(password, 10);
    await model.User.update({password:hash,first_login:1},{
      where:{
        id:user.id
      }
    })
    res.redirect("/student")
  }
};
