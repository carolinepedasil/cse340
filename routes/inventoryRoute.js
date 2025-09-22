const express = require("express");
const router = new express.Router();
const invController = require("../controllers/inventoryController");

router.get("/type/:classificationName", invController.buildByClassificationName);
router.get("/detail/:inv_id", invController.buildDetailView);
router.get("/cause-error", invController.causeServerError);

module.exports = router;
