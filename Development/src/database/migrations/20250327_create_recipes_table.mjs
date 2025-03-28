export function up(knex) {
  return knex.schema.createTable('recipes', function(table) {
    table.string('id').primary();
    table.string('title').notNullable();
    table.text('description');
    table.json('ingredients');
    table.json('instructions');
    table.string('cookTime');
    table.string('prepTime');
    table.string('totalTime');
    table.string('recipeYield');
    table.string('category');
    table.string('cuisine');
    table.string('author');
    table.json('proteinTags');
    table.json('veggieTags');
    table.json('herbTags');
    table.json('cookware');
    table.string('difficulty');
    table.timestamps(true, true);
  });
}

export function down(knex) {
  return knex.schema.dropTable('recipes');
}