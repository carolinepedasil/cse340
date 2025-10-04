const express = require("express");
const router = new express.Router();
const invController = require("../controllers/inventoryController");
const v = require("../validation/inventory-validation");
const utilities = require("../utilities"); // <- add this

router.get("/", utilities.checkEmployee, invController.buildManagementView);

router.get(
  "/add-classification",
  utilities.checkEmployee,
  invController.buildAddClassification
);

router.post(
  "/add-classification",
  utilities.checkEmployee,
  v.classificationRules,
  v.check,
  invController.createClassification
);

router.get(
  "/add",
  utilities.checkEmployee,
  invController.buildAddVehicle
);

router.post(
  "/add",
  utilities.checkEmployee,
  v.vehicleRules,
  v.check,
  invController.createVehicle
);

router.get("/type/:classificationName", invController.buildByClassificationName);
router.get("/detail/:inv_id", invController.buildDetailView);

router.get("/cause-error", invController.causeServerError);

module.exports = router;
