# TODO

- [x] **Public registration and data handling**
  - Show the “Navarathiri Student Participation” form. Preserve required Full Name and Department/course; required single-choice “How would you like to participate?” with Group Dance, Solo Dance, Classical Dance, Singing / Vocal Performance, Music / Instrumental Performance, Drama / Skit, Traditional Dress / Fashion Walk, Anchoring / Hosting, Rangoli / Creative Activities, Decoration / Event Volunteers, and Other; required “Are you participating individually or as a group?” with Individual and Group; optional group name, group size, and other group-member names; required “Are you available for the rehearsal?” with Yes, No, Depends on schedule; and required “Any other query?”.
  - Keep registration public. Validate required answers in browser and server, reveal the optional group details only when Group is chosen, and show truthful success/error states.
  - Store each complete response and a timestamp in Postgres with no fixed 50-entry cap. Use parameterized inserts and rate-limited, bounded request bodies. An isolated API test successfully stores and returns 50 sample rows.

- [x] **Organiser-only dashboard**
  - Create `/admin` with the supplied six-digit code as an organiser-only unlock; participants never need it, and no unauthenticated user can see registration data.
  - Keep the code server-side outside the repository and browser bundle. Limit guesses, issue a short-lived signed HttpOnly session and mark private data `no-store`.
  - Show a count and full submissions, plus CSV export. Cover wrong/empty code, empty list, expired session, data-fetch failure and logout.

- [x] **Custom Navarathiri event identity**
  - Make “Navarathiri” an event-specific wordmark with split-color serif lettering, an original dandiya-like hand-drawn underline and compact “SNS × NIAT” lock-up, paired with the illustrated dancer seal.
  - Clearly identify SNS College of Technology, Coimbatore × NIAT. Bundle distinct colorful Navratri illustrations so they also appear when hosted outside Manus.

- [x] **Responsive performance and validation**
  - Keep the public form easy to complete on a phone; preserve responsive layouts, readable text, touch-sized controls, clear validation and a non-crowded dashboard.
  - Optimize/bundle illustrations for phone loading and respect reduced-motion preferences. Desktop and 375px mobile screenshots show the registration form and organiser gate without overflow.

- [x] **GitHub push and Render handoff**
  - Create a new private GitHub repo under SRIVISHNU-SNS and push the finished `main` branch without replacing the existing Manus remote.
  - Prepare a Render Blueprint for the Free Node service and Free Postgres in Singapore, connect the database privately, generate the session secret and ask the deploying owner to set the organiser code in Render's protected prompt. Do not provision or deploy Render resources in this task.
  - In `RENDER_DEPLOY.md` and the final answer, note the accepted Free Postgres 1 GB capacity/30-day lifespan/14-day deletion grace, no backups and one-free-database workspace limit, and the Free web service's 15-minute idle sleep/roughly one-minute wake time; give concrete steps for the user to deploy from their private repo.
