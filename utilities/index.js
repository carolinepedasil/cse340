const invModel = require("../models/inventory-model");

function formatUSD(value) {
  if (value == null) return "";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value));
  } catch {
    return `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

function formatNumber(value) {
  if (value == null) return "";
  return Number(value).toLocaleString("en-US");
}

function buildVehicleDetailHTML(vehicle) {
  if (!vehicle) {
    return `<section class="detail"><p class="detail__empty">Vehicle not found.</p></section>`;
  }

  const {
    inv_make, inv_model, inv_year, inv_price, inv_miles,
    inv_description, inv_color, inv_image
  } = vehicle;

  const title = `${inv_make} ${inv_model}`;
  const price = formatUSD(inv_price);
  const miles = formatNumber(inv_miles);

  return `
    <article class="veh-detail">
      <figure class="veh-detail__media">
        <img src="${inv_image}" alt="${inv_year ?? ""} ${title}">
      </figure>

      <section class="veh-detail__info" aria-label="${title} Details">
        <h2 class="veh-detail__subtitle">${title} Details</h2>

        <div class="info-row-gray"><strong>Price:</strong> <span>${price}</span></div>

        <div class="info-row">
          <strong>Description:</strong>
          <p class="info-row__text">${inv_description ?? ""}</p>
        </div>

        <div class="info-row-gray"><strong>Color:</strong> <span>${inv_color ?? "—"}</span></div>
        <div class="info-row"><strong>Miles:</strong> <span>${miles ?? "—"}</span></div>
      </section>
    </article>
  `;
}


async function getNav() {
  const classes = await invModel.getClassifications();
  const links = classes.map(c => {
    const name = c.classification_name;
    return `<li><a href="/inv/type/${encodeURIComponent(name)}">${name}</a></li>`;
  }).join("");

  return `
  <nav class="site-nav" aria-label="Primary">
    <div class="nav-bar">
      <ul>
        <li><a href="/">Home</a></li>
        ${links}
      </ul>
    </div>
  </nav>`;
}

function buildClassificationGrid(items) {
  if (!items || items.length === 0) {
    return `<p>No vehicles found for this classification.</p>`;
  }

  const cards = items.map(v => {
    const title = `${v.inv_make} ${v.inv_model}`;
    const year  = v.inv_year ? `${v.inv_year} ` : "";
    const price = (typeof formatUSD === "function" && v.inv_price != null)
      ? formatUSD(v.inv_price)
      : (v.inv_price != null ? `$${Number(v.inv_price).toLocaleString("en-US")}` : "—");

    return `
      <li class="veh-card">
        <a class="veh-card__link" href="/inv/detail/${v.inv_id}" aria-label="View details for ${year}${title}">
          <figure class="veh-card__media">
            <img src="${v.inv_image}" alt="${year}${title}">
          </figure>
          <div class="veh-card__body">
            <h3 class="veh-card__title">${title}</h3>
            <p class="veh-card__price">${price}</p>
          </div>
        </a>
      </li>
    `;
  }).join("");

  return `<ul class="veh-grid">${cards}</ul>`;
}

async function buildClassificationList(classification_id = null) {
  const data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`;
    if (classification_id != null && Number(row.classification_id) === Number(classification_id)) {
      classificationList += " selected";
    }
    classificationList += `>${row.classification_name}</option>`;
  });
  classificationList += "</select>";
  return classificationList;
}

module.exports = {
  formatUSD,
  formatNumber,
  buildVehicleDetailHTML,
  getNav,
  buildClassificationGrid,
  buildClassificationList,
};
