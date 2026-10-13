import express from "express";
import path from "node:path";
import { createRegistrationApp } from "./app.js";
import { createDatabasePool, initializeDatabase } from "./database.js";

async function start() {
  const databaseUrl = process.env.DATABASE_URL;
  const adminPin = process.env.ADMIN_PIN ?? "";
  const sessionSecret = process.env.SESSION_SECRET ?? "";
  if (!databaseUrl) throw new Error("DATABASE_URL is required.");
  if (!/^\d{6}$/.test(adminPin)) throw new Error("ADMIN_PIN must contain six digits.");
  if (sessionSecret.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters.");

  const pool = createDatabasePool(databaseUrl);
  try {
    await initializeDatabase(pool);
  } catch (error) {
    await pool.end();
    throw error;
  }

  const app = createRegistrationApp({ pool, adminPin, sessionSecret });
  const publicDirectory = path.resolve(process.cwd(), "dist/public");
  app.use(express.static(publicDirectory, { index: false }));
  app.get("*", (_request, response) => {
    response.setHeader("Cache-Control", "no-cache");
    response.sendFile(path.join(publicDirectory, "index.html"));
  });

  const port = Number.parseInt(process.env.PORT ?? "10000", 10);
  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`Navarathiri service listening on ${port}.`);
  });
  server.on("error", (error) => {
    console.error("HTTP server failed to start.", error.message);
    process.exitCode = 1;
  });
}

start().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown startup failure.";
  console.error(`Navarathiri service startup failed: ${message}`);
  process.exitCode = 1;
});
