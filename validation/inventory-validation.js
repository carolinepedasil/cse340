const { body, validationResult } = require("express-validator");

const classificationRules = [
  body("classification_name")
    .trim()
    .notEmpty().withMessage("Classification name is required.")
    .matches(/^[A-Za-z]+$/).withMessage("Letters only, no spaces or symbols."),
];

const vehicleRules = [
  body("classification_id")
    .notEmpty().withMessage("Choose a classification.")
    .isInt({ min: 1 }).withMessage("Invalid classification."),
  body("inv_make")
    .trim().isLength({ min: 3 }).withMessage("Make: min 3 characters."),
  body("inv_model")
    .trim().isLength({ min: 2 }).withMessage("Model: min 2 characters."),
  body("inv_description")
    .trim().notEmpty().withMessage("Description is required."),
  body("inv_image")
    .trim().notEmpty().withMessage("Image path is required."),
  body("inv_thumbnail")
    .trim().notEmpty().withMessage("Thumbnail path is required."),
  body("inv_price")
    .notEmpty().withMessage("Price is required.")
    .isFloat({ min: 0 }).withMessage("Price must be a number ≥ 0."),
  body("inv_year")
    .notEmpty().withMessage("Year is required.")
    .isInt({ min: 1900, max: 9999 }).withMessage("Year must be 4 digits."),
  body("inv_miles")
    .notEmpty().withMessage("Miles is required.")
    .isInt({ min: 0 }).withMessage("Miles must be digits only."),
  body("inv_color")
    .trim().notEmpty().withMessage("Color is required."),
];

function check(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.validationErrors = errors.array();
  }
  next();
}

module.exports = {
  classificationRules,
  vehicleRules,
  check,
};
