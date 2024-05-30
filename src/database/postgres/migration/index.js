const postgresConnection = require('../../postgres');
const createUsers = require('../migration/createusers');

async function migrationRun() {
    try {
        const db = await postgresConnection();
        const schemas = [createUsers].join('');

        // Executar o schema SQL
        await db.query(schemas);

        console.log('Created table users');
    } catch (error) {
        console.error('Erro ao executar migração:', error);
    }
}

module.exports = migrationRun;
