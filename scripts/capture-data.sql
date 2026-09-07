-- Shapes the local PMS demo clinic into the day the Actions frames show.
--
-- Run against the LOCAL Supabase container only, never a hosted project:
--
--   docker exec -i supabase_db_dentgrow psql -U postgres -d postgres < scripts/capture-data.sql
--
-- Re-running is safe: every row this file owns is deleted and rebuilt, so the
-- clinic lands in the same state whenever it is applied.
--
-- ## Why this file exists
--
-- The PMS's own `supabase/seed.sql` seeds a deliberately extreme clinic: two
-- appointments against sixteen open chair-hours, and nothing at all booked
-- ahead. The briefing reports that accurately as "15 hr of chair time went
-- unused today" and "0% of next week's chair time is booked" — both true, and
-- both reading as a dead practice on a marketing page. This shapes the same
-- demo clinic into a believable small practice having a quiet day.
--
-- Everything here is ordinary demo activity for a clinic that does not exist.
-- The briefing still derives every number itself; this only changes what it is
-- deriving them from.
--
-- ## The thresholds this file is threading, all at once
--
-- Four numbers in business-brain/engines/signals/config/signal-thresholds.ts
-- decide whether the frames show anything worth photographing. Change the data
-- without re-reading these and findings silently vanish:
--
--   minimumChairUtilization  50%  "Your chair sat idle" is SILENT at or above
--                                 this. Idle hours and the finding pull in
--                                 opposite directions — you cannot show a small
--                                 idle figure by booking a big day, because the
--                                 finding then disappears. The only way to have
--                                 both is a SMALLER day.
--   minimumDailyAppointments      Below this, "low appointment volume" fires,
--                                 and the merged "idle chair + unbooked
--                                 treatment" card REQUIRES that signal (see the
--                                 demand-supply-mismatch matcher) or the pair
--                                 splits into two thinner cards. THE GLOBAL 5 IS
--                                 NOT THE NUMBER IN PLAY: calibration.ts sizes
--                                 this per clinic at 30% OF THE SLOTS OFFERED
--                                 TODAY, so shortening the day to cut idle hours
--                                 also lowers this bar, and bookings that were
--                                 under it a moment ago are suddenly over it.
--                                 This is the trap that cost the most time here.
--   minimumWeekAheadBooked   40%  Below this, "next week is filling up slowly"
--                                 fires. Measured over the NEXT 7 DAYS, not the
--                                 next calendar week.
--   acceptedUnscheduledLimit 5    Planned-treatment ROWS, not patients.
--
-- The arithmetic below, and all three have to hold at once. One chair,
-- 09:00-14:00 = 5 open chair-hours = 10 offered slots:
--
--   low appointment volume  2 booked < 3 (30% of 10 slots)          fires
--   low chair utilization   1 hr booked / 5 hr open = 20% < 50%     fires
--   idle time shown         5 hr open - 1 hr booked = 4 hr
--
-- Two bookings is the ceiling, not a choice: a third clears the calibrated
-- volume bar and the merged card disappears. Making the day longer to fit more
-- bookings raises idle hours right back up, which is the whole squeeze.
--
-- ## Who must NOT have a future appointment
--
-- "N patients with planned treatment have no next visit booked" counts distinct
-- patients holding a `planned` treatment with no appointment after now()
-- (actions/treatments.ts, getPatientsWithPlannedTreatmentNoVisit). The five
-- planned-treatment patients therefore get no forward bookings, and the week
-- ahead is filled by entirely separate patients. Mixing the two silently drops
-- the count the right-hand card exists to show.
--
-- ## Timestamps are built in Asia/Kolkata
--
-- `date_trunc('day', now()) + interval '9 hours'` looks like 09:00 and is not:
-- now() is a timestamptz in UTC, so that lands at 14:30 IST — outside opening
-- hours, where it counts as neither booked nor idle. Every time below is built
-- as `(date + time) at time zone 'Asia/Kolkata'`, which is the clinic's own
-- configured timezone.

begin;

-- ── One chair, 09:00-14:00 ───────────────────────────────────────────────────
update clinic_settings
   set chair_count = 1
 where clinic_id = '00000000-0000-0000-0000-000000000001';

delete from availability_rules
 where clinic_id = '00000000-0000-0000-0000-000000000001';

insert into availability_rules (clinic_id, day_of_week, start_time, end_time, slot_duration_minutes)
select '00000000-0000-0000-0000-000000000001', d, '09:00', '14:00', 30
from generate_series(1, 5) as d;

-- ── Reset everything this file owns ──────────────────────────────────────────
-- Treatments before appointments: treatments.appointment_id is NOT NULL.
delete from treatments   where id::text like 'b2000000-0000-4000-8000-0000000000%' and id::text > 'b2000000-0000-4000-8000-000000000003';
delete from queue_entries  where appointment_id::text like 'b11%' or appointment_id::text like 'b12%';
delete from appointments where id::text like 'b11%' or id::text like 'b12%' or id::text like 'b13%';
delete from patients     where clinic_id = '00000000-0000-0000-0000-000000000001'
                           and id::text > 'b0000000-0000-4000-8000-000000000004';

-- ── Patients ─────────────────────────────────────────────────────────────────
-- Registered months ago, so none of them lands in "new patients today" and
-- flips the acquisition finding. Every one has a phone number: the "Contact
-- Patients" button only renders when the send list is actually reachable.
--
-- 05-07 hold planned treatment nobody booked a return visit for. 08-11 and
-- 21-26 fill the week ahead. The two sets never overlap, per the header.
insert into patients (id, clinic_id, name, phone, created_at, last_visit, total_visits)
values
  ('b0000000-0000-4000-8000-000000000005', '00000000-0000-0000-0000-000000000001', 'Kavya Reddy',      '9990000005', now() - interval '260 days', now() - interval '35 days', 4),
  ('b0000000-0000-4000-8000-000000000006', '00000000-0000-0000-0000-000000000001', 'Arjun Deshmukh',   '9990000006', now() - interval '240 days', now() - interval '48 days', 3),
  ('b0000000-0000-4000-8000-000000000007', '00000000-0000-0000-0000-000000000001', 'Meera Iyer',       '9990000007', now() - interval '190 days', now() - interval '26 days', 2),
  ('b0000000-0000-4000-8000-000000000008', '00000000-0000-0000-0000-000000000001', 'Sanjay Gupta',     '9990000008', now() - interval '310 days', now() - interval '12 days', 6),
  ('b0000000-0000-4000-8000-000000000009', '00000000-0000-0000-0000-000000000001', 'Neha Kulkarni',    '9990000009', now() - interval '150 days', now() - interval '9 days',  3),
  ('b0000000-0000-4000-8000-000000000021', '00000000-0000-0000-0000-000000000001', 'Vikram Rao',       '9990000010', now() - interval '420 days', now() - interval '7 days',  5),
  ('b0000000-0000-4000-8000-000000000022', '00000000-0000-0000-0000-000000000001', 'Divya Pillai',     '9990000011', now() - interval '175 days', now() - interval '18 days', 3),
  ('b0000000-0000-4000-8000-000000000023', '00000000-0000-0000-0000-000000000001', 'Rohit Bhatia',     '9990000012', now() - interval '205 days', now() - interval '22 days', 2),
  ('b0000000-0000-4000-8000-000000000024', '00000000-0000-0000-0000-000000000001', 'Ananya Krishnan',  '9990000013', now() - interval '130 days', now() - interval '15 days', 2),
  ('b0000000-0000-4000-8000-000000000025', '00000000-0000-0000-0000-000000000001', 'Farhan Qureshi',   '9990000014', now() - interval '290 days', now() - interval '31 days', 4),
  ('b0000000-0000-4000-8000-000000000026', '00000000-0000-0000-0000-000000000001', 'Lakshmi Subraman', '9990000015', now() - interval '165 days', now() - interval '11 days', 3);

-- ── Today: two half-hour bookings, both early ────────────────────────────────
-- Priya (10:00) and Imran (11:00) come from the seed and keep the completed
-- work and the waiting queue that the revenue and queue findings read. Their
-- rows are moved onto IST here rather than re-inserted.
--
-- Early on purpose: a booking still ahead of now() would count as a "next
-- visit" for Priya and Imran, who are two of the five the planned-treatment
-- card is counting. Capture after ~11:30 IST.
--
-- Two and only two, per the arithmetic in the header — a third booking today
-- silently costs the merged card.
update appointments
   set scheduled_at = ((now() at time zone 'Asia/Kolkata')::date + time '10:00') at time zone 'Asia/Kolkata'
 where id = 'b1000000-0000-4000-8000-000000000001';
update appointments
   set scheduled_at = ((now() at time zone 'Asia/Kolkata')::date + time '11:00') at time zone 'Asia/Kolkata'
 where id = 'b1000000-0000-4000-8000-000000000002';

-- ── The week ahead: ten bookings over the next 7 days ────────────────────────
-- The signal measures the NEXT 7 DAYS, so these start tomorrow rather than on
-- Monday. Ten half-hour visits (5 hours) against the weekdays in that window
-- leaves the week visibly thin without reading as an abandoned practice, and
-- one visit per patient keeps it plausible.
insert into appointments (id, clinic_id, patient_id, dentist_id, scheduled_at, duration_minutes, source, status, created_at)
select
  v.id::uuid,
  '00000000-0000-0000-0000-000000000001',
  v.patient_id::uuid,
  'bbbbbbbb-0000-0000-0000-000000000001',
  (((now() at time zone 'Asia/Kolkata')::date + v.day_offset) + v.at::time) at time zone 'Asia/Kolkata',
  30,
  'walk_in',
  'scheduled',
  now() - interval '1 day'
from (values
  ('b1100000-0000-4000-8000-000000000001', 1, '09:30', 'b0000000-0000-4000-8000-000000000008'),
  ('b1100000-0000-4000-8000-000000000002', 1, '11:00', 'b0000000-0000-4000-8000-000000000009'),
  ('b1100000-0000-4000-8000-000000000003', 2, '10:00', 'b0000000-0000-4000-8000-000000000021'),
  ('b1100000-0000-4000-8000-000000000004', 2, '12:00', 'b0000000-0000-4000-8000-000000000022'),
  ('b1100000-0000-4000-8000-000000000005', 3, '09:00', 'b0000000-0000-4000-8000-000000000023'),
  ('b1100000-0000-4000-8000-000000000006', 3, '12:30', 'b0000000-0000-4000-8000-000000000024'),
  ('b1100000-0000-4000-8000-000000000007', 4, '10:30', 'b0000000-0000-4000-8000-000000000025'),
  ('b1100000-0000-4000-8000-000000000008', 4, '11:00', 'b0000000-0000-4000-8000-000000000026'),
  ('b1100000-0000-4000-8000-000000000009', 7, '09:30', 'b0000000-0000-4000-8000-000000000022'),
  ('b1100000-0000-4000-8000-00000000000a', 7, '11:30', 'b0000000-0000-4000-8000-000000000023')
) as v(id, day_offset, at, patient_id)
-- Weekends are closed, so a booking landing there is not "booked chair time"
-- against any open hours and would only dilute the percentage.
where extract(isodow from ((now() at time zone 'Asia/Kolkata')::date + v.day_offset)) between 1 and 5;

-- ── Planned treatment nobody booked a return visit for ───────────────────────
-- Priya and Imran already hold one each from the seed; these three bring the
-- distinct patient count to five.
--
-- `treatments.appointment_id` is NOT NULL, so each planned treatment needs the
-- visit it was written up at. Weeks in the past, which is the honest shape of
-- the finding: the patient came in, work was planned, nobody booked them back.
insert into appointments (id, clinic_id, patient_id, dentist_id, scheduled_at, duration_minutes, source, status, created_at)
values
  ('b1200000-0000-4000-8000-000000000001', '00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000005', 'bbbbbbbb-0000-0000-0000-000000000001', (((now() at time zone 'Asia/Kolkata')::date - 35) + time '10:00') at time zone 'Asia/Kolkata', 30, 'walk_in',  'completed', now() - interval '40 days'),
  ('b1200000-0000-4000-8000-000000000002', '00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000006', 'bbbbbbbb-0000-0000-0000-000000000001', (((now() at time zone 'Asia/Kolkata')::date - 48) + time '14:00') at time zone 'Asia/Kolkata', 30, 'referral', 'completed', now() - interval '52 days'),
  ('b1200000-0000-4000-8000-000000000003', '00000000-0000-0000-0000-000000000001', 'b0000000-0000-4000-8000-000000000007', 'bbbbbbbb-0000-0000-0000-000000000001', (((now() at time zone 'Asia/Kolkata')::date - 26) + time '11:00') at time zone 'Asia/Kolkata', 30, 'walk_in',  'completed', now() - interval '30 days');

insert into treatments (id, clinic_id, appointment_id, patient_id, treatment_type, cost, status, performed_at)
values
  ('b2000000-0000-4000-8000-000000000004', '00000000-0000-0000-0000-000000000001', 'b1200000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000005', 'Crown',      18000, 'planned', null),
  ('b2000000-0000-4000-8000-000000000005', '00000000-0000-0000-0000-000000000001', 'b1200000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000006', 'Root Canal', 12000, 'planned', null),
  ('b2000000-0000-4000-8000-000000000006', '00000000-0000-0000-0000-000000000001', 'b1200000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000007', 'Bridge',     26000, 'planned', null),
  -- A SIXTH row, on a patient who already has one. The acceptance signal counts
  -- planned treatment ROWS and needs strictly more than acceptedUnscheduledLimit
  -- (5) to fire; at exactly five it stays silent, the treatment_acceptance
  -- constraint never appears, and the merged card silently splits back into two.
  -- The card itself reports DISTINCT PATIENTS (getReminderSummaries), so this
  -- row moves the signal without moving the five the card shows.
  ('b2000000-0000-4000-8000-000000000007', '00000000-0000-0000-0000-000000000001', 'b1200000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000005', 'Scaling',     4000, 'planned', null);

-- ── The queue, re-timed to now ─────────────────────────────────────────────
-- checked_in_at is seeded relative to seed time, so an hours-old database
-- reports an average wait of several hours. Re-pointing it at now() keeps the
-- waiting-time line honest for a clinic that opened this morning.
update queue_entries
   set checked_in_at = now() - interval '25 minutes', queue_date = (now() at time zone 'Asia/Kolkata')::date
 where id = 'b3000000-0000-4000-8000-000000000001';
update queue_entries
   set checked_in_at = now() - interval '10 minutes', queue_date = (now() at time zone 'Asia/Kolkata')::date
 where id = 'b3000000-0000-4000-8000-000000000002';

commit;

-- What the shaped clinic should now report.
select
  (select count(*) from patients where clinic_id = '00000000-0000-0000-0000-000000000001')                            as patients,
  (select count(*) from appointments where clinic_id = '00000000-0000-0000-0000-000000000001' and deleted_at is null
     and (scheduled_at at time zone 'Asia/Kolkata')::date = (now() at time zone 'Asia/Kolkata')::date)                as appts_today,
  (select count(*) from appointments where clinic_id = '00000000-0000-0000-0000-000000000001' and deleted_at is null
     and scheduled_at > now() and scheduled_at < now() + interval '7 days')                                           as appts_next_7d,
  (select count(distinct t.patient_id) from treatments t
    where t.clinic_id = '00000000-0000-0000-0000-000000000001' and t.status = 'planned' and t.deleted_at is null
      and not exists (select 1 from appointments a
                       where a.patient_id = t.patient_id and a.deleted_at is null and a.scheduled_at > now()
                         and a.status in ('scheduled','checked_in','in_progress','completed')))                       as planned_no_next_visit,
  (select coalesce(sum(cost), 0) from treatments
    where clinic_id = '00000000-0000-0000-0000-000000000001' and status = 'planned' and deleted_at is null)           as planned_value;
