# Product screenshots

The screenshots on the marketing site are real captures of the OraMedha PMS
(the actual practice-management application — a separate local repository),
taken with Playwright against a real, running instance. Nothing here is a
mockup, an illustration, or hand-built UI.

## Source

- **App**: OraMedha PMS, run locally via `npm run dev:local` (points at a
  local Supabase instance — never the hosted/production project).
- **Data**: the demo clinic at `00000000-0000-0000-0000-000000000001`, signed
  in as `brain@dentgrow.test`. All patients, appointments, treatments and
  payments are disposable local demo data — no real patient information appears
  in any frame. The five non-Actions screens were originally shot against a
  richer **BrightSmile Dental Studio** dataset that was never committed and no
  longer exists locally; the Actions frames were re-shot later against the
  PMS's own committed `supabase/seed.sql` clinic, which is deliberately thin
  (see "The Actions re-shoot" below), and the Dashboard and Dental Chart
  frames were re-shot later still against that same thin clinic, topped up by
  `scripts/capture-data-dashboard-chart.sql` (see "The Dashboard and Dental
  Chart re-shoot" below).
- **"Today"**: the clinic's seeded activity was originally anchored to a
  fixed date. Before capture, that clinic's appointment/treatment/payment/
  queue timestamps were shifted forward (in the local Supabase container
  only) so the app's own "today" — whatever day it's actually run on — lands
  on a populated day rather than an empty one. This is a date shift of
  existing seed data, not fabricated activity.
- **Capture**: Playwright driving real Chromium, `deviceScaleFactor: 2`,
  `Asia/Kolkata`, light theme, one dedicated browser context (and viewport)
  per screen so each screenshot gets the composition suited to it rather
  than a single fixed size stretched everywhere. Fonts, network and a settle
  delay are all awaited before the shot; scrollbars are hidden for capture.

## The six screens captured

| Screen | PMS route | Viewport | Patient/data shown |
|---|---|---|---|
| Today's Dashboard | `/dentist` | 1920×1150 | Full day: 12 appointments, ₹33,800 revenue, a four-patient live queue |
| Actions (Business Brain) | `/dentist/business-brain` | 1680×1300 | Clinic health 69 · 3 "Needs attention" findings paired with 3 "What to do" actions |
| Patient Profile — Treatments | `/dentist/patients/[id]?tab=treatments` | 1600×1100 | Priya Nair — 4 visits, 6 treatments, a real outstanding balance |
| Patient Profile — Dental Chart | `/dentist/patients/[id]?tab=dental-chart` | 1920×1150 | Asha Menon — the local seed's own patient with dental-chart entries, built out to all 32 teeth spanning every tooth status (recommended, planned, in-progress, completed, missing) |
| Billing & Payments | `/dentist/payments` | 1680×1200 | Today's revenue, 10 patients with remaining balances, a real payment ledger |
| Appointments | `/dentist/appointments?filter=today` | 1680×1200 | 32 appointments across dates, doctors and statuses |

## Files and where they're used

All files live in `public/images/product/`.

| File | Derived from | Used by |
|---|---|---|
| `dashboard-workspace.png` | Today's Dashboard (full capture, resized) | `Featured` full-bleed banner |
| `workspace_banner_mobile.png` | Today's Dashboard, portrait crop | `Featured`, below 768px |
| `clinical-workflow.png` | Dental Chart (full capture, resized) | `FinancialFreedom` full-bleed banner |
| `clinical_banner_mobile.png` | Dental Chart, portrait crop | `FinancialFreedom`, below 768px |
| `business-brain-daily.png` | Actions (full capture, resized) | `FinancialFuture` full-bleed banner |
| `brain_banner_mobile.png` | Actions, portrait crop | `FinancialFuture`, below 768px |
| `brain_attention.png` | Actions — the "Needs attention" column | "See what needs attention" card |
| `brain_action.png` | Actions — the "What to do" column | "Know what to do next" card |
| `offer_queue.png` | Today's Dashboard — the Live Queue widget | "Appointments and queue" card |
| `offer_patient.png` | Patient Profile (Priya Nair) — header + treatments | "Patients and history" card |
| `offer_chart.png` | Dental Chart — both arches + legend | "Clinical records" card |
| `offer_billing.png` | Billing & Payments — revenue + remaining balances | "Billing and payments" card |
| `appointments-workspace.png` | Appointments (full capture, resized) | Operations, the full-width banner under "Less front-desk chaos" |
| `appointments_banner_mobile.png` | Appointments, portrait crop | Operations, below 768px |

### Crop aspects

The four `offer_*` previews are cropped to a common ~1.45 aspect, so the set
renders at one consistent size and the cards crop nothing further at render
time. Changing one of them means matching that aspect, or the card it sits in
will start cropping it.

`panel_right.png` is gone. Operations used to carry a cropped slice of the
appointments list at 44rem, which shrank a whole screen to 704px and left its
text at about half size. It now shows `appointments-workspace.png` in exactly the
`Featured` banner's frame — 85rem wide, 35rem tall, `object-position: left top` —
and reuses Featured's `imageVariants` and `RevealCover`, which is what the banner
above it already imports. Verified: both render at 1360×560.

35rem, not FinancialFreedom's 38.4375rem. The crop is anchored top-left, so a
taller frame lengthens the section without showing any more of the screen.

### Descenders and MaskText

Every heading rendered through `MaskText` sits inside a `LineMask`, which is
`overflow: hidden` around the line box. **A `line-height` smaller than the
`font-size` therefore cuts glyphs off rather than merely crowding them.**

Two card titles had `font-size: 2rem` against `line-height: 1.75rem` — 28px of
line box for a 32px glyph — which sheared the descender off every title that had
one: the y in "Billing and payments", the q in "Appointments and queue", the y in
"Patients and history". Both are unitless `1.2` now. Keep any MaskText heading at
or above ~1.15.

### The `offer_*` previews must be TIGHT crops

`ImageCtn` caps these at `max-height: min(17rem, 100%)`, so each renders at about
**394×272 on screen** no matter how large the file is. The scale from crop to slot
is therefore:

```
on-screen scale = 394 / (crop width in CSS px)
```

That single number decides whether the preview is readable. A round of these
cropped 1364–1650 CSS px of full-width layout into that slot — 0.24–0.29×, which
put 14px body text on screen at 3–4px. It looked zoomed-out and washed, and no
amount of extra output resolution helps, because the limit is the slot.

`offer_queue` was always the readable one: a queue widget is only 392 CSS px
wide, so it lands at ~1.0× and its text stays full size. The other three now
follow it — **one legible component each, never a whole screen shrunk**. Keep new
crops at or above ~0.6×; the crop script prints each one's scale when it runs.

The corollary is that these four are stored at their **capture resolution** rather
than resized up to a fixed width. Upscaling a 1040px crop to 2650px would add
blur and no detail; what the layout needs from these files is the aspect, and
~1000px against a ~394px slot is already two and a half times retina.

Operations previously also carried a figures tile and a navigation tile
(`panel_left.png`, `panel_centre.png`) as a supporting pair under the schedule.
Both were dropped — they repeated what the section's own copy says — and their
files removed.

The three full-bleed desktop banners (`dashboard-workspace.png`,
`clinical-workflow.png`, `business-brain-daily.png`) are used as-is: their
slots use `object-fit: cover` with `object-position: left top`, so the
browser does the cropping to whatever the container's actual size is — no
second copy is stored. Every other file is a deliberate manual crop of its
source capture, sized for the slot it fills.

## Reproducing them

Both steps are committed, which they were not for the previous round — that set
was shot by hand, so "re-shoot the screenshots" was an undocumented job:

```bash
node scripts/capture-product-screenshots.mjs   # six full screens  -> capture/
node scripts/crop-product-screenshots.mjs      # thirteen shipped  -> public/images/product/
```

Re-shooting one or two screens doesn't have to touch (or log in for) the
other four — both scripts accept a scope, keyed by their own `name`/`out`
values:

```bash
SCREENS_ONLY=dashboard,patient-chart node scripts/capture-product-screenshots.mjs
OUTPUTS_ONLY=dashboard-workspace,clinical-workflow,workspace_banner_mobile,clinical_banner_mobile,offer_queue,offer_chart \
  node scripts/crop-product-screenshots.mjs
```

`capture/` is gitignored: it is large, and everything in it is reproducible.

The crop script hard-codes each output size, because those are the sizes the
site's slots were tuned against — the four `offer_*` previews in particular share
a ~1.45 aspect so the card row renders at one consistent size. It also hard-codes
each region in CSS pixels, and that is the one part of the pipeline that needs
revisiting if the app's layout changes materially.

## The Dashboard and Dental Chart re-shoot

Both screens were re-captured on their own, against the current UI and the
PMS's own thin committed `supabase/seed.sql` clinic — the richer BrightSmile
dataset both were originally shot against no longer exists locally (see
"Source" above), and by this round `patient-chart`'s old `match: 'Rohan'`
named a patient that dataset held and this one never did, so the capture
script had been silently skipping that screen (`! could not find a patient
matching "Rohan" - skipped`) for however long the data had been gone. Fixed
in the script to match Asha Menon, the one local-seed patient with any
dental-chart entries at all — three teeth, nowhere near enough to
photograph.

Both screens also needed more data than the base seed carries to be worth
shooting: two appointments is a near-empty dashboard, and three teeth is
mostly a blank arch. `scripts/capture-data-dashboard-chart.sql` — a
companion to `capture-data.sql`, not a replacement; the two shape the same
clinic for opposite purposes and are never applied together — adds nine more
patients and ten more appointments spread across today's hours (most
completed, a few checked in), a treatment and a same-day payment for every
completed one (₹33,800 total — "Revenue: Today" reads from payments, not
from a completed treatment's own cost, which a completed-but-unpaid
treatment already in the base seed proved by contributing nothing), and
rebuilds Asha's chart to all 32 adult teeth spanning every status the
chart's own legend defines.

The appointment times are the one non-obvious part of that file: they're
stored as the intended DISPLAY hour minus 5:30, not the display hour
itself, because the base seed's own two appointments (Priya, Imran) turn
out to already work that way — `10:00+00` displays as `15:30` IST, not
`10:00`. Storing the intended hour directly, as a first pass of the file
did, landed six new appointments' stored UTC value in that hour instead,
which round-tripped through the same display conversion to between 5:30pm
and 9:30pm — past the clinic's actual closing time, reading as a clinic
open half the night.

Apply it after `capture-data.sql` if both happen to be needed (they won't
be, for the same shoot), or on its own against the base seed:

```bash
docker exec -i supabase_db_dentgrow psql -U postgres -d postgres < scripts/capture-data-dashboard-chart.sql
```

Re-run any time "today" needs to be current again — every row it owns is
deleted and rebuilt, so it's safe to apply repeatedly.

## The Actions re-shoot

The Actions screen was re-captured on its own after the rest of the set. The
shipped `brain_action.png` showed nothing but "Book Appointment" buttons, which
undersold what the right-hand column does — it also offers "Contact Patients"
and "Create Follow-up", inline, depending on what the finding is. The old
capture could not show that: the cards carrying those buttons sat below the
1300px frame's bottom edge.

Two things about that re-shoot are worth recording, because both cost time:

- **The richer BrightSmile dataset no longer exists locally.** That data was
  never committed — `supabase/seed.sql` in the PMS seeds a deliberately *thin*
  clinic so the Business Brain has something to complain about, and its numbers
  are extreme enough to read badly on a marketing page ("15 hr of chair time
  went unused today", "0% of next week's chair time is booked"). The demo clinic
  is now shaped by `scripts/capture-data.sql` in THIS repo, which is applied
  before capturing and is documented at length in the file itself. Read that
  header before touching the data: four different thresholds have to hold
  simultaneously for the Actions screen to show anything worth photographing,
  and one of them (`minimumDailyAppointments`) is calibrated per clinic from the
  slots offered today, so shortening the day to cut idle hours also moves the
  bar the day's bookings are measured against.
- **A stale `.next` cache renders the whole app unstyled.** A long-running dev
  server started 404ing its own JS chunks, and Playwright happily captured the
  result: correct content, no CSS at all, every link default-blue. The capture
  scripts wait for `networkidle` and for fonts, neither of which catches this.
  If a frame comes back looking like a bare HTML document, delete `.next` in the
  PMS repo and restart the dev server.

The frames now report a small practice having a quiet day: 4 hr of idle chair
time against ₹1,27,000 of planned treatment that five patients never booked a
return visit for, and a week ahead 20% booked. Every figure is still the
briefing's own output; the SQL only changes what it is reading.

`offer_chart.png` was re-cropped in the same pass. It opened exactly on the
"Dental Chart" heading and sliced the tops of the letters — a broken frame
rather than a detail of a screen. It now starts 26px above the heading, ends in
the gap below the status legend instead of running on into dead grey, and sits
at 0.60x rather than 0.57x.

Only the four Actions-derived files were regenerated
(`business-brain-daily.png`, `brain_banner_mobile.png`, `brain_attention.png`,
`brain_action.png`); the other nine came back byte-identical from their
untouched captures. Every crop region in `crop-product-screenshots.mjs` still
applies unchanged — the app's Actions layout has not moved.

## The full-set round before that

Recaptured against the app's new brand mark: every prior frame showed the retired
tooth-and-arrow logo in the sidebar.

Two data facts had to be right before the captures were worth keeping. Both are
easy to miss and both quietly degrade the result rather than failing loudly:

- The demo clinic's activity is shifted forward so the app's own "today" lands on
  the densest seeded day (24 appointments) rather than a near-empty one.
  **`queue_entries.queue_date` is a column in its own right, not derived from
  `checked_in_at`**, so it has to be shifted too — miss it and the dashboard's
  Live Queue renders "Queue is empty" while the database plainly has patients
  waiting, which is exactly what happened on the first pass here.
- The Next.js dev-tools bubble sits bottom-left and is the one thing in these
  frames that is not the product. The capture script hides it.

The frames also now show work that landed alongside the brand change: the Actions
screen states severity in words rather than colour alone, carries a
forward-looking "Next week is filling up slowly" finding, and labels ownership
"Delegate".

## The round before that one

The prior set was captured against DentGrow-branded seed data and covered three
screens (dashboard, clinical workflow, business brain). It was replaced by a
round that recaptured against OraMedha branding and added three screens the site
had no real coverage for — patient history, billing & payments, and a dedicated
appointments list. No DentGrow-branded screenshot remains anywhere in the repo.
