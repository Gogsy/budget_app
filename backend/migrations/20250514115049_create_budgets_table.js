exports.up = function(knex) {
  return knex.schema.createTable('budgets', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.string('category').notNullable();
    table.decimal('limit', 10, 2).notNullable();
    table.date('month').notNullable(); // npr. 2025-06-01 kao "lipanj 2025"
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.unique(['user_id', 'category', 'month']); // sprječava dupli unos za istu kategoriju i mjesec
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('budgets');
};
