-- Guest invite tracker (admin planning list)
-- Applied via Supabase migration create_guest_invites

create table if not exists public.guest_invites (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  family_unit text not null default '',
  people text not null default '',
  adults int not null default 0 check (adults >= 0),
  kids int not null default 0 check (kids >= 0),
  invited boolean not null default false,
  rsvp_status text not null default 'Pending' check (rsvp_status in ('Pending', 'Attending', 'Declined')),
  notes text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists guest_invites_sort_order_idx on public.guest_invites (sort_order);
create index if not exists guest_invites_category_idx on public.guest_invites (category);

alter table public.guest_invites enable row level security;

create policy "Authenticated users can view guest invites"
  on public.guest_invites for select
  to authenticated
  using (true);

create policy "Authenticated users can insert guest invites"
  on public.guest_invites for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update guest invites"
  on public.guest_invites for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete guest invites"
  on public.guest_invites for delete
  to authenticated
  using (true);
