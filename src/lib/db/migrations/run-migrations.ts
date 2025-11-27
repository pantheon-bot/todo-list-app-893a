import { connect } from '@tidbcloud/serverless';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  console.log('Connecting to TiDB Cloud...');
  const conn = connect({ url: databaseUrl });

  try {
    // Read migration file
    const migrationPath = path.join(__dirname, '001_initial_schema.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf-8');

    console.log('Running migration: 001_initial_schema.sql');

    // Remove comments and split by semicolons
    const cleanSql = migrationSql
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');

    const statements = cleanSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      console.log(`\nExecuting statement:\n${statement.substring(0, 100)}...\n`);
      await conn.execute(statement);
      console.log('✓ Statement executed successfully');
    }

    console.log('Migration completed successfully!');

    // Verify tables were created
    const tablesResult: any = await conn.execute('SHOW TABLES');
    console.log('\nCurrent tables in database:');
    console.log(tablesResult.rows || tablesResult);

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

runMigrations()
  .then(() => {
    console.log('\n✅ All migrations completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
