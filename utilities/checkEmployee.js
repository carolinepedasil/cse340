function checkEmployee(req, res, next) {
  if (res.locals.accountData && (res.locals.accountData.account_type === "Employee" || res.locals.accountData.account_type === "Admin")) {
    return next();
  }
  req.flash("notice", "You must be an employee or admin to access this area.");
  return res.redirect("/account/login");
}

module.exports = checkEmployee;
