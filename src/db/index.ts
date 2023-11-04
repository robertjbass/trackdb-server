import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import * as schema from './schema';

const connectionString = process.env.CONNECTION_STRING as string;
const client = postgres(connectionString, { max: 1 });
export const db = drizzle(client, { schema });

export const initMigrations = async () => {
  await migrate(db, { migrationsFolder: './src/db/migrations' });
  console.log('migrations complete');
};
