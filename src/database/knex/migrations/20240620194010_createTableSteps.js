exports.up = knex => knex.schema.createTable('steps', table => {
    table.increments('id')
    table.text('description').notNullable();
    table.text('media')
    
    table.timestamps(true, true)
    
    // fazendo a relacação com a tabela documentations
    table.integer('documentations_id').references('id').inTable('documentations').onDelete('CASCADE')
}) 
  
exports.down = knex => knex.schema.dropTable('steps')
