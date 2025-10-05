const pool = require("../database");

async function getReviewsByVehicle(inv_id) {
  const sql = `
    SELECT r.review_id, r.inv_id, r.account_id, r.rating, r.comment, r.created_at,
           a.account_firstname, a.account_lastname
    FROM public.reviews r
    LEFT JOIN public.account a ON a.account_id = r.account_id
    WHERE r.inv_id = $1
    ORDER BY r.created_at DESC
  `;
  const result = await pool.query(sql, [inv_id]);
  return result.rows;
}

async function getAggregateForVehicle(inv_id){
  const sql = `
    SELECT COUNT(*)::int AS count, COALESCE(AVG(rating),0)::numeric(10,2) AS avg
    FROM public.reviews WHERE inv_id = $1
  `;
  const result = await pool.query(sql, [inv_id]);
  return result.rows[0];
}

async function insertReview({ inv_id, account_id, rating, comment }){
  const sql = `
    INSERT INTO public.reviews (inv_id, account_id, rating, comment)
    VALUES ($1, $2, $3, $4)
    RETURNING review_id
  `;
  const values = [Number(inv_id), account_id ? Number(account_id) : null, Number(rating), String(comment)];
  const result = await pool.query(sql, values);
  return result.rows[0];
}

module.exports = { getReviewsByVehicle, getAggregateForVehicle, insertReview };
