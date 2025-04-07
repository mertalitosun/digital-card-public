const isAdmin = (req, res, next) => {
  if (!req.session.isAdmin) {
    return res.redirect("/");
  }
  next();
};

const isCustomer = (req, res, next) => {
  if (!req.session.isCustomer) {
    return res.redirect("/");
  }
  next();
};

module.exports = { isAdmin, isCustomer };
