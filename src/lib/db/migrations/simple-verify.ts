import { connect } from '@tidbcloud/serverless';

async function simpleVerify() {
  const conn = connect({ url: process.env.DATABASE_URL! });

  try {
    // Clean up any test data first
    await conn.execute('DELETE FROM users WHERE email = ?', ['test@example.com']);

    // Test insert
    console.log('Testing INSERT...');
    await conn.execute(
      'INSERT INTO users (email, username) VALUES (?, ?)',
      ['test@example.com', 'testuser']
    );
    console.log('✓ INSERT successful');

    // Test select
    console.log('\nTesting SELECT...');
    const result = await conn.execute('SELECT id, email, username FROM users WHERE email = ?', ['test@example.com']);
    console.log('✓ SELECT successful');
    console.log('User data:', JSON.stringify(result.rows, null, 2));

    // Test todo insert
    if (result.rows && result.rows.length > 0) {
      const userId = (result.rows[0] as any).id;
      console.log('\nTesting TODO INSERT...');
      await conn.execute(
        'INSERT INTO todos (user_id, title, description) VALUES (?, ?, ?)',
        [userId, 'Test Todo', 'This is a test todo item']
      );
      console.log('✓ TODO INSERT successful');

      // Test todo select
      console.log('\nTesting TODO SELECT...');
      const todoResult = await conn.execute('SELECT * FROM todos WHERE user_id = ?', [userId]);
      console.log('✓ TODO SELECT successful');
      console.log('Todo data:', JSON.stringify(todoResult.rows, null, 2));

      // Clean up
      await conn.execute('DELETE FROM todos WHERE user_id = ?', [userId]);
    }

    // Clean up user
    await conn.execute('DELETE FROM users WHERE email = ?', ['test@example.com']);
    console.log('\n✓ Test data cleaned up');

    console.log('\n✅ All database operations working correctly!');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

simpleVerify()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
