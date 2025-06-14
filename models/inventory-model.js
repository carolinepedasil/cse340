const pool = require('./database');

async function getInventoryByClassification(classification) {
  const sql = `
    SELECT i.*, c.classification_name
      FROM inventory i
      JOIN classification c USING (classification_id)
     WHERE c.classification_name = $1
  `;
  return await pool.query(sql, [classification]);
}

async function insertClassification(classification_name) {
  const sql = 'INSERT INTO classification (classification_name) VALUES ($1)';
  return await pool.query(sql, [classification_name]);
}

module.exports = {
  getInventoryByClassification,
  insertClassification,
};
