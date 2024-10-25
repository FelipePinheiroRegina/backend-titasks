import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('answers', (table) => {
		table.uuid('id').primary().index()
		table.text('name').notNullable()
		table.text('description').notNullable()
		table.text('image')
		table.text('avatar').notNullable()

		table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
		table.integer('task_id').references('id').inTable('tasks').onDelete('CASCADE')

		table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
		table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
	})
}


export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('answers')
}

