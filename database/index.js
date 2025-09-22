require("dotenv").config();
const { Pool } = require("pg");

const {
  DATABASE_URL,
  PGHOST,
  PGPORT,
  PGDATABASE,
  PGUSER,
  PGPASSWORD,
  NODE_ENV
} = process.env;

let poolConfig = {};

if (DATABASE_URL) {
  poolConfig.connectionString = DATABASE_URL;

  poolConfig.ssl = {
    rejectUnauthorized: false
  };
} else {
  poolConfig = {
    host: PGHOST || "localhost",
    port: Number(PGPORT) || 5432,
    database: PGDATABASE || "cse340",
    user: PGUSER || "postgres",
    password: PGPASSWORD || "",
    ssl: false
  };
}

const pool = new Pool(poolConfig);

module.exports = pool;
