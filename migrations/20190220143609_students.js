
exports.up = function(knex, Promise) {
  return knex.schema.createTable('students', function(tbl){
        tbl.increments('id');
        tbl.string('name', 128).notNullable();
        tbl
            .integer('cohort_id')
            .unsigned()
            .references('id')
            .inTable('cohorts')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        tbl.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('students');
};
