-- ============================================================
-- SFBD Session Tracker — Packages table & related changes
-- Run this in the Supabase SQL Editor in one go.
-- ============================================================

-- 1. Create the packages table
create table if not exists packages (
  id          uuid        default gen_random_uuid() primary key,
  user_id     uuid        references auth.users(id) on delete cascade not null,
  client_name text        not null,
  total_sessions integer  not null,
  sessions_used  integer  not null default 0,
  total_price numeric     not null,
  paid        boolean     not null default false,
  notes       text        default '',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- 2. Add package_id column to sessions table
alter table sessions
  add column if not exists package_id uuid references packages(id) on delete set null;

-- 3. Auto-update updated_at on packages (reuse trigger function if it exists)
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_packages_updated_at on packages;
create trigger set_packages_updated_at
  before update on packages
  for each row
  execute function update_updated_at_column();

-- 4. Enable RLS on packages
alter table packages enable row level security;

-- 5. RLS policies for packages

-- Admin: full access (select, insert, update, delete)
create policy "Admin full access on packages"
  on packages
  for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

-- Regular users (coaches): read-only access
create policy "Users can view packages"
  on packages
  for select
  using (
    auth.uid() is not null
  );
