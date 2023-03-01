const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'mitron16',
    database: 'online_store'
});

pool.query(`
  CREATE SCHEMA IF NOT EXISTS online_store;
  CREATE TABLE IF NOT EXISTS online_store.users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
)`, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Table users created successfully');
    }
});

pool.query(`
    CREATE TABLE IF NOT EXISTS online_store.tovar(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    price NUMERIC(10, 2) NOT NULL,
    image TEXT
  )`, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Table tovar created successfully');
    }
});

pool.query(`
    CREATE TABLE IF NOT EXISTS online_store.cart(
    id SERIAL PRIMARY KEY,
    itemId INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    FOREIGN KEY (itemId) REFERENCES online_store.tovar(id) ON DELETE CASCADE
  )`,
    (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Table cart created successfully');
        }
    });

module.exports = pool;