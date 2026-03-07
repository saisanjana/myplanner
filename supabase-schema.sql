-- ============================================================
-- MY PLANNER — Supabase Schema
-- Run this entire file once in:
-- Supabase Dashboard → SQL Editor → New query → Paste → Run
-- ============================================================

-- 1. HABITS
-- Repeating daily tasks (same every day)
create table if not exists habits (
  id          uuid primary key default gen_random_uuid(),
  text        text not null,
  "order"     integer not null default 0,
  created_at  timestamptz not null default now()
);

-- 2. HABIT COMPLETIONS
-- Tracks whether a habit was done on a specific day
create table if not exists habit_done (
  id          uuid primary key default gen_random_uuid(),
  habit_id    uuid not null references habits(id) on delete cascade,
  date        date not null,
  done        boolean not null default false,
  -- Each habit can only have one record per day
  unique(habit_id, date)
);

-- 3. TODOS
-- General tasks with a specific date; undone ones carry forward
create table if not exists todos (
  id           uuid primary key default gen_random_uuid(),
  text         text not null,
  date         date not null,
  done         boolean not null default false,
  done_at      timestamptz,
  carried_from date,           -- original date if this was carried forward
  "order"      integer not null default 0,
  created_at   timestamptz not null default now()
);

-- Index for fast daily lookups and carry-forward query
create index if not exists todos_date_idx on todos(date);
create index if not exists todos_done_date_idx on todos(done, date);

-- 4. LISTS
-- Custom lists (shopping, cooking ideas, work notes, etc.)
create table if not exists lists (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  icon        text not null default '📋',
  color       text not null default '#3b82f6',
  "order"     integer not null default 0,
  created_at  timestamptz not null default now()
);

-- 5. LIST ITEMS
-- Items belonging to a custom list
create table if not exists list_items (
  id          uuid primary key default gen_random_uuid(),
  list_id     uuid not null references lists(id) on delete cascade,
  text        text not null,
  done        boolean not null default false,
  done_at     timestamptz,
  "order"     integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Index for fast list item lookups
create index if not exists list_items_list_id_idx on list_items(list_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- Since this is a personal single-user app, we allow all
-- operations without auth. Safe for personal use only.
-- ============================================================

alter table habits     enable row level security;
alter table habit_done enable row level security;
alter table todos      enable row level security;
alter table lists      enable row level security;
alter table list_items enable row level security;

-- Allow all operations for the anonymous key
create policy "allow all habits"     on habits     for all using (true) with check (true);
create policy "allow all habit_done" on habit_done for all using (true) with check (true);
create policy "allow all todos"      on todos      for all using (true) with check (true);
create policy "allow all lists"      on lists      for all using (true) with check (true);
create policy "allow all list_items" on list_items for all using (true) with check (true);

-- ============================================================
-- Done! Your database is ready.
-- ============================================================
