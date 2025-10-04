const pool = require("../database/");

async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1",
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("getAccountById error", error);
  }
}

async function updateAccount(account_id, firstname, lastname, email) {
  try {
    const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    const data = await pool.query(sql, [firstname, lastname, email, account_id]);
    return data.rows[0];
  } catch (error) {
    console.error("updateAccount error", error);
  }
}

async function updatePassword(account_id, hashedPassword) {
  try {
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *";
    const data = await pool.query(sql, [hashedPassword, account_id]);
    return data.rows[0];
  } catch (error) {
    console.error("updatePassword error", error);
  }
}

async function getAccountByEmail(email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_email = $1",
      [email]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error("getAccountByEmail error", error);
    return null;
  }
}

async function getAccountWithPasswordByEmail(email){
  const sql = `
    SELECT account_id, account_firstname, account_lastname, account_email,
           account_type, account_password
    FROM account
    WHERE account_email = $1
  `;
  const result = await pool.query(sql, [email]);
  return result.rows[0] || null;
}

async function insertAccount(firstname, lastname, email, hashedPassword){
  const sql = `
    INSERT INTO account (
      account_firstname, account_lastname, account_email, account_password, account_type
    )
    VALUES ($1,$2,$3,$4,'Client')
    RETURNING account_id, account_firstname, account_lastname, account_email, account_type
  `;
  const result = await pool.query(sql, [firstname, lastname, email, hashedPassword]);
  return result.rows[0] || null;
}

module.exports = {
  getAccountByEmail,
  getAccountById,
  getAccountWithPasswordByEmail,
  insertAccount,
  updateAccount,
  updatePassword
};
