module.exports = function (req, res, next) {
  res.locals.userId = req.session.userId;
  res.locals.userCode = req.session.userCode;
  res.locals.isAuth = req.session.isAuth;
  res.locals.isAdmin = req.session.isAdmin;
  res.locals.isCustomer = req.session.isCustomer;
  res.locals.fullName = req.session.fullName;
  next();
};
