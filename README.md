# Navarathiri Student Participation

A mobile-first registration site for Navarathiri at SNS College of Technology, Coimbatore × NIAT. The public form stores registrations in Postgres. The organiser-only dashboard is at `/admin`; students do not enter a code.

## Deploy

Push this repository's `main` branch to GitHub, then follow [RENDER_DEPLOY.md](RENDER_DEPLOY.md) to deploy the checked-in Render Blueprint. The Blueprint keeps the organiser code in a protected Render prompt; do not commit secrets or participant data.

## Commands

- `pnpm install --frozen-lockfile --prod=false` — install the pinned dependencies.
- `pnpm check` — run TypeScript diagnostics.
- `pnpm test` — run schema and session tests.
- `pnpm build:render` — build the React site and Render server.
- `pnpm start:render` — serve the production build (requires `DATABASE_URL`, `ADMIN_PIN`, and `SESSION_SECRET`).
- `pnpm dev:static` — run the visual-only Manus Preview; it does not persist submissions.

The Postgres schema is at `server/db/001_init.sql`. Set secrets only in Render's protected environment settings; no access code or database URL belongs in Git.
