import express, { type Request, type Response } from "express";
import { rateLimit } from "express-rate-limit";
import type { Pool } from "pg";
import {
  clearedSessionCookie,
  createAdminSession,
  isValidAdminSession,
  readAdminCookie,
  safePinMatches,
  sessionCookie,
} from "./auth.js";
import { registrationSchema, type RegistrationRecordInput } from "./registration-schema.js";

type RegistrationRow = {
  id: string;
  fullName: string;
  department: string;
  participation: string;
  participantType: "Individual" | "Group";
  groupName: string;
  groupSize: string;
  groupMembers: string;
  rehearsal: string;
  query: string;
  createdAt: Date;
};

type AppOptions = {
  pool: Pool;
  adminPin: string;
  sessionSecret: string;
};

const registrationColumns = `
  id::text AS id,
  full_name AS "fullName",
  department,
  participation,
  participant_type AS "participantType",
  group_name AS "groupName",
  group_size AS "groupSize",
  group_members AS "groupMembers",
  rehearsal,
  other_query AS query,
  created_at AS "createdAt"
`;

function createLimiter(limit: number, windowMs: number, message: string) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (_request, response) => response.status(429).json({ message }),
  });
}

function preventCaching(_request: Request, response: Response, next: () => void) {
  response.setHeader("Cache-Control", "private, no-store, max-age=0");
  next();
}

function hasAdminSession(request: Request, response: Response, secret: string) {
  const token = readAdminCookie(request.get("cookie"));
  if (isValidAdminSession(token, secret)) return true;
  response.setHeader("Set-Cookie", clearedSessionCookie(request.secure));
  response.status(401).json({ message: "Enter the organiser code to continue." });
  return false;
}

async function selectRegistrations(pool: Pool) {
  const result = await pool.query<RegistrationRow>(
    `SELECT ${registrationColumns} FROM registrations ORDER BY created_at DESC, id DESC`,
  );
  return result.rows;
}

function csvCell(value: unknown) {
  let content = value instanceof Date ? value.toISOString() : String(value ?? "");
  if (/^[\t\r\n ]*[=+\-@]/.test(content)) content = `'${content}`;
  return `"${content.replaceAll('"', '""')}"`;
}

function registrationsCsv(rows: RegistrationRow[]) {
  const headings = [
    "ID",
    "Submitted at",
    "Full name",
    "Department/course",
    "Participation",
    "Individual or group",
    "Group name",
    "Group size",
    "Other group members",
    "Rehearsal",
    "Any other query",
  ];
  const data = rows.map((row) => [
    row.id,
    row.createdAt,
    row.fullName,
    row.department,
    row.participation,
    row.participantType,
    row.groupName,
    row.groupSize,
    row.groupMembers,
    row.rehearsal,
    row.query,
  ]);
  return `\uFEFF${[headings, ...data].map((line) => line.map(csvCell).join(",")).join("\r\n")}\r\n`;
}

export function createRegistrationApp({ pool, adminPin, sessionSecret }: AppOptions) {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(express.json({ limit: "32kb", strict: true }));

  app.get("/api/health", (_request, response) => {
    response.setHeader("Cache-Control", "no-store");
    response.status(200).json({ ok: true });
  });

  app.post(
    "/api/registrations",
    createLimiter(60, 60_000, "Please wait a moment before trying again."),
    async (request, response) => {
      const parsed = registrationSchema.safeParse(request.body);
      if (!parsed.success) {
        response.status(400).json({
          message: "Check the required answers and try again.",
          fields: parsed.error.flatten().fieldErrors,
        });
        return;
      }

      const entry: RegistrationRecordInput = parsed.data;
      try {
        const result = await pool.query<{ id: string }>(
          `INSERT INTO registrations
            (full_name, department, participation, participant_type, group_name, group_size, group_members, rehearsal, other_query)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING id::text AS id`,
          [
            entry.fullName,
            entry.department,
            entry.participation,
            entry.participantType,
            entry.groupName,
            entry.groupSize,
            entry.groupMembers,
            entry.rehearsal,
            entry.query,
          ],
        );
        response.status(201).json({ ok: true, id: result.rows[0]?.id });
      } catch (error) {
        const code = (error as { code?: unknown })?.code;
        console.error("Registration write failed", typeof code === "string" ? code : "database error");
        response.status(503).json({
          message: "Your response could not be saved right now. Please try again shortly.",
        });
      }
    },
  );

  app.use("/api/admin", preventCaching);
  app.post(
    "/api/admin/login",
    createLimiter(5, 15 * 60_000, "Too many attempts. Please wait before trying again."),
    (request, response) => {
      const code = typeof request.body?.code === "string" ? request.body.code : "";
      if (!/^\d{6}$/.test(code) || !safePinMatches(code, adminPin)) {
        response.status(401).json({ message: "The code was not accepted." });
        return;
      }
      const token = createAdminSession(sessionSecret);
      response.setHeader("Set-Cookie", sessionCookie(token, request.secure));
      response.status(200).json({ authenticated: true });
    },
  );

  app.get("/api/admin/session", (request, response) => {
    const token = readAdminCookie(request.get("cookie"));
    if (!isValidAdminSession(token, sessionSecret)) {
      response.setHeader("Set-Cookie", clearedSessionCookie(request.secure));
      response.status(401).json({ message: "Enter the organiser code to continue." });
      return;
    }
    response.status(200).json({ authenticated: true });
  });

  app.post("/api/admin/logout", (_request, response) => {
    response.setHeader("Set-Cookie", clearedSessionCookie(_request.secure));
    response.status(200).json({ signedOut: true });
  });

  app.get("/api/admin/registrations", async (request, response) => {
    if (!hasAdminSession(request, response, sessionSecret)) return;
    try {
      const entries = await selectRegistrations(pool);
      response.status(200).json({ count: entries.length, entries });
    } catch (error) {
      const code = (error as { code?: unknown })?.code;
      console.error("Registration list failed", typeof code === "string" ? code : "database error");
      response.status(503).json({ message: "Registrations are temporarily unavailable." });
    }
  });

  app.get("/api/admin/export.csv", async (request, response) => {
    if (!hasAdminSession(request, response, sessionSecret)) return;
    try {
      const entries = await selectRegistrations(pool);
      response.setHeader("Content-Type", "text/csv; charset=utf-8");
      response.setHeader("Content-Disposition", 'attachment; filename="navarathiri-registrations.csv"');
      response.status(200).send(registrationsCsv(entries));
    } catch (error) {
      const code = (error as { code?: unknown })?.code;
      console.error("Registration export failed", typeof code === "string" ? code : "database error");
      response.status(503).json({ message: "The CSV export is temporarily unavailable." });
    }
  });

  app.use("/api", (_request, response) => {
    response.status(404).json({ message: "API route not found." });
  });

  app.use((error: unknown, request: Request, response: Response, next: (error?: unknown) => void) => {
    if (!request.path.startsWith("/api/")) {
      next(error);
      return;
    }
    const type = (error as { type?: string })?.type;
    const tooLarge = type === "entity.too.large";
    response.status(tooLarge ? 413 : 400).json({
      message: tooLarge ? "The request is too large." : "The request could not be processed.",
    });
  });

  return app;
}
