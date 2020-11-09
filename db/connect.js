const { Pool } = require('pg');

const connectConfig = {
    user: 'Whale_User',
    host: '127.0.0.1',
    database: 'Whale_db',
    password: 'SecretPassword',
    port: 5432,
}

const pool = new Pool(connectConfig);

module.exports = pool;