async function getInventoryByClassification(classification) {
  const sql = `
    SELECT * FROM inventory i
    JOIN classification c ON i.classification_id = c.classification_id
    WHERE c.classification_name = $1
  `;
  return await pool.query(sql, [classification]);
}

module.exports = {
  getInventoryById,
  getInventoryByClassification
};
