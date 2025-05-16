exports.up = function(knex) {
  return knex.schema.createTable('transactions', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.integer('account_id').unsigned().notNullable()
      .references('id').inTable('accounts').onDelete('CASCADE');
    table.string('category').notNullable();
    table.decimal('amount', 10, 2).notNullable();
    table.enum('type', ['income', 'expense']).notNullable();
    table.string('description');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('transactions');
};
