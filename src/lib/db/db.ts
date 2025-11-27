import { TiDBServerlessDialect } from '@tidbcloud/kysely';
import { Kysely } from 'kysely';

const db = new Kysely({
  dialect: new TiDBServerlessDialect({
    url: process.env.DATABASE_URL!,
  }),
});

export default db;