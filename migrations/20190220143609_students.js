
exports.up = function(knex, Promise) {
  return knex.schema.createTable('students', function(tbl){
        tbl.increments('id');
        tbl.string('name', 128).notNullable();
        tbl
            .string('cohort_name')
            .unsigned()
            .references('name')
            .inTable('cohorts')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .notNullable();
        tbl.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('students');
};
