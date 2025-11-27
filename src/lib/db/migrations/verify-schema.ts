import { connect } from '@tidbcloud/serverless';

async function verifySchema() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  console.log('Connecting to TiDB Cloud...');
  const conn = connect({ url: databaseUrl });

  try {
    // Show all tables
    console.log('\n=== Tables in database ===');
    const tablesResult = await conn.execute('SHOW TABLES');
    if (tablesResult.rows && tablesResult.rows.length > 0) {
      tablesResult.rows.forEach((row: any) => {
        console.log('-', Object.values(row)[0]);
      });
    }

    // Describe users table
    console.log('\n=== Structure of users table ===');
    const usersStructure = await conn.execute('DESCRIBE users');
    if (usersStructure.rows && usersStructure.rows.length > 0) {
      usersStructure.rows.forEach((row: any) => {
        console.log(`  ${row.Field}: ${row.Type} ${row.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${row.Key ? `[${row.Key}]` : ''}`);
      });
    }

    // Describe todos table
    console.log('\n=== Structure of todos table ===');
    const todosStructure = await conn.execute('DESCRIBE todos');
    if (todosStructure.rows && todosStructure.rows.length > 0) {
      todosStructure.rows.forEach((row: any) => {
        console.log(`  ${row.Field}: ${row.Type} ${row.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${row.Key ? `[${row.Key}]` : ''}`);
      });
    }

    // Test insert and query
    console.log('\n=== Testing basic CRUD operations ===');

    // Insert test user
    console.log('Inserting test user...');
    const insertUserResult = await conn.execute(
      'INSERT INTO users (email, username) VALUES (?, ?)',
      ['test@example.com', 'testuser']
    );
    console.log('✓ User inserted successfully');

    // Query the user back
    const selectUserResult = await conn.execute('SELECT * FROM users WHERE email = ?', ['test@example.com']);
    if (selectUserResult.rows && selectUserResult.rows.length > 0) {
      console.log('✓ User retrieved:', selectUserResult.rows[0]);
    }

    // Clean up test data
    await conn.execute('DELETE FROM users WHERE email = ?', ['test@example.com']);
    console.log('✓ Test data cleaned up');

    console.log('\n✅ Schema verification and basic operations completed successfully!');
  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  }
}

verifySchema()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
