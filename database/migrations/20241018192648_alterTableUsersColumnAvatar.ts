import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable('users', (table) => {
		table.text('avatar').nullable().alter() // Tornar a coluna avatar opcional (nullable)
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable('users', (table) => {
		table.text('avatar').notNullable().alter() // Reverter a coluna para NOT NULL
	})
}


