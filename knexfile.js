const path = require('path');
require('dotenv').config()

module.exports = {
    development: {
        client: 'postgres',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            
        },

        pool: {
            min: 2,
            max: 10
        },

        migrations: {
            directory: path.resolve(__dirname, "src", "database", "knex", "migrations")
        },

        useNullAsDefault: true
    }
};
