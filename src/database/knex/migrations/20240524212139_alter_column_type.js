exports.up = function(knex) {
    return knex.schema.alterTable('tasks', function(table) {
        table.datetime('updated_at').alter(); // Altere o tipo da coluna diretamente
    });
};

exports.down = function(knex) {
    return knex.schema.alterTable('tasks', function(table) {
        table.string('updated_at').alter(); // Volte ao tipo original da coluna, se necessário
    });
};
