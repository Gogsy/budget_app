exports.up = function(knex) {
  return knex.schema.createTable('accounts', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.string('name').notNullable(); // npr. PBZ Visa
    table.string('type').notNullable(); // checking / credit
    table.decimal('balance', 10, 2).notNullable(); // trenutačno stanje
    table.decimal('overdraft_limit', 10, 2).defaultTo(0); // dozvoljeni minus
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('accounts');
};
