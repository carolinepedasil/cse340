const express = require("express");
const router = new express.Router();
const controller = require("../controllers/reviewController");
const validate = require("../validation/review-validation");
const utilities = require("../utilities");

router.post(
  "/:inv_id",
  utilities.checkLogin,
  validate.reviewRules,
  validate.check,
  controller.createReview
);

module.exports = router;
