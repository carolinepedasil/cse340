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


module.exports = {
  buildDetailView,
  causeServerError,
  buildByClassificationName,
};
