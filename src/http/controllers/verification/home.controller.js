
const model = require("../../../models/index");

const{Op}=require("sequelize")

module.exports = {
    index:async(req,res)=>{
        const message = req.flash("message")
        const user = req.user

        res.render("auth/verifi",{message,user})
    },
    handleVerify:async(req,res)=>{
        const {otp} = req.body
        
        const user = req.user
        const otp1 = await model.User_otp.findOne({
            where: {
              [Op.and]: [{ userId: user.id }, { otp }],
            },
          });
          

         if(!otp){
            req.flash("message","Vui lòng nhập Otp")
            res.redirect("/verification")
            return
         }
          
        if(otp!==otp1?.otp){
            console.log(otp1)
            req.flash("message","Otp sai hoặc không hợp lệ")
            res.redirect("/verification")
            return
        }
         await model.User_otp.destroy({
            where: {
              [Op.and]: [{ userId: user.id }, { otp }],
            },
          });
        
          req.session.verify = "done"
        res.redirect("/redirect")
    }
}