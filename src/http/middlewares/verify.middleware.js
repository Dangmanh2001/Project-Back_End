

module.exports =async (req, res, next) => {
    if (!req.session.verify) {
 
      res.redirect("/verification");
      return;
    }
    next();
  };
  