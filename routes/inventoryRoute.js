const express = require("express");
const router = new express.Router();
const invController = require("../controllers/inventoryController");
const v = require("../validation/inventory-validation");

router.get("/", invController.buildManagementView);
router.get("/add-classification", invController.buildAddClassification);
router.post(
  "/add-classification",
  v.classificationRules,
  v.check,
  invController.createClassification
);
router.get("/add", invController.buildAddVehicle);
router.post("/add", v.vehicleRules, v.check, invController.createVehicle);
router.get("/type/:classificationName", invController.buildByClassificationName);
router.get("/detail/:inv_id", invController.buildDetailView);
router.get("/cause-error", invController.causeServerError);

module.exports = router;
