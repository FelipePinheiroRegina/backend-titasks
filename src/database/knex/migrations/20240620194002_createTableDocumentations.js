exports.up = knex => knex.schema.createTable('documentations', table => {
    table.increments('id')
    table.text('title').notNullable();
    table.text('description').notNullable();
    table.text('media')
    
    table.timestamps(true, true)
}) 

exports.down = knex => knex.schema.dropTable('documentations')
