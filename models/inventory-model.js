const pool = require("../database");

async function getVehicleById(inv_id) {
  try {
    const sql = `
      SELECT inv_id, inv_make, inv_model, inv_year, inv_price, inv_miles, inv_description,
             inv_color, inv_image, inv_thumbnail
      FROM public.inventory
      WHERE inv_id = $1
    `;
    const result = await pool.query(sql, [inv_id]);
    return result.rows[0] || null;
  } catch (err) {
    throw err;
  }
}

async function getInventoryByClassificationName(name) {
  const sql = `
    SELECT inv_id, inv_make, inv_model, inv_price, inv_year, inv_image, classification_name
    FROM public.inventory
    JOIN public.classification USING (classification_id)
    WHERE classification_name = $1
    ORDER BY inv_make, inv_model
  `;
  const result = await pool.query(sql, [name]);
  return result.rows;
}

async function getClassifications() {
  const sql = `
    SELECT classification_id, classification_name
    FROM public.classification
    ORDER BY classification_name
  `;
  const result = await pool.query(sql);
  return result.rows;
}

async function insertClassification(classification_name) {
  const sql = `INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING classification_id`;
  const result = await pool.query(sql, [classification_name]);
  return result.rowCount;
}

async function insertInventory({
  classification_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
}) {
  const sql = `
    INSERT INTO public.inventory
      (classification_id, inv_make, inv_model, inv_description,
       inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING inv_id`;
  const values = [
    Number(classification_id),
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    Number(inv_price),
    Number(inv_year),
    Number(inv_miles),
    inv_color,
  ];
  const result = await pool.query(sql, values);
  return result.rowCount;
}

module.exports = {
  getVehicleById,
  getInventoryByClassificationName,
  getClassifications,
  insertClassification,
  insertInventory,
};
