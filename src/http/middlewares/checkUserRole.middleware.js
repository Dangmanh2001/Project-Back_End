module.exports = (requiredTypeIds)=> {
    return function (req, res, next) {
        const userTypeId = req.user.typeId;
        if (![ 2, 4].includes(userTypeId) && !requiredTypeIds.includes(userTypeId)) {
            res.redirect("/redirect");
            return;
        }
        next();
    };
}