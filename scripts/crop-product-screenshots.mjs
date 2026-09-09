/**
 * Derives the thirteen files the marketing site ships from the six full-screen
 * captures in `capture/`.
 *
 * Run `capture-product-screenshots.mjs` first.
 *
 * ## Why crops and not thirteen captures
 *
 * Each slot on the site wants a different piece of the product: the full-bleed
 * banners want a whole screen, the feature cards want one widget or one column.
 * Capturing each separately would mean thirteen browser contexts and thirteen
 * chances for the app's own layout to shift between them; cropping one capture
 * keeps every derivative of a screen consistent with the others.
 *
 * ## Why the output sizes are hard-coded
 *
 * They are the dimensions the files already had. The site's slots were tuned
 * against those, and the four `offer_*` previews in particular share a ~1.45
 * aspect so the card row renders at one consistent size — change an output size
 * and the card it sits in starts cropping it at render time.
 *
 * ## Coordinates
 *
 * Regions are expressed in CSS pixels as measured in the running app, then
 * doubled, because the captures are taken at deviceScaleFactor 2. They are
 * recorded here rather than re-measured each run so a capture and a crop can be
 * reasoned about separately — but they are the one thing in this pipeline that
 * will need revisiting if the app's layout changes materially.
 *
 * Run: node scripts/crop-product-screenshots.mjs
 */

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const IN = 'capture';
const OUT = 'public/images/product';

/** deviceScaleFactor the captures were taken at. */
const DSF = 2;
const px = (cssValue) => Math.round(cssValue * DSF);

/** The app's sidebar width in CSS px — every content-only crop starts after it. */
const SIDEBAR = 256;

/**
 * Optional scope, matching capture-product-screenshots.mjs's SCREENS_ONLY: a
 * re-crop of one or two outputs doesn't have to touch (or need the source
 * captures for) the other eleven. `OUTPUTS_ONLY=dashboard-workspace,offer_queue
 * node scripts/crop-product-screenshots.mjs`. Unset, every output below runs,
 * exactly as before.
 */
const only = process.env.OUTPUTS_ONLY?.split(',').map((s) => s.trim());
const skip = (out) => only && !only.includes(out);

await mkdir(OUT, { recursive: true });

/**
 * Crop a region (CSS px) to an exact output size, letting the aspect be driven
 * by the OUTPUT so nothing is squashed: the region's height is recomputed from
 * its width and the target aspect, then the result is resized.
 */
async function region(src, out, { x, y, width }, [outW, outH], label) {
  if (skip(out)) return;
  const image = sharp(`${IN}/${src}.png`);
  const meta = await image.metadata();
  const aspect = outW / outH;

  const left = px(x);
  const top = px(y);
  const w = Math.min(px(width), meta.width - left);
  const h = Math.min(Math.round(w / aspect), meta.height - top);

  await sharp(`${IN}/${src}.png`)
    .extract({ left, top, width: w, height: h })
    .resize(outW, outH, { fit: 'fill' })
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/${out}.png`);
  console.log(`${out}.png`.padEnd(28), `${outW}x${outH}`.padEnd(11), `<- ${label}`);
}

/**
 * Crop a region and keep it at the capture's own resolution.
 *
 * For the tight `offer_*` previews. Resizing those up to the sizes the files
 * used to be (2400-2850px wide) would be a 2.5x upscale of a 1040px crop — all
 * the blur, none of the detail. What the layout needs is the ASPECT, because
 * `ImageCtn` sizes by `max-height` with `object-fit: contain`; the pixel
 * dimensions only have to clear the display size on a retina screen, and a
 * ~1000px file against a ~394px slot clears it two and a half times over.
 */
async function nativeRegion(src, out, { x, y, width }, aspect, label) {
  if (skip(out)) return;
  const image = sharp(`${IN}/${src}.png`);
  const meta = await image.metadata();

  const left = px(x);
  const top = px(y);
  const w = Math.min(px(width), meta.width - left);
  const h = Math.min(Math.round(w / aspect), meta.height - top);

  await sharp(`${IN}/${src}.png`)
    .extract({ left, top, width: w, height: h })
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/${out}.png`);
  console.log(
    `${out}.png`.padEnd(28),
    `${w}x${h}`.padEnd(11),
    `${width} CSS px wide -> ${(394 / width).toFixed(2)}x on screen  <- ${label}`,
  );
}

/**
 * Crop a region (CSS px) at an EXPLICIT width and height, keeping the
 * capture's own resolution like `nativeRegion` — for a source where the
 * shared `OFFER_ASPECT` would either run the crop through a wide table row
 * (blurry at any legible width) or leave dead white space below the last
 * line of real content (a gap that reads as a cut-off frame, same failure
 * mode the `y` comments elsewhere in this file warn about, just on the
 * bottom edge instead of a line of text).
 */
async function exactRegion(src, out, { x, y, width, height }, label) {
  if (skip(out)) return;
  const left = px(x);
  const top = px(y);
  const w = px(width);
  const h = px(height);

  await sharp(`${IN}/${src}.png`)
    .extract({ left, top, width: w, height: h })
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/${out}.png`);
  console.log(
    `${out}.png`.padEnd(28),
    `${w}x${h}`.padEnd(11),
    `${width} CSS px wide -> ${(394 / width).toFixed(2)}x on screen  <- ${label}`,
  );
}

/** Resize a whole capture. Used where the capture's aspect already matches. */
async function whole(src, out, [outW, outH], label) {
  if (skip(out)) return;
  await sharp(`${IN}/${src}.png`)
    .resize(outW, outH, { fit: 'fill' })
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/${out}.png`);
  console.log(`${out}.png`.padEnd(28), `${outW}x${outH}`.padEnd(11), `<- ${label}`);
}

// ── The three full-bleed desktop banners ─────────────────────────────────────
// Their slots use object-fit: cover with object-position: left top, so the
// browser crops to whatever the container is. The capture viewports were chosen
// so these are straight resizes rather than crops.
await whole('dashboard', 'dashboard-workspace', [2600, 1557], "Today's Dashboard, whole");
await whole('patient-chart', 'clinical-workflow', [2600, 1557], 'Dental Chart, whole');
await whole('business-brain', 'business-brain-daily', [2600, 2012], 'Actions, whole');

// ── The three portrait banners, below 768px ──────────────────────────────────
// Content only: the sidebar is dead weight in a portrait frame on a phone.
await region('dashboard', 'workspace_banner_mobile',
  { x: SIDEBAR, y: 0, width: 1022 }, [800, 900], "Today's Dashboard, portrait");
await region('patient-chart', 'clinical_banner_mobile',
  { x: SIDEBAR, y: 0, width: 899 }, [1455, 1862], 'Dental Chart, portrait');
await region('business-brain', 'brain_banner_mobile',
  { x: SIDEBAR, y: 0, width: 1040 }, [800, 1000], 'Actions, portrait');

// ── The two Actions columns ─────────────────────────────────────────────────
// The page is two paired columns — problems left, what to do right — and the
// two cards on the site show one each. Both start at the first card, below the
// health meter, so the pair reads as the same rows side by side.
await region('business-brain', 'brain_attention',
  { x: 256, y: 341, width: 596 }, [1190, 848], 'Actions, "Needs attention" column');
await region('business-brain', 'brain_action',
  { x: 876, y: 341, width: 596 }, [1188, 848], 'Actions, "What to do" column');

// ── The four offer_* previews, all ~1.45 ────────────────────────────────────
//
// THESE MUST BE TIGHT CROPS, and that is the whole design constraint here.
//
// `ImageCtn` caps the preview at `max-height: min(17rem, 100%)`, so it renders
// about 394x272 on screen however large the file is. The scale from crop to slot
// is therefore 394 / (crop width in CSS px) — and the first version of these
// cropped 1364-1650 CSS px of full-width layout into that slot, i.e. 0.24-0.29x,
// which put 14px body text on screen at 3-4px. Unreadable, and it read as
// "zoomed out and stretched".
//
// offer_queue was the one that always worked, because a queue widget is only 392
// CSS px wide: it lands at ~1.0x and its text stays full size. The other three
// now follow that lead — one legible component each, not a whole screen shrunk.
// Every region below prints its own on-screen scale when the script runs; keep
// them at or above ~0.6x.
const OFFER_ASPECT = 759 / 510; // offer_queue's, so the four stay consistent

// y was 468 — that was the Live Queue card's top edge before an "Actions"
// card was added above it in the same column, which pushed Live Queue down
// to y 763 without moving it horizontally (x and width are exactly
// unchanged, confirmed against the running app's own layout). The stale
// coordinate had been quietly cropping the Actions card instead.
await region('dashboard', 'offer_queue',
  { x: 1080, y: 763, width: 392 }, [759, 510], 'Dashboard, Live Queue widget');

// Each `y` below is chosen so the crop's BOTTOM EDGE lands in a gap rather than
// through a row of text. Get that wrong and the preview ends on a half-cut line —
// the frame reads as broken rather than as a detail of a larger screen, which is
// exactly what the first version of these did.

// Patient Profile heading, the header card, and the tab row. Ends in the gap
// before "Treatments" rather than slicing that heading in half.
await nativeRegion('patient-treatments', 'offer_patient',
  { x: 236, y: 44, width: 520 }, OFFER_ASPECT, 'Priya Nair, profile header');

// "Clinical records" shows the Treatments tab now, not the Dental Chart —
// the chart already carries the FinancialFreedom banner below, and repeating
// it here read as the same screenshot twice. The Treatments list is two
// bordered rows (name + date on the left, a status badge and the cost on the
// right, ~1200 CSS px apart), the same wide-row shape `offer_billing` below
// avoids for the same reason: no crop narrow enough to be sharp can hold
// both ends. This keeps the left side — treatment name and date, on both of
// the seeded patient's two treatments — sharp at 0.86x, rather than the
// whole row blurry at ~0.3x.
//
// An explicit height, not `OFFER_ASPECT`: at the aspect's own height the
// crop ran on ~90px past "Added 09 Sep 2026" into blank white — no text cut
// off, but a gap the same size as the failure the other three regions' `y`
// comments are about avoiding, just on the bottom edge instead of a line of
// text. 260 ends right on the second card's own lower border.
await exactRegion('patient-treatments', 'offer_treatments',
  { x: 248, y: 364, width: 460, height: 260 }, "Treatments, Priya Nair's two records");

// The revenue headline, NOT the Remaining Balances list. Those rows put the
// patient name and the amount owed ~1190 CSS px apart, so no crop tight enough to
// be legible can hold both, and a list of names with the amounts sliced off is a
// worse advert for billing than the day's takings in full. From the page top, so
// it ends on the clean upper edge of the Filters card.
await nativeRegion('payments', 'offer_billing',
  { x: 240, y: 0, width: 470 }, OFFER_ASPECT, 'Billing & Payments, revenue');

// ── The Operations banner, under "Less front-desk chaos" ────────────────────
// A whole screen at the same size as the dashboard banner, not a cropped panel.
// The appointments capture is 1.40 wide where the banners are 1.670, so the crop
// takes the top of it — the list runs far past the fold and the rows below add
// nothing a banner can show at this scale.
await region('appointments', 'appointments-workspace',
  { x: 0, y: 0, width: 1680 }, [2600, 1557], 'Appointments, whole');
await region('appointments', 'appointments_banner_mobile',
  { x: SIDEBAR, y: 0, width: 1022 }, [800, 900], 'Appointments, portrait');

console.log('\ndone');
