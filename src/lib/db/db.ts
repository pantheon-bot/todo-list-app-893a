import { TiDBServerlessDialect } from '@tidbcloud/kysely';
import { Kysely } from 'kysely';
import { DB } from './schema';

const db = new Kysely<DB>({
  dialect: new TiDBServerlessDialect({
    url: process.env.DATABASE_URL!,
  }),
});

export default db;