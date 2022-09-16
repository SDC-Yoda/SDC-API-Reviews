require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool ({
  user: 'tannerwhite',
  host: 'localhost',
  database: 'practice',
  password: 'null',
  port: process.env.PGPORT,
});

module.exports = pool;
