const knex = require('knex');
const path = require('path');
const config = require('../src/database/knexfile');

async function migrate() {
  const db = knex(config.development);
  try {
    console.log('Running migrations...');
    await db.migrate.latest();
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

migrate();
