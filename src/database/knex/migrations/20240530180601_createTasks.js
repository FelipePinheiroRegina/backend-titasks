exports.up = knex => knex.schema.createTable('tasks', table => {
    table.increments('id')
    table.text('title')
    table.text('description')
    table.datetime('deadline')
    table.text('status')
    
    table.integer('user_id').references('id').inTable('users')

    table.timestamp('created_at').default(knex.fn.now())
    table.datetime('updated_at')

    table.integer('user_id_answer')
    table.text('answer')
    table.text('image')
    table.datetime('date_answer')
}) 

exports.down = knex => knex.schema.dropTable('tasks')