-- Add separate adult/kid counts while keeping guest_count as total
-- Safe to re-run on an existing project

alter table public.rsvps
  add column if not exists adult_count int not null default 0,
  add column if not exists kid_count int not null default 0;

-- Backfill existing rows: treat prior guest_count as adults
update public.rsvps
set
  adult_count = case when attending = 'yes' then greatest(guest_count, 0) else 0 end,
  kid_count = 0
where adult_count = 0 and kid_count = 0 and guest_count > 0;

alter table public.rsvps drop constraint if exists rsvps_adult_count_check;
alter table public.rsvps add constraint rsvps_adult_count_check check (adult_count between 0 and 4);

alter table public.rsvps drop constraint if exists rsvps_kid_count_check;
alter table public.rsvps add constraint rsvps_kid_count_check check (kid_count between 0 and 4);

alter table public.rsvps drop constraint if exists rsvps_guest_count_check;
alter table public.rsvps add constraint rsvps_guest_count_check check (guest_count between 0 and 8);

alter table public.rsvps drop constraint if exists rsvps_guest_count_matches_parts;
alter table public.rsvps add constraint rsvps_guest_count_matches_parts
  check (guest_count = adult_count + kid_count);
