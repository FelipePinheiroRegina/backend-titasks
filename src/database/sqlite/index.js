const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

async function sqliteConnection() {
    const database = await sqlite.open({
        filename: '/mnt/database/database.db', // Caminho no disco EBS
        driver: sqlite3.Database
    });
    
    return database;
}


module.exports = sqliteConnection
