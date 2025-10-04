const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");

const registrationRules = () => [
  body("account_firstname").trim().notEmpty().withMessage("First name is required."),
  body("account_lastname").trim().notEmpty().withMessage("Last name is required."),
  body("account_email")
    .isEmail().withMessage("Valid email is required.")
    .bail()
    .custom(async (email) => {
      const existing = await accountModel.getAccountByEmail(email);
      if (existing) throw new Error("Email already exists.");
    }),
  body("account_password")
    .isLength({ min: 12 }).withMessage("Password must be at least 12 characters.")
    .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter.")
    .matches(/[0-9]/).withMessage("Password must contain a number.")
    .matches(/[!@#$%^&*]/).withMessage("Password must contain a special character.")
];

const checkRegData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("account/register", {
      title: "Register",
      errors: errors.array(),
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email
    });
  }
  next();
};

const updateAccountRules = () => [
  body("account_firstname").trim().isLength({ min: 1 }).withMessage("First name is required."),
  body("account_lastname").trim().isLength({ min: 1 }).withMessage("Last name is required."),
  body("account_email")
    .isEmail().withMessage("Valid email is required.")
    .custom(async (email, { req }) => {
      const account = await accountModel.getAccountById(req.body.account_id);
      if (account.account_email !== email) {
        const existing = await accountModel.getAccountByEmail(email);
        if (existing) throw new Error("Email already exists.");
      }
    }),
];

const passwordRules = () => [
  body("account_password")
    .isLength({ min: 12 })
    .matches(/[A-Z]/).withMessage("Must contain uppercase letter")
    .matches(/[0-9]/).withMessage("Must contain a number")
    .matches(/[!@#$%^&*]/).withMessage("Must contain a special character"),
];

const checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await req.app.locals.utilities.getNav();
    return res.render("account/update", {
      title: "Edit Account",
      nav,
      errors: errors.array(),
      account: req.body,
    });
  }
  next();
};

const checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await req.app.locals.utilities.getNav();
    return res.render("account/update", {
      title: "Edit Account",
      nav,
      errors: errors.array(),
      account: req.body,
    });
  }
  next();
};

module.exports = {
  registrationRules,
  checkRegData,
  updateAccountRules,
  passwordRules,
  checkUpdateData,
  checkPasswordData
};
