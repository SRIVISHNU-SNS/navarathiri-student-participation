# Navarathiri Student Participation — implementation plan

## Product and architecture

Build a single-page React/Vite website in the initialized Webdev project, using its existing TypeScript and Tailwind setup. The one public route is `/`. Serve a matching static `client/public/manus-routes.json`; do not add a backend or database because this public registration flow can submit directly to the supplied public Google Form. Keep the source question wording, response choices, required flags and response destination in one small typed form configuration. Use a native cross-origin POST in a hidden iframe to the original Google Forms `formResponse` endpoint, using the source form's `entry.*` fields. Validate on the page before posting; on completion, replace the form with an honest confirmation state and show the original form as a fallback if the response cannot be confirmed. Do not collect registrations locally or display a saved-success state before the response frame returns.

### Project structure

- `client/src/pages/Home.tsx` — page composition, responsive Navarathiri introduction, form sections, client validation, native submission and confirmation state.
- `client/src/index.css` — page-specific colors, typography, spacing, responsive behavior, focus and reduced-motion styling.
- `client/src/App.tsx` — one home route and not-found fallback.
- `client/public/manus-routes.json` — exact page-route manifest for `/`.
- Managed image storage — bespoke hero and rangoli/dandiya artwork, referenced by the exact managed-storage URLs returned by image generation.
- `client/index.html` — title, description, theme color and lightweight metadata.

## Design system

- **Design Movement:** contemporary Indian cultural editorial, grounded in hand-printed folk-art linework and the quiet confidence of an independent arts institution.
- **Core Principles:** generous breathing room; legibility before ornament; culturally specific detail without visual clutter; warm, confident craft.
- **Color Philosophy:** an uncoated-paper ivory canvas lets vermilion and aubergine feel vivid but composed; marigold ochre and muted leaf green appear as restrained accents. High-contrast dark ink carries all essential copy and controls.
- **Layout Paradigm:** a spacious editorial masthead and asymmetric two-column hero on wide screens, followed by a narrow, vertically stacked form journey; a naturally single-column reading flow on phones. Do not center every element in a generic card grid.
- **Signature Elements:** custom ink-and-gouache dance illustration; a small rangoli/dandiya print; fine rules and numbered section markers inspired by a festival programme.
- **Interaction Philosophy:** clear, direct labels; large touch targets; native semantic inputs; visible required markers and errors; group details reveal only for group participants; every action is reversible without losing prior values.
- **Animation:** subtle one-time fade/translate for decorative art only, with no layout movement; no looping motion; respect `prefers-reduced-motion` and keep the form immediately usable.
- **Typography System:** system sans-serif for labels, helper text and body copy; Georgia/serif display headlines for an editorial voice. Load no external font, preserving speed and dependable mobile rendering.
- **Brand Essence:** a thoughtful, student-first doorway into campus Navarathiri participation; **warm, expressive, considered**.
- **Brand Voice:** concise, inviting, and practical. Examples: “Bring your part to the celebration.” “A few details, then you’re on the programme.”
- **Wordmark & Logo:** a compact custom diya/rangoli mark beside the “Navarathiri” name, drawn as simple print-like geometry rather than a default-font icon.
- **Signature Brand Color:** deep vermilion (`#C94D37`), used for primary actions and small wayfinding accents.

## Form behavior and content

Reproduce the supplied “Navarathiri Student Participation” form. Required questions are Full Name; Department/course; How would you like to participate? (Group Dance, Solo Dance, Classical Dance, Singing / Vocal Performance, Music / Instrumental Performance, Drama / Skit, Traditional Dress / Fashion Walk, Anchoring / Hosting, Rangoli / Creative Activities, Decoration / Event Volunteers, Other); Are you participating individually or as a group? (Individual, Group); Are you available for the rehearsal? (Yes, No, Depends on schedule); and Any other query? Optional fields are group name, group size, and other group members' names. Preserve the source's single-choice interaction for each multiple-choice question. Keep optional group fields visually secondary and show them when Group is selected. On submit, map fields to the source Google Form response IDs and exact response labels (cleaning visible `[ ] ` prefixes from choice copy only if necessary while preserving the source's stored choice text). Add accessible validation and a clear confirmation/failure state.

## Serving and dependencies

Use existing React/Vite/TypeScript dependencies, with no extra runtime packages. This static site uses no database and no server; retain the initialized port and `build:static` configuration. Use the configured host TypeScript diagnostics. Start the existing static dev script on port 3000 only after the route manifest is in place, then validate with `pnpm check`, `pnpm build:static`, route-manifest HTTP check, and targeted phone/desktop rendering review.
