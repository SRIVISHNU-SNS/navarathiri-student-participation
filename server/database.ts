import { readFile } from "node:fs/promises";
import path from "node:path";
import { Pool } from "pg";

export function createDatabasePool(connectionString: string) {
  return new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });
}

export async function initializeDatabase(pool: Pool) {
  const migration = await readFile(
    path.resolve(process.cwd(), "server/db/001_init.sql"),
    "utf8",
  );
  await pool.query(migration);
}
