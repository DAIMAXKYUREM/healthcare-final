import { Pool } from 'pg';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("CRITICAL ERROR: DATABASE_URL environment variable is not set.");
  console.error("Please set DATABASE_URL to your PostgreSQL connection string (e.g., from Supabase).");
  console.error("You can set this in the Secrets panel or in a .env file.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
});

// Helper to convert ? to $1, $2, etc.
function convertQuery(sql: string) {
  let i = 1;
  return sql.replace(/\?/g, () => `$${i++}`);
}

export const db = {
  query: async (sql: string, params: any[] = []) => {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
    return pool.query(convertQuery(sql), params);
  },
  queryOne: async (sql: string, params: any[] = []) => {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
    const res = await pool.query(convertQuery(sql), params);
    return res.rows[0];
  },
  execute: async (sql: string, params: any[] = []) => {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
    const res = await pool.query(convertQuery(sql), params);
    return { changes: res.rowCount, lastInsertRowid: res.rows[0]?.id };
  },
  getClient: async () => {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
    return await pool.connect();
  },
  transaction: () => {
    return async (cb: any) => {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const result = await cb(client);
        await client.query('COMMIT');
        return result;
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
    };
  }
};

export async function initDb() {
  if (!process.env.DATABASE_URL) {
    console.log("Skipping database initialization because DATABASE_URL is not set.");
    return;
  }

  const schemaPath = path.join(process.cwd(), 'server', 'database', 'schema.sql');
  const seedPath = path.join(process.cwd(), 'server', 'database', 'seed.sql');
  
  try {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schema);

    // Check if admin exists, if not run seed
    const adminExists = await pool.query("SELECT * FROM users WHERE role = 'admin'");
    if (adminExists.rows.length === 0) {
      const seed = fs.readFileSync(seedPath, 'utf8');
      await pool.query(seed);
      console.log("Database seeded successfully.");
    }
  } catch (e) {
    console.log("Error initializing database:", e);
  }
}
