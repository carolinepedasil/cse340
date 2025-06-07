const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");

router.get("/type/:classification", invController.buildByClassification);

router.get("/cause-error", (req, res, next) => {
  next(new Error("Intentional 500 error for testing"));
});

module.exports = router;
