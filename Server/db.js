const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'football_db',
    password: '2020',
    port: 5432
});

pool.connect()
    .then(() => console.log('Connected to PostgreSQL via pgAdmin'))
    .catch(err => console.error('Connection error', err));

module.exports = pool;
