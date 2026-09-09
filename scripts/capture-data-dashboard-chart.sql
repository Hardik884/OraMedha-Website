-- Shapes the local PMS demo clinic for the Today's Dashboard and Dental Chart
-- recaptures. Companion to capture-data.sql, which shapes the same clinic
-- for the Actions screen instead — the two are not meant to be applied
-- together, since capture-data.sql's thin single-chair day is deliberately
-- the opposite of what a full dashboard wants to show.
--
-- Run against the LOCAL Supabase container only, never a hosted project:
--
--   docker exec -i supabase_db_dentgrow psql -U postgres -d postgres < scripts/capture-data-dashboard-chart.sql
--
-- Re-running is safe: every row this file owns is deleted and rebuilt first.
--
-- ## Why this file exists
--
-- The committed supabase/seed.sql seeds four patients and two appointments
-- for "today" — enough for the app to function, not enough for a dashboard
-- screenshot: the Live Queue would show two people and the day's schedule
-- would read as nearly empty. It also gives only one patient (Asha Menon)
-- any dental-chart entries at all, and only three teeth's worth — nowhere
-- near enough to show what a populated chart looks like. The richer dataset
-- the original captures used (a "BrightSmile Dental Studio" clinic) was never
-- committed and no longer exists locally (see PRODUCT_SCREENSHOTS.md), so
-- this rebuilds an equivalent, disposable local shape rather than trying to
-- recover it.
--
-- Everything here is ordinary demo activity for a clinic that does not exist.
--
-- ## What it does
--
--   1. Adds nine more patients and ten more appointments spread across
--      today's 09:00-17:00 hours, so the dashboard shows a real day's worth
--      of bookings rather than two.
--   2. Adds two more checked-in patients to the Live Queue, on top of the
--      two the base seed already has.
--   3. Rebuilds Asha Menon's dental chart to all 32 adult teeth, spanning
--      every status the chart's legend defines (normal, recommended,
--      planned, in progress, completed, missing) rather than three teeth
--      that would render as an almost-blank arch.

begin;

-- ── More patients for today's schedule ───────────────────────────────────────
-- Registered months ago so none of them trips a "new patient today" flag.
delete from patients
 where clinic_id = '00000000-0000-0000-0000-000000000001'
   and id::text like 'c0000000-0000-4000-8000-%';

insert into patients (id, clinic_id, name, phone, created_at, last_visit, total_visits)
values
  ('c0000000-0000-4000-8000-000000000001', '00000000-0000-0000-0000-000000000001', 'Kavya Reddy',     '9990000101', now() - interval '260 days', now() - interval '35 days', 4),
  ('c0000000-0000-4000-8000-000000000002', '00000000-0000-0000-0000-000000000001', 'Arjun Deshmukh',  '9990000102', now() - interval '240 days', now() - interval '48 days', 3),
  ('c0000000-0000-4000-8000-000000000003', '00000000-0000-0000-0000-000000000001', 'Meera Iyer',      '9990000103', now() - interval '190 days', now() - interval '26 days', 2),
  ('c0000000-0000-4000-8000-000000000004', '00000000-0000-0000-0000-000000000001', 'Sanjay Gupta',    '9990000104', now() - interval '310 days', now() - interval '12 days', 6),
  ('c0000000-0000-4000-8000-000000000005', '00000000-0000-0000-0000-000000000001', 'Neha Kulkarni',   '9990000105', now() - interval '150 days', now() - interval '9 days',  3),
  ('c0000000-0000-4000-8000-000000000006', '00000000-0000-0000-0000-000000000001', 'Vikram Rao',      '9990000106', now() - interval '420 days', now() - interval '7 days',  5),
  ('c0000000-0000-4000-8000-000000000007', '00000000-0000-0000-0000-000000000001', 'Divya Pillai',    '9990000107', now() - interval '175 days', now() - interval '18 days', 3),
  ('c0000000-0000-4000-8000-000000000008', '00000000-0000-0000-0000-000000000001', 'Rohit Bhatia',    '9990000108', now() - interval '205 days', now() - interval '22 days', 2),
  ('c0000000-0000-4000-8000-000000000009', '00000000-0000-0000-0000-000000000001', 'Ananya Krishnan', '9990000109', now() - interval '130 days', now() - interval '15 days', 2);

-- ── Today's schedule ──────────────────────────────────────────────────────────
-- The base seed's two appointments (Priya 10:00, Imran 11:00) are left as they
-- are. These fill in the rest of the day around them: a morning and afternoon
-- of mostly-completed visits, plus two checked-in patients late in the day so
-- the Live Queue has more than the base seed's two.
delete from appointments
 where clinic_id = '00000000-0000-0000-0000-000000000001'
   and id::text like 'c1000000-0000-4000-8000-%';

-- Times are stored so that displaying them BACK in Asia/Kolkata (what the
-- app's UI does) lands within the clinic's actual 09:00-17:00 hours: the
-- stored value is the display time minus 5:30, the same relationship the
-- base seed's own Priya (10:00+00 -> displays 15:30 IST) and Imran (11:00+00
-- -> displays 16:30 IST) already have. Storing the intended DISPLAY hour
-- directly here, as the first version of this file did, landed the new
-- appointments' UTC value in the intended hour instead — six of them then
-- displayed between 5:30pm and 9:30pm, past closing and reading as a
-- clinic open half the night.
insert into appointments (id, clinic_id, patient_id, dentist_id, scheduled_at, duration_minutes, source, status, created_at)
values
  ('c1000000-0000-4000-8000-000000000001', '00000000-0000-0000-0000-000000000001', 'c0000000-0000-4000-8000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', (((now() at time zone 'Asia/Kolkata')::date + time '09:00') at time zone 'UTC') - interval '5:30', 30, 'walk_in',    'completed', now() - interval '1 day'),
  ('c1000000-0000-4000-8000-000000000002', '00000000-0000-0000-0000-000000000001', 'c0000000-0000-4000-8000-000000000002', 'bbbbbbbb-0000-0000-0000-000000000001', (((now() at time zone 'Asia/Kolkata')::date + time '09:30') at time zone 'UTC') - interval '5:30', 30, 'phone_call', 'completed', now() - interval '1 day'),
  ('c1000000-0000-4000-8000-000000000003', '00000000-0000-0000-0000-000000000001', 'c0000000-0000-4000-8000-000000000003', 'bbbbbbbb-0000-0000-0000-000000000001', (((now() at time zone 'Asia/Kolkata')::date + time '10:00') at time zone 'UTC') - interval '5:30', 30, 'walk_in',    'completed', now() - interval '2 days'),
  ('c1000000-0000-4000-8000-000000000004', '00000000-0000-0000-0000-000000000001', 'c0000000-0000-4000-8000-000000000004', 'bbbbbbbb-0000-0000-0000-000000000001', (((now() at time zone 'Asia/Kolkata')::date + time '10:30') at time zone 'UTC') - interval '5:30', 45, 'referral',   'completed', now() - interval '3 days'),
  ('c1000000-0000-4000-8000-000000000005', '00000000-0000-0000-0000-000000000001', 'c0000000-0000-4000-8000-000000000005', 'bbbbbbbb-0000-0000-0000-000000000001', (((now() at time zone 'Asia/Kolkata')::date + time '11:30') at time zone 'UTC') - interval '5:30', 30, 'walk_in',    'completed', now() - interval '1 day'),
  ('c1000000-0000-4000-8000-000000000006', '00000000-0000-0000-0000-000000000001', 'c0000000-0000-4000-8000-000000000006', 'bbbbbbbb-0000-0000-0000-000000000001', (((now() at time zone 'Asia/Kolkata')::date + time '12:00') at time zone 'UTC') - interval '5:30', 30, 'walk_in',    'completed', now() - interval '4 days'),
  ('c1000000-0000-4000-8000-000000000007', '00000000-0000-0000-0000-000000000001', 'c0000000-0000-4000-8000-000000000007', 'bbbbbbbb-0000-0000-0000-000000000001', (((now() at time zone 'Asia/Kolkata')::date + time '13:00') at time zone 'UTC') - interval '5:30', 30, 'phone_call', 'completed', now() - interval '2 days'),
  ('c1000000-0000-4000-8000-000000000008', '00000000-0000-0000-0000-000000000001', 'c0000000-0000-4000-8000-000000000008', 'bbbbbbbb-0000-0000-0000-000000000001', (((now() at time zone 'Asia/Kolkata')::date + time '13:30') at time zone 'UTC') - interval '5:30', 30, 'walk_in',    'completed', now() - interval '5 days'),
  ('c1000000-0000-4000-8000-000000000009', '00000000-0000-0000-0000-000000000001', 'c0000000-0000-4000-8000-000000000009', 'bbbbbbbb-0000-0000-0000-000000000001', (((now() at time zone 'Asia/Kolkata')::date + time '15:00') at time zone 'UTC') - interval '5:30', 30, 'walk_in',    'checked_in', now() - interval '1 day'),
  ('c1000000-0000-4000-8000-00000000000a', '00000000-0000-0000-0000-000000000001', 'c0000000-0000-4000-8000-000000000007', 'aaaaaaaa-0000-0000-0000-000000000001', (((now() at time zone 'Asia/Kolkata')::date + time '16:00') at time zone 'UTC') - interval '5:30', 30, 'website',    'checked_in', now() - interval '6 hours');

-- ── Real revenue for today ────────────────────────────────────────────────────
-- "Revenue: Today" reads from payments, not from a completed treatment's own
-- cost — Priya's existing completed treatment (Section 5's seed) already
-- proved that: completed with a real cost, zero contribution to revenue,
-- because nothing had ever been paid against it. Every completed visit above
-- gets a treatment and a same-day payment in full; Priya's gets a payment
-- too, for the same reason.
delete from treatments
 where clinic_id = '00000000-0000-0000-0000-000000000001'
   and id::text like 'c2000000-0000-4000-8000-%';

insert into treatments (id, clinic_id, appointment_id, patient_id, treatment_type, cost, status, performed_at)
values
  ('c2000000-0000-4000-8000-000000000001', '00000000-0000-0000-0000-000000000001', 'c1000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001', 'Scaling',      1500, 'completed', (((now() at time zone 'Asia/Kolkata')::date + time '09:00') at time zone 'UTC') - interval '5:30'),
  ('c2000000-0000-4000-8000-000000000002', '00000000-0000-0000-0000-000000000001', 'c1000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000002', 'Filling',      2500, 'completed', (((now() at time zone 'Asia/Kolkata')::date + time '09:30') at time zone 'UTC') - interval '5:30'),
  ('c2000000-0000-4000-8000-000000000003', '00000000-0000-0000-0000-000000000001', 'c1000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000003', 'Consultation',  500, 'completed', (((now() at time zone 'Asia/Kolkata')::date + time '10:00') at time zone 'UTC') - interval '5:30'),
  ('c2000000-0000-4000-8000-000000000004', '00000000-0000-0000-0000-000000000001', 'c1000000-0000-4000-8000-000000000004', 'c0000000-0000-4000-8000-000000000004', 'Extraction',   2000, 'completed', (((now() at time zone 'Asia/Kolkata')::date + time '10:30') at time zone 'UTC') - interval '5:30'),
  ('c2000000-0000-4000-8000-000000000005', '00000000-0000-0000-0000-000000000001', 'c1000000-0000-4000-8000-000000000005', 'c0000000-0000-4000-8000-000000000005', 'Cleaning',     1800, 'completed', (((now() at time zone 'Asia/Kolkata')::date + time '11:30') at time zone 'UTC') - interval '5:30'),
  ('c2000000-0000-4000-8000-000000000006', '00000000-0000-0000-0000-000000000001', 'c1000000-0000-4000-8000-000000000006', 'c0000000-0000-4000-8000-000000000006', 'Teeth Whitening', 6000, 'completed', (((now() at time zone 'Asia/Kolkata')::date + time '12:00') at time zone 'UTC') - interval '5:30'),
  ('c2000000-0000-4000-8000-000000000007', '00000000-0000-0000-0000-000000000001', 'c1000000-0000-4000-8000-000000000007', 'c0000000-0000-4000-8000-000000000007', 'Root Canal',  12000, 'completed', (((now() at time zone 'Asia/Kolkata')::date + time '13:00') at time zone 'UTC') - interval '5:30'),
  ('c2000000-0000-4000-8000-000000000008', '00000000-0000-0000-0000-000000000001', 'c1000000-0000-4000-8000-000000000008', 'c0000000-0000-4000-8000-000000000008', 'Filling',      2500, 'completed', (((now() at time zone 'Asia/Kolkata')::date + time '13:30') at time zone 'UTC') - interval '5:30');

delete from payments
 where clinic_id = '00000000-0000-0000-0000-000000000001'
   and id::text like 'c3000000-0000-4000-8000-%';

insert into payments (id, clinic_id, patient_id, appointment_id, treatment_id, amount, method, payment_date, payment_type)
values
  ('c3000000-0000-4000-8000-000000000000', '00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000003', 'b1000000-0000-4000-8000-000000000001', 'b2000000-0000-4000-8000-000000000001', 9000,  'upi',           (now() at time zone 'Asia/Kolkata')::date, 'treatment'),
  ('c3000000-0000-4000-8000-000000000001', '00000000-0000-0000-0000-000000000001', 'c0000000-0000-4000-8000-000000000001', 'c1000000-0000-4000-8000-000000000001', 'c2000000-0000-4000-8000-000000000001', 1500,  'cash',          (now() at time zone 'Asia/Kolkata')::date, 'treatment'),
  ('c3000000-0000-4000-8000-000000000002', '00000000-0000-0000-0000-000000000001', 'c0000000-0000-4000-8000-000000000002', 'c1000000-0000-4000-8000-000000000002', 'c2000000-0000-4000-8000-000000000002', 2500,  'upi',           (now() at time zone 'Asia/Kolkata')::date, 'treatment'),
  ('c3000000-0000-4000-8000-000000000003', '00000000-0000-0000-0000-000000000001', 'c0000000-0000-4000-8000-000000000003', 'c1000000-0000-4000-8000-000000000003', 'c2000000-0000-4000-8000-000000000003', 500,   'cash',          (now() at time zone 'Asia/Kolkata')::date, 'treatment'),
  ('c3000000-0000-4000-8000-000000000004', '00000000-0000-0000-0000-000000000001', 'c0000000-0000-4000-8000-000000000004', 'c1000000-0000-4000-8000-000000000004', 'c2000000-0000-4000-8000-000000000004', 2000,  'card',          (now() at time zone 'Asia/Kolkata')::date, 'treatment'),
  ('c3000000-0000-4000-8000-000000000005', '00000000-0000-0000-0000-000000000001', 'c0000000-0000-4000-8000-000000000005', 'c1000000-0000-4000-8000-000000000005', 'c2000000-0000-4000-8000-000000000005', 1800,  'upi',           (now() at time zone 'Asia/Kolkata')::date, 'treatment'),
  ('c3000000-0000-4000-8000-000000000006', '00000000-0000-0000-0000-000000000001', 'c0000000-0000-4000-8000-000000000006', 'c1000000-0000-4000-8000-000000000006', 'c2000000-0000-4000-8000-000000000006', 6000,  'card',          (now() at time zone 'Asia/Kolkata')::date, 'treatment'),
  ('c3000000-0000-4000-8000-000000000007', '00000000-0000-0000-0000-000000000001', 'c0000000-0000-4000-8000-000000000007', 'c1000000-0000-4000-8000-000000000007', 'c2000000-0000-4000-8000-000000000007', 8000,  'bank_transfer', (now() at time zone 'Asia/Kolkata')::date, 'treatment'),
  ('c3000000-0000-4000-8000-000000000008', '00000000-0000-0000-0000-000000000001', 'c0000000-0000-4000-8000-000000000008', 'c1000000-0000-4000-8000-000000000008', 'c2000000-0000-4000-8000-000000000008', 2500,  'upi',           (now() at time zone 'Asia/Kolkata')::date, 'treatment');

-- ── The Live Queue, topped up ─────────────────────────────────────────────────
-- The base seed's two entries (Priya, Imran) are left as they are. These add
-- the two new checked-in patients above so the widget shows four waiting
-- rather than two.
delete from queue_entries
 where appointment_id in (
   'c1000000-0000-4000-8000-000000000009',
   'c1000000-0000-4000-8000-00000000000a'
 );

insert into queue_entries (clinic_id, appointment_id, patient_id, position, status, checked_in_at, queue_date)
values
  ('00000000-0000-0000-0000-000000000001', 'c1000000-0000-4000-8000-000000000009', 'c0000000-0000-4000-8000-000000000009', 3, 'waiting', now() - interval '18 minutes', (now() at time zone 'Asia/Kolkata')::date),
  ('00000000-0000-0000-0000-000000000001', 'c1000000-0000-4000-8000-00000000000a', 'c0000000-0000-4000-8000-000000000007', 4, 'waiting', now() - interval '6 minutes',  (now() at time zone 'Asia/Kolkata')::date);

-- ── Asha Menon's dental chart, rebuilt to all 32 adult teeth ─────────────────
-- Spans every status the chart's own legend defines: most teeth are normal,
-- a few carry caries recommended or planned for treatment, two are mid- or
-- fully-treated, and two are missing — a chart worth photographing rather
-- than three isolated entries on an otherwise-blank arch.
delete from patient_teeth
 where patient_id = 'b0000000-0000-4000-8000-000000000001';

insert into patient_teeth (clinic_id, patient_id, dentition_type, tooth_number, status, tooth_condition, treatment_stage)
values
  -- Upper right (18-11)
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 18, 'missing',     'missing_extracted', null),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 17, 'completed',   'crown',             'completed'),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 16, 'recommended', 'caries',            'recommended'),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 15, 'normal',      'normal',            null),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 14, 'planned',     'caries',            'planned'),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 13, 'normal',      'normal',            null),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 12, 'normal',      'normal',            null),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 11, 'normal',      'normal',            null),
  -- Upper left (21-28)
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 21, 'normal',      'normal',            null),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 22, 'normal',      'normal',            null),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 23, 'normal',      'normal',            null),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 24, 'planned',     'caries',            'planned'),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 25, 'normal',      'normal',            null),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 26, 'recommended', 'caries',            'recommended'),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 27, 'completed',   'restored_filled',   'completed'),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 28, 'normal',      'normal',            null),
  -- Lower left (31-38)
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 31, 'normal',      'normal',            null),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 32, 'normal',      'normal',            null),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 33, 'normal',      'normal',            null),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 34, 'normal',      'normal',            null),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 35, 'in_progress', 'fractured',         'in_progress'),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 36, 'recommended', 'caries',            'recommended'),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 37, 'normal',      'normal',            null),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 38, 'normal',      'normal',            null),
  -- Lower right (41-48)
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 41, 'normal',      'normal',            null),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 42, 'normal',      'normal',            null),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 43, 'normal',      'normal',            null),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 44, 'planned',     'caries',            'planned'),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 45, 'in_progress', 'caries',            'in_progress'),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 46, 'normal',      'normal',            null),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 47, 'completed',   'root_canal_treated','completed'),
  ('00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'adult', 48, 'missing',     'missing_extracted', null);

commit;

-- What the shaped clinic should now report.
select
  (select count(*) from patients where clinic_id = '00000000-0000-0000-0000-000000000001')                              as patients,
  (select count(*) from appointments where clinic_id = '00000000-0000-0000-0000-000000000001' and deleted_at is null
     and (scheduled_at at time zone 'Asia/Kolkata')::date = (now() at time zone 'Asia/Kolkata')::date)                  as appts_today,
  (select count(*) from queue_entries where clinic_id = '00000000-0000-0000-0000-000000000001'
     and queue_date = (now() at time zone 'Asia/Kolkata')::date)                                                        as in_queue,
  (select count(*) from patient_teeth where patient_id = 'b0000000-0000-4000-8000-000000000001')                        as asha_teeth;
