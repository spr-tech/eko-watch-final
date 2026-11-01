# EkoWatch

Cleaner streets. Safer roads. One community.

EkoWatch gives one Lagos ward a shared record of its streets: whether waste collection happened, where drains are blocked, and which roads residents report as flooded right now. Residents report and confirm problems, waste operators record each pickup, and the ward office sees it all on one dashboard.

EkoWatch is a community reporting tool. It does not forecast floods, dispatch crews, replace any agency or certify that a road is safe.

Built by Team 1 for the TeSA Africa Cohort 6 capstone, as the side project alongside FoodBridge. This repository is the interface tier; the Java service lives in a separate repository.

> **Demonstration data.** All people, operators and activity are fictional. Place names are real. EkoWatch has no relationship with any Lagos agency or waste operator.

## Live addresses

- Interface: TODO
- Service: TODO

## Demo accounts

TODO: resident, second resident, operator, unassigned operator and authority, matching the backend seed data. Passwords are in the backend README.

## Stack

Vite, React, TypeScript (strict), React Router, Redux Toolkit + RTK Query, Formik + Yup, Tailwind CSS. Deployed to Qocent Deploy through GitHub Actions.

## Setup

```bash
npm ci
cp .env.example .env   # set VITE_API_BASE_URL to the deployed backend
npm run dev
```

Checks (all must pass before a deploy):

```bash
npm run lint
npm run typecheck
npm run build
```

## Hosting terms checked

TODO: Qocent Deploy free-tier terms (idle sleep, hour limits, expiry, project limits), read on the provider's own pricing page, and the date checked.

## Known limitations

- A web page cannot prove a photo was taken on the spot rather than picked from the gallery. Photos are stamped with the time the server received them.
- Location data is removed from stored photos, but a photo may still show identifying details such as a house number.
- "No current flood reports" means nobody has reported one recently, not that roads are safe.
- One ward only.

TODO: the flood freshness window and timezone, how disputed pickups are handled, and anything else simulated or not built.

## Project documents

- `docs/intent/ekowatch.md`: requirements from the capstone brief
- `docs/build.pdf`: the team build plan (names, contract, build order)
- `docs/decisions.md`: dated decisions and who agreed them
- `docs/design/`: screen designs and corrections
- `docs/ai-log.md`: AI-assisted work and how it was checked
