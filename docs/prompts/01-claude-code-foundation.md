Use in Claude Code, opened in the eko-watch repository root, in plan mode (Shift+Tab).

```
Read CLAUDE.md, docs/intent/ekowatch.md, docs/build.pdf (sections 4, 7, 8 and 11),
docs/decisions.md and docs/design/README.md before anything else.
openapi.yaml does not exist yet; do not invent endpoints.

Task: set up the foundation of the EkoWatch frontend. No real screens and no API
endpoints yet. Just the base everything else will sit on. No mock data anywhere.

Scope:
1. Remove the Vite starter content: src/App.tsx, src/App.css, src/assets/react.svg,
   src/assets/vite.svg, src/assets/hero.png and public/icons.svg. Keep the EkoWatch
   logo files already in public/ and src/assets/ (see docs/design/README.md, "Logo").
2. Install and configure, checking current versions work together with Vite 8 and
   React 19: Tailwind CSS (via @tailwindcss/vite), Redux Toolkit + React Redux,
   React Router, Formik, Yup, @fontsource/nunito (weights 400, 600, 700, 800 only),
   Vitest with Testing Library and jsdom (for pure-logic tests only),
   eslint-plugin-better-tailwindcss with the canonical-classes rule as in FoodBridge.
3. Copy Button, FormField, Input, Textarea and the other components I have from the
   shared component repo (github.com/spr-tech/interface-eng-shared-components) into
   src/components/ui/. Ask me before copying if the repo is not reachable.
4. src/styles/tokens.css with the tokens in docs/design/README.md. Verify each value
   against docs/design/ekowatch/source/ first and list any I got wrong. Wire them into
   Tailwind. Apply the density rules in CLAUDE.md ("Viewport and density").
5. src/config/env.ts reading VITE_API_BASE_URL. Fail loudly in development if it is
   missing. No mock toggle.
6. src/services/api.ts: the one createApi, fetchBaseQuery with baseUrl from env.ts,
   endpoints: () => ({}), tagTypes Report, Hazards, Dashboard, Schedule, CurrentUser.
   prepareHeaders adds X-Request-ID (new UUID per request) and the Bearer token from
   the session slice when present.
7. src/app/store.ts, typed hooks, a session slice holding the token in memory only
   (CLAUDE.md "Session"), src/app/providers.tsx.
8. src/types/ekowatch.ts with the four shared enums from CLAUDE.md, exactly as written.
   Leave view types for later; they come from openapi.yaml.
9. src/app/routes.tsx and router.tsx with every route from the CLAUDE.md routes table
   plus "/". Each route renders a placeholder page showing only its h1 and the page
   component name from the table, so I can click through. Role guards are a TODO.
10. A layout with the sidebar (desktop) and tab bar (phone) from the design, the
   signed-in user's name, Sign out, and the banner
   "Demonstration data (simulated) · people and activity are fictional; place names are real".
   Hard-code the role behind one constant for now so I can switch it by hand.
11. src/constants/status.ts mapping each enum value to its on-screen label.
12. package.json scripts: dev, build, lint, typecheck (tsc -b), test (vitest run).

Out of scope: real screens, forms, API endpoints, auth logic, CI workflow.

First, show me your plan: the steps in order, every file you will create, change or
delete with its full path, and any decision I need to make. Wait for my approval.
When you're done, run lint, typecheck, test and build, check the placeholder layout at
1536 × 730 and 390 × 760 at 100% zoom, and tell me the results.
```
