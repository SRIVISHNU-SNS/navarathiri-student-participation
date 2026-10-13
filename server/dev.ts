import "dotenv/config";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createRegistrationApp } from "./app.js";
import { createDatabasePool, initializeDatabase } from "./database.js";
import { createServer as createViteServer } from "vite";
import viteConfig from "../vite.config";

async function start() {
  const databaseUrl = process.env.DATABASE_URL;
  const adminPin = process.env.ADMIN_PIN ?? "";
  const sessionSecret = process.env.SESSION_SECRET ?? "";
  if (!databaseUrl) throw new Error("Set DATABASE_URL in your local .env file.");
  if (!/^\d{6}$/.test(adminPin)) throw new Error("Set ADMIN_PIN to a private six-digit code in .env.");
  if (sessionSecret.length < 32) throw new Error("Set SESSION_SECRET to a private value of at least 32 characters.");

  const pool = createDatabasePool(databaseUrl);
  await initializeDatabase(pool);
  const app = createRegistrationApp({ pool, adminPin, sessionSecret });
  const httpServer = createServer(app);
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: {
      middlewareMode: true,
      hmr: { server: httpServer },
      allowedHosts: true,
    },
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use(async (request, response, next) => {
    try {
      const templatePath = path.resolve(process.cwd(), "client/index.html");
      const template = await readFile(templatePath, "utf8");
      const page = await vite.transformIndexHtml(request.originalUrl, template);
      response.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (error) {
      vite.ssrFixStacktrace(error as Error);
      next(error);
    }
  });

  const port = Number.parseInt(process.env.PORT ?? "3000", 10);
  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`Navarathiri development service listening on ${port}.`);
  });
}

start().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown startup failure.";
  console.error(`Navarathiri development service failed: ${message}`);
  process.exitCode = 1;
});
