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

    const nav = await utilities.getNav();
    const detailHTML = utilities.buildVehicleDetailHTML(vehicle);
    const title = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`;

    return res.status(200).render("./inventory/detail", {
      title,
      nav,
      detailHTML,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}

function causeServerError(req, res, next) {
  try {
    throw new Error("Oh no! There was a crash. Maybe try a different route?");
  } catch (err) {
    err.status = 500;
    next(err);
  }
}

async function buildByClassificationName(req, res, next) {
  try {
    const classificationName = req.params.classificationName;
    const data = await invModel.getInventoryByClassificationName(classificationName);
    const nav = await utilities.getNav();
    const grid = await utilities.buildClassificationGrid(data);

    res.render("inventory/classification", {
      title: `${classificationName} Vehicles`,
      nav,
      grid,
      errors: null
    });
  } catch (err) {
    next(err);
  }
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
    const title = `${classificationName} Vehicles`;
    const grid = utilities.buildClassificationGrid(rows);
    res.render("inventory/classification", { title, grid, errors: null });
  } catch (err) {
    next(err);
  }
}

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
    res.render("inventory/detail", { title, detailHTML });
  } catch (err) {
    next(err);
  }
}

function causeServerError(_req, _res, _next) {
  throw new Error("Intentional error for testing");
}

async function buildManagementView(req, res, next) {
  try {
    const title = "Vehicle Management";
    res.render("inventory/management", { title });
  } catch (err) {
    next(err);
  }
}


async function buildAddClassification(req, res, next) {
  try {
    res.render("inventory/add-classification", { title: "Add New Classification", errors: null, classification_name: "" });
  } catch (err) {
    next(err);
  }
}

async function createClassification(req, res, next) {
  try {
    const { classification_name } = req.body;

    if (req.validationErrors) {
      return res.status(400).render("inventory/add-classification", {
        title: "Add New Classification",
        errors: req.validationErrors,
        classification_name,
      });
    }

    const inserted = await invModel.insertClassification(classification_name);
    if (inserted === 1) {
      req.flash("success", "Classification created successfully.");
      res.locals.nav = await utilities.getNav();
      return res.redirect("/inv");
    }
    req.flash("error", "Failed to create classification.");
    return res.status(500).render("inventory/add-classification", {
      title: "Add New Classification",
      errors: [{ msg: "Insert failed. Try again." }],
      classification_name,
    });
  } catch (err) {
    next(err);
  }
}

async function buildAddVehicle(req, res, next) {
  try {
    const classificationList = await utilities.buildClassificationList();
    res.render("inventory/add-vehicle", {
      title: "Add New Vehicle",
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
      const classificationList = await utilities.buildClassificationList(payload.classification_id);
      return res.status(400).render("inventory/add-vehicle", {
        title: "Add New Vehicle",
        classificationList,
        errors: req.validationErrors,
        ...payload,
      });
    }

    const inserted = await invModel.insertInventory(payload);
    if (inserted === 1) {
      req.flash("success", "Vehicle added successfully.");
      res.locals.nav = await utilities.getNav();
      return res.redirect("/inv");
    }

    const classificationList = await utilities.buildClassificationList(payload.classification_id);
    req.flash("error", "Failed to add vehicle.");
    return res.status(500).render("inventory/add-vehicle", {
      title: "Add New Vehicle",
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
