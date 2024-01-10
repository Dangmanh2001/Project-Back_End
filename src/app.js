require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressLayouts = require("express-ejs-layouts");
var session = require("express-session");
var flash = require("connect-flash");
var passport = require("passport");
const localPassport = require("./passport/localPassport");
const googlePassport = require("./passport/googlePassport");
const facebookPassport = require("./passport/facebookPassport");
const githubPassport = require("./passport/githubPassport");
const model = require("./models/index");
const authMiddleware = require("./http/middlewares/auth.middleware");

const studentsRouter = require("./routes/students/index");
const teachersRouter = require("./routes/teacher/index");
const verifyRouter = require("./routes/verification/index")
const adminRouter = require("./routes/admin/index");
const authRouter = require("./routes/auth/index");
const loginTokenMiddleware = require("./http/middlewares/login.token.middleware");
const redirectMiddleware = require("./http/middlewares/redirect.middleware");
const type = require("./utils/type");
const guestMiddleware = require("./http/middlewares/guest.middleware");
const verifyMiddleware = require("./http/middlewares/verify.middleware");
const checkUserRoleMiddleware = require("./http/middlewares/checkUserRole.middleware");

var app = express();

app.use(
  session({
    secret: "Manh",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(expressLayouts);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  const user = await model.User.findByPk(id);
  done(null, user);
});

passport.use("local", localPassport);
passport.use("google", googlePassport);
passport.use("facebook", facebookPassport);
passport.use("github", githubPassport);

// view engine setup
app.set("views", path.join(__dirname, "resources/views"));
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "../public")));

app.set("layout", "layouts/master.layout.ejs");

//Routes

app.use("/auth", authRouter);

app.use(authMiddleware);
app.use(loginTokenMiddleware);
app.use(type);

app.use("/verification",verifyRouter)
app.use(verifyMiddleware)

app.use("/redirect", redirectMiddleware);

app.use("/student",checkUserRoleMiddleware(3), studentsRouter);
app.use("/teacher",checkUserRoleMiddleware(2), teachersRouter);
app.use("/admin",checkUserRoleMiddleware(1), adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
