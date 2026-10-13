# Navarathiri Student Participation — revised design and implementation

## Product and architecture

Build a single-page React/Vite site in the initialized Webdev project on route `/`. Keep the supplied Google Form's wording, requiredness, choices and `entry.*` IDs; validate in the browser and send a native POST to its public `formResponse` endpoint in a hidden iframe. Do not add local response storage, a server or a database. Confirm only after the response frame returns, and give a retry/link-to-source fallback if it cannot be confirmed.

## Project structure

- `client/src/pages/Home.tsx` — event identity, multi-illustration composition, institution attribution, exact registration fields, conditional group details and submission states.
- `client/src/index.css` — saturated Navratri palette, editorial layout, responsive form, focus states and reduced-motion behavior.
- `client/src/App.tsx` — the registration route and not-found fallback.
- `client/public/manus-routes.json` — route declaration for `/`.
- Managed project image storage — four custom illustrations for the dance scene, dancer, dhol player and rangoli vignette.
- `client/public/navarathiri-mark.svg`, the managed Garba emblem and `app.config.ts` — hand-illustrated rangoli dancer site mark, generated hi-colour event emblem and project logo metadata.
- `client/index.html` — event-specific title, description, theme color and favicon.

## Design direction

- **Design Movement:** contemporary Indian festival printmaking, with the energy of a college Navratri poster and confident hand-illustrated folk-art details.
- **Core Principles:** visibly joyful color; distinct, human-feeling illustration on each visual beat; concise event-first copy; familiar, easy forms with no visual clutter.
- **Color Philosophy:** turmeric and warm paper bring light; royal cobalt anchors legibility; coral, fuchsia, leaf green and lilac give each illustration and section its own pulse. Saturated colors belong in art and small page accents; inputs remain clean and high-contrast.
- **Layout Paradigm:** asymmetrical poster-like hero with college attribution and scene art, followed by a compact three-piece art strip and a single-column registration journey, responsive to phone widths.
- **Signature Elements:** a full-colour Garba dancer medallion with a flying skirt and hand-drawn rangoli petals; four distinct festival illustrations; a generous-size repeat of the emblem at footer scale.
- **Interaction Philosophy:** plain, exact labels; native radio and text controls; generous touch targets; group fields only when applicable; requiredness and errors visible and understandable.
- **Animation:** small color/position response on hover and restrained group-field reveal only; no perpetual motion; respect reduced-motion preferences.
- **Typography System:** a human editorial serif for “Navarathiri” and section titles; system sans-serif for labels, controls and supporting copy; no external font request.
- **Brand Essence:** the joyful and practical sign-up point for an SNS College of Technology Navarathiri celebration with NIAT; **lively, crafted, welcoming**.
- **Brand Voice:** short, clear and event-specific. Example copy: “Navarathiri at SNS.” “Register to take part.” Avoid generic filler, tagline fragments, decorative leading dashes and bullet-led microcopy.
- **Wordmark & Logo:** a boldly illustrated dancer spinning with raised dandiya, flared patterned ghaghra and an irregular petal medallion; it sits beside a restrained “Navarathiri” wordmark and scales for header, favicon and project branding. No partner marks are fabricated.
- **Signature Brand Color:** royal cobalt (`#2557C8`) with saffron as its bright festival counterpoint.

## Form and event

The event reference must say **SNS College of Technology, Coimbatore × NIAT**. Reproduce the source “Navarathiri Student Participation” questions and answer choices: required Full Name; Department/course; “How would you like to participate?” with Group Dance, Solo Dance, Classical Dance, Singing / Vocal Performance, Music / Instrumental Performance, Drama / Skit, Traditional Dress / Fashion Walk, Anchoring / Hosting, Rangoli / Creative Activities, Decoration / Event Volunteers, Other; individual/group choice; optional group name, group size and names of other members; rehearsal availability (Yes, No, Depends on schedule); and required “Any other query?”. Retain the original single-choice behavior and exact stored option labels. Show optional group details only when the respondent chooses Group.

## Runtime

Use existing React, Tailwind, TypeScript and lucide dependencies, with no server or database. Keep route manifest, static port 3000 and `build:static`. Preserve the Google Form field IDs and its hidden-response iframe integration. Maintain host-managed TypeScript diagnostics and verify build, form completeness, mobile and desktop rendering before checkpointing.
