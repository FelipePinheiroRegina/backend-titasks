import type { Knex } from 'knex'


export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable('answers', (table) => {
		table.dropColumn('avatar')
		table.dropColumn('name')
	})
}


export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable('answers', (table) => {
	    table.text('avatar').notNullable()
	    table.text('name').notNullable()
	})
}

