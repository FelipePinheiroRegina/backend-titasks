const { Pool } = require('pg')
require('dotenv').config()

async function postgresConnection() {
    const client = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    })

    await client.connect();

    return client;
}

module.exports = postgresConnection

