const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool({
  connectionString: config.database.connectionString,
  ssl: config.database.ssl,
  ...config.database.poolConfig,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};

