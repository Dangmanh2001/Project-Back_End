module.exports = (requiredTypeId)=> {
    return function (req, res, next) {
        if (req.user.typeId !== requiredTypeId) {
            res.redirect("/redirect");
            return;
        }
        next();
    };
}