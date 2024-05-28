exports.up = knex => knex.schema.createTable('answer', table => {
    table.increments('id')
    table.text('name')
    table.text('answer')
    table.text('prints')
    
    // fazendo a relacação com a tabela users e tasks
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.integer('task_id').references('id').inTable('tasks').onDelete('CASCADE')

    table.timestamp('created_at').default(knex.fn.now())
}) 
  


exports.down = knex => knex.schema.dropTable('answer')