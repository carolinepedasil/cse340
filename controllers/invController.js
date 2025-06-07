const invModel = require("../models/inventory-model");
const utilities = require("../utilities");
const nav = await utilities.getNav();
res.render("inventory/classification", {
  title: "Sedan Vehicles",
  nav,
  classification,
  inventory: data.rows
});

async function buildByClassification(req, res, next) {
  try {
    const classification = req.params.classification;
    const data = await invModel.getInventoryByClassification(classification);
    const nav = await utilities.getNav();
    res.render("./inventory/classification", {
      title: classification + " Vehicles",
      nav,
      classification,
      inventory: data.rows
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildDetailView,
  buildByClassification
};