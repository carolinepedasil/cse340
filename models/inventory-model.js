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

module.exports = {
  getVehicleById,
  getInventoryByClassificationName,
  getClassifications,
};
