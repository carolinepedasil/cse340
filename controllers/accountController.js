const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const utilities = require("../utilities");
require("dotenv").config();

async function buildAccountManagement(req, res) {
  const accountData = res.locals.accountData;
  const nav = await utilities.getNav();
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_type: accountData.account_type,
    account_id: accountData.account_id,
  });
}

async function buildLogin(req, res) {
  const nav = await utilities.getNav();
  res.render("account/login", { title: "Login", nav, errors: null });
}

async function buildRegister(req, res){
  const nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: [],
    account_firstname: "",
    account_lastname: "",
    account_email: ""
  });
}

async function registerAccount(req, res){
  try{
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    if(!account_firstname || !account_lastname || !account_email || !account_password){
      req.flash("error", "All fields are required.");
      const nav = await utilities.getNav();
      return res.status(400).render("account/register", { title:"Register", nav, errors: [{msg:"Fix the errors"}] });
    }

    const existing = await accountModel.getAccountByEmail(account_email);
    if(existing){
      req.flash("error", "That email already exists.");
      const nav = await utilities.getNav();
      return res.status(400).render("account/register", { title:"Register", nav, errors: [{msg:"Email already exists"}] });
    }

    const hash = await bcrypt.hash(account_password, 10);
    const newAcc = await accountModel.insertAccount(
      account_firstname, account_lastname, account_email, hash
    );

    req.session.account = newAcc;
    req.flash("success", "Welcome! Your account was created.");
    return res.redirect("/account/");
  }catch(err){
    console.error(err);
    req.flash("error", "Registration failed.");
    const nav = await utilities.getNav();
    return res.status(500).render("account/register", { title:"Register", nav, errors: [{msg:"Server error"}] });
  }
}

async function login(req, res) {
  try {
    const { account_email, account_password: plainPassword } = req.body;
    const found = await accountModel.getAccountWithPasswordByEmail(account_email);

    if (!found) {
      req.flash("error", "Invalid credentials.");
      const nav = await utilities.getNav();
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: [{ msg: "Invalid credentials" }],
      });
    }

    const ok = await bcrypt.compare(plainPassword, found.account_password);
    if (!ok) {
      req.flash("error", "Invalid credentials.");
      const nav = await utilities.getNav();
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: [{ msg: "Invalid credentials" }],
      });
    }

    const { account_password, ...safeAccount } = found;
    req.session.account = safeAccount;

    return res.redirect("/account/");
  } catch (err) {
    console.error(err);
    req.flash("error", "Login failed.");
    const nav = await utilities.getNav();
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: [{ msg: "Server error" }],
    });
  }
}


async function buildUpdateView(req, res) {
  const account_id = parseInt(req.params.account_id);
  const account = await accountModel.getAccountById(account_id);
  const nav = await utilities.getNav();
  res.render("account/update", { title: "Edit Account", nav, errors: null, account });
}

async function updateAccount(req, res) {
  const { account_firstname, account_lastname, account_email, account_id } = req.body;
  const updateResult = await accountModel.updateAccount(
    account_id, account_firstname, account_lastname, account_email
  );

  if (updateResult) {
    req.flash("success", "Congratulations, your information has been updated.");
    const accountData = await accountModel.getAccountById(account_id);
    req.session.account = accountData;
    return res.redirect("/account/");
  } else {
    req.flash("error", "Sorry, the update failed.");
    return res.redirect(`/account/update/${account_id}`);
  }
}

async function updatePassword(req, res) {
  const { account_password, account_id } = req.body;
  const hashedPassword = await bcrypt.hash(account_password, 10);
  const result = await accountModel.updatePassword(account_id, hashedPassword);

  if (result) {
    req.flash("success", "Password updated successfully.");
    return res.redirect("/account/");
  } else {
    req.flash("error", "Password update failed.");
    return res.redirect(`/account/update/${account_id}`);
  }
}

function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.clearCookie("jwt");
    res.redirect("/");
  });
}

module.exports = {
  buildAccountManagement,
  buildLogin,
  buildRegister,
  registerAccount,
  login,
  buildUpdateView,
  updateAccount,
  updatePassword,
  logout
};
