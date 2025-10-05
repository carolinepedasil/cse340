const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

async function buildDetailView(req, res, next) {
  try {
    const invId = Number(req.params.inv_id);
    if (!Number.isInteger(invId)) {
      const err = new Error("Invalid vehicle id.");
      err.status = 400;
      throw err;
    }

    const vehicle = await invModel.getVehicleById(invId);
    if (!vehicle) {
      const err = new Error("Vehicle not found.");
      err.status = 404;
      throw err;
    }

    const title = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`;
    const detailHTML = utilities.buildVehicleDetailHTML(vehicle);
    const reviewModel = require("../models/review-model");
    const reviews = await reviewModel.getReviewsByVehicle(invId);
    const reviewAgg = await reviewModel.getAggregateForVehicle(invId);

    const nav = await utilities.getNav();

    return res.render("inventory/detail", {
      title,
      nav,
      detailHTML,
      reviews,
      reviewAgg,
      inv_id: invId,
      errors: null,
      reviewForm: null,
    });
  } catch (err) {
    next(err);
  }
}

function causeServerError(_req, _res, _next) {
  throw new Error("Intentional error for testing");
}

async function buildByClassificationName(req, res, next) {
  try {
    const { classificationName } = req.params;
    const rows = await invModel.getInventoryByClassificationName(classificationName);
    if (!rows || rows.length === 0) {
      const err = new Error("No vehicles found for that classification.");
      err.status = 404;
      throw err;
    }

    const nav = await utilities.getNav();
    const title = `${classificationName} Vehicles`;
    const grid = utilities.buildClassificationGrid(rows);

    return res.render("inventory/classification", {
      title,
      nav,
      grid,
      errors: null
    });
  } catch (err) {
    next(err);
  }
}

async function buildManagementView(_req, res, next) {
  try {
    const title = "Vehicle Management";
    const nav = await utilities.getNav();
    return res.render("inventory/management", { title, nav, errors: null });
  } catch (err) {
    next(err);
  }
}

async function buildAddClassification(_req, res, next) {
  try {
    const nav = await utilities.getNav();
    return res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name: ""
    });
  } catch (err) {
    next(err);
  }
}

async function createClassification(req, res, next) {
  try {
    const { classification_name } = req.body;

    if (req.validationErrors) {
      const nav = await utilities.getNav();
      return res.status(400).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: req.validationErrors,
        classification_name,
      });
    }

    const inserted = await invModel.insertClassification(classification_name);
    if (inserted === 1) {
      req.flash("success", "Classification created successfully.");
      return res.redirect("/inv");
    }

    const nav = await utilities.getNav();
    req.flash("error", "Failed to create classification.");
    return res.status(500).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: [{ msg: "Insert failed. Try again." }],
      classification_name,
    });
  } catch (err) {
    next(err);
  }
}

async function buildAddVehicle(_req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    return res.render("inventory/add-vehicle", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null,
      classification_id: "",
      inv_make: "",
      inv_model: "",
      inv_description: "",
      inv_image: "/images/vehicles/no-image.png",
      inv_thumbnail: "/images/vehicles/no-image.png",
      inv_price: "",
      inv_year: "",
      inv_miles: "",
      inv_color: "",
    });
  } catch (err) {
    next(err);
  }
}

async function createVehicle(req, res, next) {
  try {
    const payload = { ...req.body };

    if (req.validationErrors) {
      const nav = await utilities.getNav();
      const classificationList = await utilities.buildClassificationList(payload.classification_id);
      return res.status(400).render("inventory/add-vehicle", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        errors: req.validationErrors,
        ...payload,
      });
    }

    const inserted = await invModel.insertInventory(payload);
    if (inserted === 1) {
      req.flash("success", "Vehicle added successfully.");
      return res.redirect("/inv");
    }

    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(payload.classification_id);
    req.flash("error", "Failed to add vehicle.");
    return res.status(500).render("inventory/add-vehicle", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: [{ msg: "Insert failed. Try again." }],
      ...payload,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  buildDetailView,
  causeServerError,
  buildByClassificationName,
  buildManagementView,
  buildAddClassification,
  createClassification,
  buildAddVehicle,
  createVehicle,
};
