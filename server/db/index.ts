import dotenv from 'dotenv';
dotenv.config();

import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

neonConfig.fetchConnectionCache = true;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined. Make sure .env file exists in the server directory.');
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql);
