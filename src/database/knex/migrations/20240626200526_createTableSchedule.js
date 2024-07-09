exports.up = knex => knex.schema.createTable('schedule', table => {
    table.increments('id')
    table.text('title').notNullable()
    table.text('description')
    table.datetime('scheduled')
    table.float('price')
    table.boolean('done').defaultTo(false)
    table.boolean('priority').defaultTo(false)
    
    table.timestamps(true, true)
    
    // fazendo a relacação com a tabela documentations
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
}) 
  
exports.down = knex => knex.schema.dropTable('schedule')