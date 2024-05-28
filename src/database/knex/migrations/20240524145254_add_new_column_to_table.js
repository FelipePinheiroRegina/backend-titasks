exports.up = function(knex) {
    return knex.schema.table('answer', function(table) {
      table.text('name'); // Adiciona uma nova coluna chamada new_column do tipo string
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.table('answer', function(table) {
      table.dropColumn('name'); // Remove a coluna new_column se a migração for revertida
    });
  };
  