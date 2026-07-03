create extension if not exists pgcrypto;

create table if not exists public.rsvp_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 80),
  message text not null check (char_length(trim(message)) between 1 and 700),
  status text not null check (status in ('Hadir', 'Tidak Hadir', 'Masih Ragu')),
  created_at timestamptz not null default now()
);

alter table public.rsvp_messages enable row level security;

drop policy if exists "Anyone can read RSVP messages" on public.rsvp_messages;
create policy "Anyone can read RSVP messages"
on public.rsvp_messages
for select
to anon
using (true);

drop policy if exists "Anyone can create RSVP messages" on public.rsvp_messages;
create policy "Anyone can create RSVP messages"
on public.rsvp_messages
for insert
to anon
with check (
  char_length(trim(name)) between 1 and 80
  and char_length(trim(message)) between 1 and 700
  and status in ('Hadir', 'Tidak Hadir', 'Masih Ragu')
);

create index if not exists rsvp_messages_created_at_idx
on public.rsvp_messages (created_at desc);

create table if not exists public.gift_transfers (
  id uuid primary key default gen_random_uuid(),
  sender_name text not null check (char_length(trim(sender_name)) between 1 and 80),
  amount integer not null check (amount > 0),
  proof_bucket text not null default 'gift-proofs',
  proof_path text not null check (char_length(trim(proof_path)) between 1 and 300),
  proof_file_name text not null check (char_length(trim(proof_file_name)) between 1 and 180),
  proof_mime_type text not null check (proof_mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  guest_name text,
  created_at timestamptz not null default now()
);

alter table public.gift_transfers enable row level security;

drop policy if exists "Anyone can create gift transfers" on public.gift_transfers;
create policy "Anyone can create gift transfers"
on public.gift_transfers
for insert
to anon
with check (
  char_length(trim(sender_name)) between 1 and 80
  and amount > 0
  and proof_bucket = 'gift-proofs'
  and char_length(trim(proof_path)) between 1 and 300
  and char_length(trim(proof_file_name)) between 1 and 180
  and proof_mime_type in ('image/jpeg', 'image/png', 'image/webp')
);

drop policy if exists "Authenticated users can read gift transfers" on public.gift_transfers;
create policy "Authenticated users can read gift transfers"
on public.gift_transfers
for select
to authenticated
using (true);

create index if not exists gift_transfers_created_at_idx
on public.gift_transfers (created_at desc);

create table if not exists public.invited_guests (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null check (char_length(trim(guest_name)) between 1 and 120),
  whatsapp_number text not null check (whatsapp_number ~ '^[0-9]{8,20}$'),
  invitation_link text not null check (char_length(trim(invitation_link)) between 1 and 300),
  message_template text not null check (char_length(trim(message_template)) between 1 and 1600),
  invited_at timestamptz not null default now()
);

alter table public.invited_guests enable row level security;

create unique index if not exists invited_guests_whatsapp_number_idx
on public.invited_guests (whatsapp_number);

create index if not exists invited_guests_invited_at_idx
on public.invited_guests (invited_at desc);

drop function if exists public.record_invited_guest(text, text, text, text, text);

create function public.record_invited_guest(
  export_secret text,
  p_guest_name text,
  p_whatsapp_number text,
  p_invitation_link text,
  p_message_template text
)
returns table (
  id uuid,
  guest_name text,
  whatsapp_number text,
  invitation_link text,
  invited_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if export_secret is distinct from 'anggi dan hamid' then
    raise exception 'Invalid export secret';
  end if;

  return query
  insert into public.invited_guests (
    guest_name,
    whatsapp_number,
    invitation_link,
    message_template,
    invited_at
  )
  values (
    trim(p_guest_name),
    trim(p_whatsapp_number),
    trim(p_invitation_link),
    trim(p_message_template),
    now()
  )
  on conflict (whatsapp_number) do update
  set
    guest_name = excluded.guest_name,
    invitation_link = excluded.invitation_link,
    message_template = excluded.message_template,
    invited_at = now()
  returning
    invited_guests.id,
    invited_guests.guest_name,
    invited_guests.whatsapp_number,
    invited_guests.invitation_link,
    invited_guests.invited_at;
end;
$$;

drop function if exists public.export_invited_guests(text);

create function public.export_invited_guests(export_secret text)
returns table (
  id uuid,
  guest_name text,
  whatsapp_number text,
  invitation_link text,
  invited_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if export_secret is distinct from 'anggi dan hamid' then
    raise exception 'Invalid export secret';
  end if;

  return query
  select
    invited_guests.id,
    invited_guests.guest_name,
    invited_guests.whatsapp_number,
    invited_guests.invitation_link,
    invited_guests.invited_at
  from public.invited_guests
  order by invited_guests.invited_at desc;
end;
$$;

drop function if exists public.clear_invited_guests(text);

create function public.clear_invited_guests(export_secret text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if export_secret is distinct from 'anggi dan hamid' then
    raise exception 'Invalid export secret';
  end if;

  delete from public.invited_guests;
end;
$$;

revoke all on function public.record_invited_guest(text, text, text, text, text) from public;
grant execute on function public.record_invited_guest(text, text, text, text, text) to anon;

revoke all on function public.export_invited_guests(text) from public;
grant execute on function public.export_invited_guests(text) to anon;

revoke all on function public.clear_invited_guests(text) from public;
grant execute on function public.clear_invited_guests(text) to anon;

drop function if exists public.export_gift_transfers(text);

create function public.export_gift_transfers(export_secret text)
returns table (
  id uuid,
  sender_name text,
  amount integer,
  proof_bucket text,
  proof_path text,
  proof_file_name text,
  proof_mime_type text,
  guest_name text,
  rsvp_status text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if export_secret is distinct from 'anggi dan hamid' then
    raise exception 'Invalid export secret';
  end if;

  return query
  select
    gt.id,
    gt.sender_name,
    gt.amount,
    gt.proof_bucket,
    gt.proof_path,
    gt.proof_file_name,
    gt.proof_mime_type,
    gt.guest_name,
    coalesce(rm.status, 'Tidak Jawab') as rsvp_status,
    gt.created_at
  from public.gift_transfers gt
  left join lateral (
    select rsvp.status
    from public.rsvp_messages rsvp
    where lower(trim(rsvp.name)) = lower(
      trim(
        coalesce(
          nullif(nullif(gt.guest_name, ''), 'Tamu Undangan'),
          gt.sender_name
        )
      )
    )
    order by rsvp.created_at desc
    limit 1
  ) rm on true
  order by gt.created_at desc;
end;
$$;

revoke all on function public.export_gift_transfers(text) from public;
grant execute on function public.export_gift_transfers(text) to anon;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gift-proofs',
  'gift-proofs',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can upload gift proof images" on storage.objects;
create policy "Anyone can upload gift proof images"
on storage.objects
for insert
to anon
with check (bucket_id = 'gift-proofs');

drop policy if exists "Anyone can read gift proof images for export" on storage.objects;
create policy "Anyone can read gift proof images for export"
on storage.objects
for select
to anon
using (bucket_id = 'gift-proofs');
