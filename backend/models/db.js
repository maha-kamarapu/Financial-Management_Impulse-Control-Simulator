const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres', // Replace with your PostgreSQL username
  host: 'localhost', // Default PostgreSQL host
  database: 'impulse_control_simulator', // Your database name
  password: 'mahalakshmi', // Replace with your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

module.exports = pool;
