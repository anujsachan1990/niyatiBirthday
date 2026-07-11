-- Niyati Birthday RSVP table
-- Run this in Supabase → SQL Editor

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  attending text not null check (attending in ('yes', 'no')),
  guest_count int not null default 1 check (guest_count between 0 and 6),
  message text
);

create index if not exists rsvps_created_at_idx on public.rsvps (created_at desc);
create index if not exists rsvps_attending_idx on public.rsvps (attending);

alter table public.rsvps enable row level security;

-- Guests can submit RSVPs (no login required)
create policy "Public can submit RSVP"
  on public.rsvps for insert
  to anon, authenticated
  with check (true);

-- Only logged-in admins can read responses
create policy "Authenticated users can view RSVPs"
  on public.rsvps for select
  to authenticated
  using (true);

-- Optional: restrict reads to your email only (uncomment and edit)
-- drop policy "Authenticated users can view RSVPs" on public.rsvps;
-- create policy "Admin email can view RSVPs"
--   on public.rsvps for select
--   to authenticated
--   using ((select auth.jwt() ->> 'email') = 'you@example.com');
