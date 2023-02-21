const { Pool } = require('pg');

const pool = new Pool({
    host:'localhost',
    port: 5432,
    user:'postgres',
    password: 'mitron16',
    database: 'online_store'
})

pool.query(`
  CREATE SCHEMA IF NOT EXISTS online_store;
  CREATE TABLE IF NOT EXISTS online_store.users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);`, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Table users created successfully');
  }
});

module.exports = pool;






