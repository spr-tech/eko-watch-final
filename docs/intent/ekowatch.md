# EkoWatch: requirements

Transcribed from the TeSA Cohort 6 capstone brief, "Four Real-World Products": the side-project standard (page 14), EkoWatch (pages 15 to 16) and the shared fairness rules (page 3). The brief itself is not committed because it contains other participants' contact details.

EkoWatch is Team 1's side project. FoodBridge is the main product. Guide effort: about two thirds FoodBridge, one third EkoWatch.

## Problem

Lagos residents pay for waste collection, yet pickups are often missed and there is no record of whether an operator came, so complaints become arguments without evidence. Flooding is discovered late: forecasts exist, but nothing shows which roads are flooded now. The two problems feed each other, because uncollected refuse ends up in drains and blocked drains make flooding worse.

## Users

- **Residents:** know the collection days, report problems and see flooded roads nearby.
- **Waste operators:** see the streets assigned to them and record each completed pickup.
- **Authorities** (a demonstration role): see missed pickups, blocked drains and flooding for the ward.

## Product goal

One shared, trustworthy picture of one ward's streets: whether collection happened, where drains are blocked and which roads are reported flooded right now. EkoWatch is a community reporting tool. It does not forecast flooding, dispatch crews or replace any agency.

## MVP scope

| Area | In the MVP |
| --- | --- |
| Accounts and roles | Resident, operator, authority. Roles enforced in the service. |
| Ward set-up | A resident picks a seeded ward and street from a list. Dropping a pin on a map is a Should. |
| Collection schedule | Collection days per street. Operators mark a street done. A pickup is missed when a scheduled day has passed with no recorded collection. Computed when read, not set by a timer. |
| Reports | Missed pickup, illegal dumping, blocked drain, flooded road. Each has a type, a street, a photo where possible, a note and the reporter's location where the browser allows it. |
| Confirmations | Another resident can confirm a report. One confirmation per person per report. A report with more confirmations ranks higher. |
| Flood freshness | A flood report is current for a set number of hours, then expired unless someone confirms it again. Computed when read. |
| Flood map or list | A map of current flood and blocked-drain reports, with a list view that works without the map. |
| Authority dashboard | Missed pickups by operator, blocked drains and current floods for the ward, derived from records. |

**Should (not MVP):** in-app alerts for missed pickups, a rain-ready reminder, a hotspot view where blocked drains and floods overlap, pin-drop ward set-up.

**Phase 2 (out of scope):** more wards, commuter route alerts, official forecasts beside community reports, SMS and USSD access, payment for extra pickups.

## Business rules

- A report is never shown with its reporter's name. Location detail is removed from stored photos.
- One confirmation per user per report, enforced by a unique constraint. Two residents confirming at the same moment both count. The same resident confirming twice counts once.
- A scheduled pickup is marked done once per street per day.
- Only an operator assigned to a ward can mark that ward's streets done. Only authorities see operator performance.
- The map and any alerts say how old the newest report is.
- **Design problem with no clean answer:** an operator marks a street done while three residents report it missed. Who is believed? Decide, record it, and state the cost.

## Monday journey and definition of done

- A resident reports a blocked drain, a second resident confirms it, and an authority sees it on the dashboard, all on the deployed service.
- An operator marks a pickup done. A street with a past scheduled day and no record shows as missed.
- Two confirmations at the same moment count twice. The same user confirming twice counts once, with a test that fails when the unique constraint is removed.
- Seed data for one ward: at least eight streets, thirty days of schedule, and operators, residents and reports in every state, including one expired flood report and one disputed pickup.

## Changes the brief made to the original proposal

- **Real data:** real place names only. Operator names, phone numbers and activity are fictional and labelled. Statistics about gaps in the public directory go in the pitch only if cited with a source and date.
- **"Photos taken in the app, not the gallery":** a web page cannot guarantee this. A capture hint on the file input and a server-side timestamp are possible. State it as a known limitation.
- Missed pickups are derived at read time, so no timer is needed and an hour-long outage cannot hide a missed pickup.
- **Scope:** one ward, three roles, four report types. Alerts and the hotspot view move to Should.

## Side-project standard (page 14)

Must have:

- Two live addresses (interface and service), deployed through GitHub Actions with tests and type checking blocking the deploy. Free tiers only.
- An OpenAPI document for the MVP paths, and the interface built against it. A mock server is optional (this project uses none).
- Authentication and role-based authorisation enforced in the service, with one test that calls the service directly with the wrong role and fails when the check is removed.
- One business rule protected in the database, with an automated test that runs the conflicting operations together.
- Five screen states (loading, empty, error, success, confirmation) on the MVP journey, keyboard operable throughout with visible focus, and a layout that works on a phone.
- Seed data containing the awkward cases; a short README with demonstration credentials and anything simulated labelled; an entry in the team's AI log.
- Two decision records, each with a rejected alternative, a named cost and the observation that would reverse the decision.

Not required (do only if time allows after FoodBridge): full load test, screen reader report, Core Web Vitals targets, the five-record decision set, the walkthrough video.

Assessment: reported as meets, partly meets or does not yet meet its MVP definition of done. It is evidence for "Your own contribution" and "Collaboration"; it adds no marks to the 100.

## Shared rules that apply here

- Realistic demonstration data. Never claim a relationship with a real organisation or present simulated activity as real-world impact, in the README, the walkthrough or later portfolio use.
- No payment gateways, delivery integrations, live chat or real identity verification.
- Anything simulated rather than built is labelled beside the feature. A declared stub costs nothing; an undeclared one costs the whole requirement.
- Every engineer must be able to explain any part of the submission, including parts written with AI assistance.
