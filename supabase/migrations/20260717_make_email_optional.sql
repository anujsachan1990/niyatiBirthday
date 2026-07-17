-- Allow RSVPs without an email address
alter table public.rsvps
  alter column email drop not null;
