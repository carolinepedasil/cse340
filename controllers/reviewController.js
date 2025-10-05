const reviewModel = require("../models/review-model");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

async function createReview(req, res, next){
  try{
    const inv_id = Number(req.params.inv_id);
    const { rating, comment } = req.body;
    const accountData = res.locals.accountData || null;
    const account_id = accountData ? accountData.account_id : null;

    if (!Number.isInteger(inv_id)){
      const err = new Error("Invalid vehicle id.");
      err.status = 400;
      throw err;
    }

    if (req.validationErrors && req.validationErrors.length){
      return await renderDetailWithReviews(req, res, inv_id, {
        form: { rating, comment },
        errors: req.validationErrors
      });
    }

    await reviewModel.insertReview({ inv_id, account_id, rating, comment });
    req.flash("success", "Thanks for your review!");

    return res.redirect(`/inv/detail/${inv_id}`);
  } catch(err){
    next(err);
  }
}

async function renderDetailWithReviews(req, res, inv_id, extras={}){
  const vehicle = await invModel.getVehicleById(inv_id);
  if (!vehicle){
    const err = new Error("Vehicle not found.");
    err.status = 404;
    throw err;
  }
  const title = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`;
  const detailHTML = utilities.buildVehicleDetailHTML(vehicle);
  const reviews = await reviewModel.getReviewsByVehicle(inv_id);
  const agg = await reviewModel.getAggregateForVehicle(inv_id);
  const nav = await utilities.getNav();

  return res.status(extras.errors ? 400 : 200).render("inventory/detail", {
    title,
    detailHTML,
    nav,
    reviews,
    reviewAgg: agg,
    reviewForm: extras.form || null,
    errors: extras.errors || null,
  });
}

module.exports = { createReview, renderDetailWithReviews };
