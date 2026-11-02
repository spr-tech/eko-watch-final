# EkoWatch design

Source: the "EkoWatch screens" design, https://claude.ai/artifact/2MCYTdUcLnTAVSVzSQrsJE

`ekowatch/source/` holds one file per screen. Each file contains every state of that screen: default, loading, empty, error and the special cases. Read the HTML for exact colours, spacing and wording; the files do not run on their own. Desktop boards are drawn at 1536 × 730, phone boards at 390 × 844.

## Screens and routes

The route labels on the design canvas (`/my-street`, `/profile`, `/operator`, `/authority`) are wrong. Use the routes in this table and in `CLAUDE.md`; they match the build plan and the backend.

| Design file | Route | Page component | States in the file |
| --- | --- | --- | --- |
| `Main.dc.html` | `/` | `LandingPage` | default |
| `SignIn.dc.html` | `/login` | `LoginPage` | default, field errors, wrong credentials, can't reach service |
| `Reports.dc.html` | `/reports` | `ReportListPage` | default, loading, first-use empty, filter empty, error, session ended |
| `ReportNew.dc.html` | `/reports/new` | `CreateReportPage` | default, loading, empty (no street chosen), error, send failed, outcome unknown |
| `ReportDetail.dc.html` | `/reports/:reportId` | `ReportDetailPage` | default, loading, no confirmations yet, error, unconfirmed save, own report refused |
| `Hazards.dc.html` | `/hazards` | `HazardsPage` | list, map, map unavailable, loading, empty, error |
| `MyStreet.dc.html` | `/collections` | `CollectionSchedulePage` | default, loading, no street chosen, error |
| `Profile.dc.html` | `/setup` | `WardSetupPage` | default, loading, empty, error, saved |
| `Operator.dc.html` | `/operator/collections` | `OperatorCollectionsPage` | default, loading, nothing assigned today, error, already done |
| `Authority.dc.html` | `/authority/dashboard` | `AuthorityDashboardPage` | default, loading, empty, error |
| `NoAccess.dc.html` | any route the role can't open | shared 403 view | default |

The "session ended" view is drawn on Reports but applies to every signed-in screen.

## Logo

The full logo set is in `docs/design/brand/`. These copies are wired into the app:

| File | Use |
| --- | --- |
| `src/assets/ekowatch-logo-horizontal-on-dark.svg` | Icon plus wordmark on the blue header and sidebar |
| `src/assets/ekowatch-logo-horizontal-on-light.svg` | Icon plus wordmark on white or light surfaces |
| `src/assets/ekowatch-icon.svg` | Icon only, on dark backgrounds (collapsed sidebar, phone top bar). The bubble is white, so it disappears on light backgrounds. |
| `public/favicon.svg` | Browser tab icon (navy tile, visible in light and dark browser themes) |
| `public/favicon-32.png`, `public/apple-touch-icon.png` | Fallback tab icon and phone home-screen icon |

Use the SVG files, not the small PNG embedded in the design. The wordmark is already drawn as shapes inside the horizontal logos, so it does not depend on Nunito loading. When the logo is a link, give the link `aria-label="EkoWatch home"` and the image `alt=""`.

## Tokens taken from the design

- Font: Nunito (400, 600, 700, 800), fallback `system-ui, sans-serif`.
- Text `#0B1D2E`, muted text `#4A5A6B`, page background `#F4F7FA`, surface `#FFFFFF`, border `#CBD5E1`.
- Primary (lagoon blue) `#1A5FA8`, light primary background `#E3EEF9`.
- Success `#1E6B3A` on `#E3F5EA`. Warning `#7A4A00` on `#FDF0D5`. Danger `#B71C1C`.
- Focus ring: 3px solid `#1A5FA8`, 2px offset.

Check these against the source files before using them.

## Corrections that win over the design

Build these instead of what the design shows.

1. **Ward name.** The design shows "Yaba ward (placeholder)" in the landing header, the landing footer, the sidebar and several page headers. Never show the word "placeholder" and never hard-code a ward name.
   - Signed-in screens: show the ward name from the API (`WardView.wardName` for the user's `wardId`, from `listWards`). While it loads, show nothing in that spot, not a guess.
   - Landing page: remove the ward name from the header. `GET /wards` needs a signed-in user, so a signed-out visitor can't load it. In the footer and body copy, say "one Lagos ward" instead.
   - Report it to me if a signed-in user has no `wardId`.
2. **Routes.** Use the table above, not the canvas labels.
3. **Ward dashboard, empty state.** Use "No missed pickups or reports in this ward." Reports are never opened or closed in the MVP, so never say "open reports".
4. **Report detail, error state.** Split the design's one message into two:
   - 404 `RESOURCE_NOT_FOUND`: "This report doesn't exist." with Back to reports.
   - Network or server error: "We couldn't load this report. Check your connection, then try again." with Try again.
   Never say a report "may have been removed"; nothing deletes reports.
5. **Photos on the landing and sign-in pages.** The design has a photo slot with "[LOCATION]" and "[PHOTO CREDIT]". Do not ship those words. The photos in `public/` are for the capstone demo only, with sources and credits pending (see `docs/decisions.md`, 2026-11-02). Show no caption until a photo's credit is confirmed.
6. **Operators and Reports.** The design hides Reports from operators. We decided the opposite (see `docs/decisions.md`): operators get **Reports** in their sidebar and tab bar, after Today's streets and before Hazards. They see the list and report details read-only: no Confirm button, no "Report a problem" link or button, and no "You confirmed this" state. Reuse the ward office's read-only layout. `NoAccess.dc.html` stays the pattern for any page a role can't open, but its example (an operator refused Reports) no longer applies.
7. **"You reported this".** Only build it if `reportedByMe` is added to `ReportView`. The current design does not show it.
8. **Fit.** The boards are drawn at 1536 × 730, but that doesn't prove the content fits. Check each screen against the viewport rules in `CLAUDE.md` and report anything that needs scrolling.
