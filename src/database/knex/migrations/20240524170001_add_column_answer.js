exports.up = function(knex) {
    return knex.schema.table('answer', function(table) {
      table.text('avatar_user_answer'); // Adiciona uma nova coluna chamada new_column do tipo string
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.table('answer', function(table) {
      table.dropColumn('avatar_user_answer'); // Remove a coluna new_column se a migração for revertida
    });
  };
  