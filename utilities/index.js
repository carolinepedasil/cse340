const pool = require("../database/");

async function getNav() {
  const sql = "SELECT classification_name FROM classification ORDER BY classification_name";
  const data = await pool.query(sql);

  let nav = `<li><a href="/">Home</a></li>`;
  data.rows.forEach(row => {
    nav += `<li><a href="/inventory/type/${row.classification_name}">${row.classification_name}</a></li>`;
  });

  return nav;
}

module.exports = { getNav };
