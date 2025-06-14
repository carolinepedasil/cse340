const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

async function buildManagementView(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render('inventory/management', {
      title: 'Vehicle Management',
      message: req.flash('info')
    })
  } catch (error) {
    next(error);
  }
}

async function buildAddClassificationView(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      message: req.flash("notice"),
    });
  } catch (error) {
    next(error);
  }
}

async function addClassification(req, res, next) {
  const { classification_name } = req.body;
  const nameRegex = /^[a-zA-Z0-9]+$/;

  try {
    const nav = await utilities.getNav();

    if (!nameRegex.test(classification_name)) {
      req.flash(
        "notice",
        "Classification name must not contain spaces or special characters."
      );
      return res.status(400).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: [{ msg: "Invalid input (alphanumeric only)." }],
        message: req.flash("notice"),
      });
    }

    await invModel.insertClassification(classification_name);
    req.flash("info", "Classification added successfully.");
    return res.redirect("/inv");
  } catch (error) {
    const nav = await utilities.getNav();
    req.flash("notice", "Error: Could not add classification.");
    return res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: [{ msg: "Database insertion error." }],
      message: req.flash("notice"),
    });
  }
}

async function buildByClassification(req, res, next) {
  try {
    const classification = req.params.classification;
    const data = await invModel.getInventoryByClassification(classification);
    const nav = await utilities.getNav();

    res.render("inventory/classification", {
      title: `${classification} Vehicles`,
      nav,
      classification,
      inventory: data.rows,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildManagementView,
  buildAddClassificationView,
  addClassification,
  buildByClassification,
};
