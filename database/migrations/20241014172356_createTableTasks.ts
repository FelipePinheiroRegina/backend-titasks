import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('tasks', (table) => {
		table.increments('id').primary().index()
		table.text('title').notNullable()
		table.text('description').notNullable()
		table.boolean('status').notNullable().defaultTo(false)
		table.text('image')
		table.timestamp('created_at').defaultTo(knex.fn.now())
		table.timestamp('updated_at').defaultTo(knex.fn.now())

		table.integer('user_id').references('id').inTable('users').onDelete('CASCADE').index()
	})
}


export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('tasks')
}

