const { body, validationResult } = require("express-validator");

const reviewRules = [
  body("rating")
    .notEmpty().withMessage("Rating is required.")
    .isInt({ min:1, max:5 }).withMessage("Rating must be between 1 and 5."),
  body("comment")
    .trim()
    .notEmpty().withMessage("Comment is required.")
    .isLength({ min: 5, max: 1000 }).withMessage("Comment must be 5-1000 characters."),
];

async function check(req, res, next){
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    req.validationErrors = errors.array();
  }
  return next();
}

module.exports = { reviewRules, check };
