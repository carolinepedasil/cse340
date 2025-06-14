const pool = require('../models/database');

async function getNav() {
  const sql = `
    SELECT classification_id, classification_name
      FROM classification
    ORDER BY classification_name
  `;
  const data = await pool.query(sql);
  let nav = '<li><a href="/">Home</a></li>';
  data.rows.forEach((row) => {
    nav += `<li><a href="/inv/type/${row.classification_name}" title="View our ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
  });
  return nav;
}

module.exports = { getNav };
