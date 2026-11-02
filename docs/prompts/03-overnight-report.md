# Overnight report: core loop steps 2 to 6

Run: 2026-11-02, about 17:30 to 23:10 UTC (18:30 to 00:10 Lagos). Branch `feat/core-loop-pages`, one commit per step. Nothing was merged, nothing was force-pushed, and no other branch was touched.

## Pull requests

| Branch | Open a pull request | Commits it adds |
| --- | --- | --- |
| `feat/sign-in-polish` | https://github.com/spr-tech/eko-watch-final/compare/main...feat/sign-in-polish | `48d97fc` sign-in polish, on top of `feat/core-loop` (`8a14606`, `425f743`) |
| `feat/core-loop-pages` | https://github.com/spr-tech/eko-watch-final/compare/main...feat/core-loop-pages | `445f387` step 2, `2509bd0` step 5, `b8b92f2` step 3, `90d33a6` step 4, `c18985b` step 6 (plus the three commits above) |

**Read this first:** `feat/core-loop-pages` does not start from bare `main`. `main` has no sign-in, no `openapi.json` and no view types, so nothing could be tested live from it. `git merge` is on the deny list, so before the first commit the branch was moved to the tip of `feat/sign-in-polish`. Until `feat/core-loop` and `feat/sign-in-polish` are merged, the pull request for `feat/core-loop-pages` also lists their three commits. Merge them in order: `feat/core-loop`, then `feat/sign-in-polish`, then `feat/core-loop-pages`.

## What's built, step by step

Every step passed lint (0 errors; the one warning is the existing one in the copied `src/components/ui/textarea.tsx`), typecheck, tests (126 at the end) and build before its commit.

| Step | Commit | What works |
| --- | --- | --- |
| 2. Reports list and detail | `445f387` | `/reports`: chips (All, Flooding, Drains, Missed pickups, Dumping), Current floods only, paging, filters kept in the address; first-use, no-match, loading and error states; read-only for the ward office and operators. `/reports/:reportId`: note, photo or "No photo", flood status and countdown, missed collection day, activity, confirmations. "This report doesn't exist." for a missing report, separate from a failed load. The ward is worked out per role, and the ward name shows in the top bar. |
| 5. Today's streets | `2509bd0` | `/operator/collections`: assigned streets with a collection today (Lagos date), progress ("1 of 3 streets done"), Mark done behind a confirm dialog, Done / Disputed / Missed rows. 200 ("already marked") is told apart from 201. Clear words for 403 `WARD_ASSIGNMENT_REQUIRED` and for a lost reply. Built before steps 3 and 4 so today's Bamboo Street could be marked on its collection day. |
| 3. Report a problem | `b8b92f2` | `/reports/new`: type cards, street (own street first), past collection days for a missed pickup, note with count, optional photo. The photo is uploaded first, then the report is created with an `Idempotency-Key` that belongs to the request body, so a retry reuses the key and photoId. Field errors, "Your report wasn't sent", and "We're not sure your report was sent" (Check my reports / Send again). Lands on the new report with a toast. |
| 4. Confirm | `90d33a6` | On report detail, residents only. The count goes up at once (once per person). It is undone on 400/403/404/409. A lost reply says "We can't tell yet if your confirmation was saved." with Check again. "You can't confirm your own report." for 409. "Confirm it again" on an expired flood. |
| 6. Ward dashboard | `c18985b` | `/authority/dashboard`, last 30 days: missed and disputed pickups apart, Blocked-drain reports, Current flood reports, "Computed today at 23:55", the operator table with missed rate, most-confirmed blocked drains, current floods. Loading, empty and error states. |

## What I tested on the live backend

Headless Chrome through the DevTools protocol, against `http://localhost:4173` (the backend's CORS refuses `127.0.0.1`). The results:

- **Reports (demo1, demo4, demo5):** 9 seeded reports and each chip. With Current floods only there are none, so it shows the careful empty message. Also checked: Clear filters; the report with the very long street name (wraps, no sideways scroll); a missing and a malformed report ID both give "This report doesn't exist."; offline gives the load error and Try again recovers. The ward office and the operator see the list and detail read-only. Signed out on `/reports`, you land on `/login?next=%2Freports`.
- **Today's streets (demo4):** a failed schedule request shows the error and Try again recovers. The list has 3 rows: Bamboo, Canal and Palm. **Write:** Fictional Bamboo Street was marked done for 2 November at 19:14 Lagos time; the toast and "1 of 3 streets done" appeared, and it was still Done after a reload. Canal Street was "marked" once with the request failed inside the browser before it was sent (no write), to check the lost-reply message and focus.
- **Report a problem (demo1):** checked the street-list error, empty-submit errors (focus moves to the type cards), 18 past collection days, and an SVG refused as a photo. **Write 1:** the blocked-drain report on Fictional Palm Street (`e59db4aa-2233-43bb-a5ab-7a1e005b47ad`). The server's first answer (201) was dropped in the browser, the page said "We're not sure your report was sent", and Send again replayed with the same key. The ward went from 9 to 10 reports, so only one was saved. **Write 2 (with photo): not created.** See "Still broken".
- **Confirm:** a lost reply (demo2, seeded report `…0001`, request failed before it was sent, no write) showed "can't tell yet", and Check again restored the true count of 0. **Write:** demo1 confirming its own report got 409, the count went back, and the message showed. **Write:** demo2 confirmed demo1's report: 1 confirmation, "You confirmed this", and the toast.
- **Dashboard (demo5, reads only):** 93 missed, 1 disputed, 4 blocked-drain reports, 0 current floods. Operator table and tonight's report in the drains list. A failed request shows the error and Try again recovers. A resident opening the address gets "You don't have access to this page".
- **Fit:** no sideways scroll on any screen at 1536 × 730, 1366 × 650 and 390 × 760. On every screen the heading and primary action are visible on load. Lists and forms scroll below that, which the viewport rules allow for app screens.

Writes made, all within your list: one report by demo1 (no photo); demo1's one self-confirm (409); demo2's one confirmation; demo4's Bamboo Street for 2 November. Tomorrow's streets were not touched.

## Backend changes found overnight

- **Contract:** none. The live `/v3/api-docs` matched `openapi.json` before every step and at the end (last check 23:03 UTC).
- **Behaviour, for Esther and Adedayo:** `POST /photos` answers **500 `INTERNAL_ERROR`** for a valid 272 KB JPEG, from the app and from plain `curl -F file=@…;type=image/jpeg`. Request IDs: `ba38cbf5-886a-44ca-aca7-8fe93dc1f51b`, `bb49584f-4098-4979-84a4-b3b82d2971c8`, `23a596e5-ac82-4f7b-b20b-24fa70a64be9`.
- `GET /operators/me/streets` for demo8 (no streets) is `200 []`, not 403. The 403 `WARD_ASSIGNMENT_REQUIRED` presumably comes from the PUT, which I couldn't try without a write outside your list.

## Decisions I made on my own

All are in `docs/decisions.md` under "Overnight run", marked "Proposed by Claude Code overnight, Agreed by: pending":

1. `feat/core-loop-pages` starts from the sign-in work, not bare `main` (see above).
2. The "Waste" chip is split into "Missed pickups" and "Dumping", because `GET /reports` takes one `reportType`.
3. The Reports header has no "Newest report: 12 min ago" line (no server timestamp for it).
4. Confirm is on report detail only, not on each list row. Lists over 20 get Previous / Next.
5. Wording for states the design doesn't draw: read-only empty list, no current floods, flood countdown and expiry, operator helper text, unknown enum reply, choosing between several wards.
6. Step 5 built before steps 3 and 4 (Bamboo Street is only scheduled on 2 November).
7. Today's streets details: size-100 schedule query, "Marked done at …", disputed text and link, the already-marked and lost-reply wording.
8. Report a problem: no "Use my location"; a resident without a ward is sent to choose a street; the 30-day collection-day list; the Idempotency-Key tied to the request body; the "remove the photo and send without it" hint.
9. Confirm details: "Confirm it again" on expired floods; the button shows on your own report (no `reportedByMe`) and the 409 explains; which errors undo.
10. Dashboard details: the 30-day range, side lists from `GET /reports`, a warning icon for disputed pickups.
11. Small supporting changes: the shared toast provider at the app root; the base query passes response metadata so 200 and 201 can be told apart.

One `TODO(contract)` is still in the code: `src/types/ekowatch.ts:104`, "is note ever null?"

## Skipped or still broken

- **The photo report wasn't created**, because `POST /photos` returns 500 (above). The form handles it: values kept, "The photo couldn't be uploaded… You can also remove the photo and send the report without it." Once the backend is fixed, demo1 can send the planned dumping report on Fictional Market Street with `public/residents-wading-flood-5.jpg`. I did not substitute a report without the photo.
- 403 `WARD_ASSIGNMENT_REQUIRED` on Mark done: covered by a unit test, not tried live.
- The resident's "My street" (`/collections`), Hazards and the ward setup page are still placeholders; they weren't in steps 2 to 6. A resident with no ward is pointed to `/setup`, which is a placeholder.
- The Bamboo Street mark is for 2 November. By the demo it will be a past day, so demo4's Today's streets will show 3 November's streets (Canal, Mangrove, Palm), all to do.

## What to click through in the browser, in demo order

Run `npm run dev -- --port 4173` and open `http://localhost:4173/login` (port 4173: the backend's CORS allows it). The first request can take up to a minute if the backend is asleep.

1. **Resident 1 reports.** Choose Resident 1 under Demo accounts → Sign in. Reports shows 10 reports. Click a chip, then Current floods only (careful empty message), then Clear filters. Press **Report a problem**: choose Blocked drain, keep Fictional Palm Street, type a note and press Send report. You land on the new report with "Report sent". (This creates a real report; skip the send if you don't want one, and open tonight's report from the list instead: Blocked drain, Fictional Palm Street, "last confirmed …".) On your own report, press Confirm it's still there: "You can't confirm your own report." Sign out.
2. **Resident 2 confirms.** Sign in as Resident 2, open the same report and press Confirm it's still there. The count goes up at once, then "You confirmed this" and "Thanks, your confirmation counts". Back on Reports, the row shows "You confirmed this". Sign out.
3. **Operator marks done.** Sign in as Operator. Today's streets lists 3 November's streets with "0 of 3 streets done". Press Mark done on one, check the dialog's wording, then Cancel (focus returns to the button), or confirm it to see the toast and the progress bar move. Confirming marks a real collection for today. Open Reports from the menu: read-only, no Confirm. Sign out.
4. **Ward office sees it.** Sign in as Ward office. The dashboard shows the four counts (Blocked-drain reports includes tonight's report), the operator table with Fictional Demo 4's done count, and tonight's report in "Most-confirmed blocked-drain reports". Click it: read-only, "The ward office sees confirmations but does not confirm reports."

For each page, try the phone size too (DevTools device toolbar, 390 × 760, 100% zoom).

### Sign-in polish (`feat/sign-in-polish`)

- **45 s timeout:** DevTools → Network → throttling "Offline" after the page loads gives the network alert at once. To see the timeout, add a request-blocking pattern that never answers (or set custom throttling with a very long latency) and press Sign in. "EkoWatch may be waking up…" appears at 5 s; at 45 s the button reads "Sign in" again, the alert says "Can't reach EkoWatch right now. Check your connection, then try again." and both fields are still filled.
- **Demo accounts:** four buttons: Resident 1, Resident 2, Operator, Ward office. "Ward office" stays on one line at 390 px.
- **Pause/Play:** a small round button at the top right of the photo (28 × 28). Tab to it: a yellow focus ring; Enter or Space toggles it, and the label switches between "Pause photo slideshow" and "Play photo slideshow".
- **Tilt:** with a mouse, move the pointer over the sign-in card: it tilts a few degrees towards the pointer and eases back when the pointer leaves. Click into a field: it goes flat. No tilt with reduced motion turned on (DevTools → Rendering → prefers-reduced-motion) or in the device toolbar's touch mode.
- **Phone fit:** device toolbar at 390 × 760, press Sign in with both fields empty: both errors show and the page doesn't scroll. Same at 1536 × 730 and 1366 × 650.
