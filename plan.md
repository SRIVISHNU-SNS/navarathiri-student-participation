# Navarathiri Participation

## Product and architecture

Replace the earlier Google Form submission with a public React registration form backed by Render Postgres. Retain every source question, choice, required/optional rule and the college-event visual identity. Store a complete record for every valid submission; impose no 50-record ceiling. Keep registration open to participants, and require the supplied six-digit code only for access to `/admin`. Never place the code in source, browser JavaScript or Git. The organiser dashboard is read-only, has a signed short-lived HttpOnly session, and provides a count, table and CSV download.

Prepare—but do not provision or deploy—one Render Blueprint containing a Node/Express web service and Postgres database in Singapore. User selected the two Free plans and accepts that Free Postgres has 1 GB, expires 30 days after creation, and is deleted after its 14-day grace period if not upgraded. Render notes Free Postgres has no backups and the workspace can have only one active Free database. Free web instances sleep after 15 minutes idle and take roughly a minute to wake. Push source to a new private GitHub repository and provide the exact steps for the user to deploy from Render's Blueprint flow. Keep the PIN in Render's un-synced secret prompt; have Render generate the session secret and pass Postgres's internal URL directly to the service.

## Project structure

- `client/src/pages/Home.tsx` — public, validated participation form and clear submit/error/success states.
- `client/src/pages/Admin.tsx` — private-code entry, authenticated records, empty/error/session states and CSV export.
- `client/src/components/NavarathiriWordmark.tsx` — distinctive “Navarathiri” event lettering, flowing dandiya underline and compact “SNS × NIAT” lock-up.
- `client/src/App.tsx` — public `/` and organiser `/admin` routes.
- `client/src/index.css` — responsive folk-art print palette, public form and restrained admin design.
- `client/public/artwork/` — self-contained optimized WebP originals: hero, dancer, dhol, rangoli and illustrated emblem.
- `client/public/navarathiri-mark.svg` — crisp hand-drawn favicon/logo fallback.
- `server/app.ts`, `server/auth.ts`, `server/registration-schema.ts` — bounded and rate-limited APIs, signed access sessions and validation.
- `server/render.ts`, `server/dev.ts`, `server/db/001_init.sql` — production Node host, local API+Vite server and repeatable Postgres schema.
- `render.yaml` — user-run Blueprint declaring the free Singapore database/service and secret-safe connection wiring.
- `client/public/manus-routes.json` — `/` and `/admin` route declarations.
- `package.json`, `pnpm-lock.yaml`, `.node-version` — pinned Node/pnpm toolchain and build/start scripts.
- New private GitHub repository `SRIVISHNU-SNS/navarathiri-student-participation` — requested source destination; Manus's existing remote stays intact for checkpoints.
- `RENDER_DEPLOY.md` — self-serve Blueprint instructions and the free-plan limits.

## Design direction

- **Design Movement:** contemporary Indian festival printmaking with college-event poster energy and warm, hand-illustrated Garba scenes.
- **Core Principles:** joyful color; culturally grounded original drawing; clear event identity; low-friction registration.
- **Color Philosophy:** saffron and warm paper feel welcoming; cobalt ensures contrast; vermilion, fuchsia, leafy green and lilac carry the drawing and selected states.
- **Layout Paradigm:** asymmetric illustrated hero, short art strip, spacious single-column registration and a plain, discreet admin table.
- **Signature Elements:** colorful Garba dancer seal; custom split-color serif wordmark with a dandiya-like flourish; compact “SNS × NIAT” edition lock-up.
- **Interaction Philosophy:** registration stays public; the separate `/admin` gate alone accepts the organiser code. All private data comes from no-store, authenticated same-origin APIs.
- **Animation:** restrained; no perpetual motion; honor reduced-motion preferences.
- **Typography System:** bespoke segmented serif wordmark, system-serifs for display copy, system sans-serif for controls; no external font requests.
- **Brand Essence:** registration and coordination for Navarathiri at SNS College of Technology, Coimbatore × NIAT; **joyful, crafted, direct**.
- **Brand Voice:** short and event-specific. Example lines: “Navarathiri at SNS.” “Register to take part.” Avoid generic filler and decorative dash/bullet copy.
- **Wordmark & Logo:** “Nava” in cobalt and “rathiri” in vermilion italic serif, underlined by a hand-drawn two-color dandiya flourish; pair it with the original illustrated Garba seal, not fabricated partner logos.
- **Signature Brand Color:** royal cobalt (`#2557C8`) balanced with saffron.

## Form and data

The form titled “Navarathiri Student Participation” has required Full Name; required Department/course; required single-choice “How would you like to participate?” with Group Dance, Solo Dance, Classical Dance, Singing / Vocal Performance, Music / Instrumental Performance, Drama / Skit, Traditional Dress / Fashion Walk, Anchoring / Hosting, Rangoli / Creative Activities, Decoration / Event Volunteers and Other; required Individual or Group choice; optional group name, group size and other-member names when Group is selected; required rehearsal availability (Yes, No, Depends on schedule); and required “Any other query?”. Store full validated answers plus a server-generated ID/timestamp in Postgres. The app has no artificial cap at 50 entries. Export prior to Free Postgres expiry.

## Runtime and deployment handoff

Use Node 22, Express and the project's pinned pnpm 10 toolchain. `pnpm build:render` builds the Vite site and standalone Node server; `pnpm start:render` serves `dist/public`, APIs and SPA routes. `DATABASE_URL`, `ADMIN_PIN`, and a generated `SESSION_SECRET` are runtime-only. `render.yaml` keeps the code and connection secrets out of Git. Use parameterized SQL, bounded JSON, per-IP submit/PIN rate limits, authenticated no-store CSV/list responses, and a repeatable `CREATE TABLE IF NOT EXISTS` migration. The normal Manus preview remains static and is not presented as having live database storage. Verify the complete code/build/API shape without inserting responses into a live dataset. Final user handoff includes private repo URL and safe, step-by-step Render Blueprint instructions; do not create Render resources on the user's behalf.
