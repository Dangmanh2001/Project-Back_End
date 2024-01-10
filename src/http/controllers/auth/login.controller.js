module.exports = {
  index: async (req, res) => {
    const message = req.flash("error");
    const title = "Log in";
    console.log(message);
    res.render("auth/login", {
      layout: "layouts/auth.layout.ejs",
      message,
      title,
    });
  },
};
