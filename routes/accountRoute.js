const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const accountValidate = require("../utilities/account-validation");
const utilities = require("../utilities/");

router.get("/", utilities.checkLogin, accountController.buildAccountManagement);
router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);
router.post("/login", accountController.login);
router.post(
  "/register",
  accountValidate.registrationRules(),
  accountValidate.checkRegData,
  accountController.registerAccount
);
router.get("/update/:account_id", utilities.checkLogin, accountController.buildUpdateView);

router.post(
  "/update",
  accountValidate.updateAccountRules(),
  accountValidate.checkUpdateData,
  accountController.updateAccount
);

router.post(
  "/update-password",
  accountValidate.passwordRules(),
  accountValidate.checkPasswordData,
  accountController.updatePassword
);

router.get("/logout", accountController.logout);

module.exports = router;
