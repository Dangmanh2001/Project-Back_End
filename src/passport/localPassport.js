const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const model = require("../models/index");
var rn = require("random-number");
const nodemailer = require("nodemailer");

module.exports = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
  },
  async function (req, email, password, done) {
    const user = await model.User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      done(null, false, { message: "Email không tồn tại" });
      return;
    }

    const hash = user.password;
    bcrypt.compare(password, hash, async(err, result) => {
      if (result) {
        const random = {
            min: 1000,
            max: 9999,
            integer: true,
          };
          const otp = await model.User_otp.findOne({
            where: {
              userId: user.id,
            },
          });
          if (!otp) {
            await model.User_otp.create({
              otp: rn(random),
              expires: new Date(),
              userId: user.id,
            });
          }
          await model.User_otp.update(
            { otp: rn(random) },
            {
              where: {
                userId: user.id,
              },
            }
          );
          const otpSend = await model.User_otp.findOne({
            where: {
              userId: user.id,
            },
          });
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: "phaodai2000@gmail.com",
              pass: "huzx vhve jccv uzni",
            },
          });
      
          // send mail with defined transport object
          async function main() {
            // send mail with defined transport object
            const info = await transporter.sendMail({
              from: '"Fred Foo 👻" <phaodai2000@gmail.com>', // sender address
              to: user.email, // list of receivers
              subject: "OTP", // Subject line
              text: "Hello", // plain text body
              html: `<b>This is your otp:${otpSend.otp}</b>`, // html body
            });
      
            console.log("Message sent: %s", info.messageId);
          }
          main();
        console.log(user.first_login);
        if (!user.first_login) {
          
          req.session.status = "1";
          console.log(req.session.status);
        }
        
        done(null, user);
        return;
      }

      done(null, false, {
        message: "Mật khẩu không chính xác",
      });
    });
  }
);
