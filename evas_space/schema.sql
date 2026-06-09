-- ===========================================================================
-- Eva's Space - Supabase schema (deployed)
-- ===========================================================================
-- This file is the canonical, portable copy of the live schema. It has already
-- been applied to the project as tracked migrations. Re-running it is safe
-- (idempotent) and is useful for spinning up a fresh project.
--
-- Backend contract:
--   1. Supabase Auth, one Eva account, public sign-ups disabled.
--   2. A PUBLIC Storage bucket named "eva-media".
--   3. Public read of published entries; Eva-only writes (RLS).
--   4. Structured data first: ingredients/steps are rows, espresso has a
--      generated brew_ratio, and analysis views sit on top.
-- ===========================================================================

create or replace function public.set_updated_at()
returns trigger language plpgsql
set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------------------
-- recipes (cooked food)
-- ---------------------------------------------------------------------------
create table if not exists public.recipes (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null default auth.uid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  title        text not null,
  slug         text unique not null,
  category     text not null default 'cooked food',
  mood         text,
  intro        text,
  entry_date   date,
  cover_url    text,
  published    boolean not null default false,
  servings     text,
  prep_time    text,
  cook_time    text,
  rating       smallint check (rating between 1 and 5)
);

drop trigger if exists trg_recipes_updated_at on public.recipes;
create trigger trg_recipes_updated_at
  before update on public.recipes
  for each row execute function public.set_updated_at();

create index if not exists idx_recipes_published_date on public.recipes(published, entry_date desc);
create index if not exists idx_recipes_owner on public.recipes(owner_id);

alter table public.recipes enable row level security;

drop policy if exists "public read published recipes" on public.recipes;
create policy "public read published recipes"
  on public.recipes for select using (published = true);
drop policy if exists "owner read recipes" on public.recipes;
create policy "owner read recipes"
  on public.recipes for select to authenticated using (owner_id = auth.uid());
drop policy if exists "owner insert recipes" on public.recipes;
create policy "owner insert recipes"
  on public.recipes for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists "owner update recipes" on public.recipes;
create policy "owner update recipes"
  on public.recipes for update to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "owner delete recipes" on public.recipes;
create policy "owner delete recipes"
  on public.recipes for delete to authenticated using (owner_id = auth.uid());

-- Structured ingredients (rows, not blobs).
create table if not exists public.recipe_ingredients (
  id          uuid primary key default gen_random_uuid(),
  recipe_id   uuid not null references public.recipes(id) on delete cascade,
  position    integer not null default 0,
  name        text not null,
  amount      text,
  unit        text,
  category    text,
  note        text
);

create index if not exists idx_recipe_ingredients_recipe_position on public.recipe_ingredients(recipe_id, position);
create index if not exists idx_recipe_ingredients_name on public.recipe_ingredients(lower(name));
create index if not exists idx_recipe_ingredients_category on public.recipe_ingredients(lower(category));

alter table public.recipe_ingredients enable row level security;

drop policy if exists "public read published ingredients" on public.recipe_ingredients;
create policy "public read published ingredients"
  on public.recipe_ingredients for select using (
    exists (select 1 from public.recipes r where r.id = recipe_ingredients.recipe_id and r.published = true));
drop policy if exists "owner all ingredients" on public.recipe_ingredients;
create policy "owner all ingredients"
  on public.recipe_ingredients for all to authenticated
  using (exists (select 1 from public.recipes r where r.id = recipe_ingredients.recipe_id and r.owner_id = auth.uid()))
  with check (exists (select 1 from public.recipes r where r.id = recipe_ingredients.recipe_id and r.owner_id = auth.uid()));

-- Ordered method steps (rows, not a blob).
create table if not exists public.recipe_steps (
  id          uuid primary key default gen_random_uuid(),
  recipe_id   uuid not null references public.recipes(id) on delete cascade,
  position    integer not null default 0,
  instruction text not null
);

create index if not exists idx_recipe_steps_recipe_position on public.recipe_steps(recipe_id, position);

alter table public.recipe_steps enable row level security;

drop policy if exists "public read published steps" on public.recipe_steps;
create policy "public read published steps"
  on public.recipe_steps for select using (
    exists (select 1 from public.recipes r where r.id = recipe_steps.recipe_id and r.published = true));
drop policy if exists "owner all steps" on public.recipe_steps;
create policy "owner all steps"
  on public.recipe_steps for all to authenticated
  using (exists (select 1 from public.recipes r where r.id = recipe_steps.recipe_id and r.owner_id = auth.uid()))
  with check (exists (select 1 from public.recipes r where r.id = recipe_steps.recipe_id and r.owner_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- espresso_logs (espresso itinerary)
-- ---------------------------------------------------------------------------
create table if not exists public.espresso_logs (
  id             uuid primary key default gen_random_uuid(),
  owner_id       uuid not null default auth.uid(),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  title          text not null,
  slug           text unique not null,
  category       text not null default 'espresso itinerary',
  mood           text,
  intro          text,
  entry_date     date,
  cover_url      text,
  published      boolean not null default false,
  bean           text,
  roaster        text,
  machine        text,
  grinder        text,
  dose_g         numeric(5,2),
  yield_g        numeric(5,2),
  time_s         integer,
  grind_setting  text,
  water_temp_c   numeric(4,1),
  pressure_bar   numeric(4,1),
  acidity        integer check (acidity    between 0 and 10),
  sweetness      integer check (sweetness  between 0 and 10),
  body           integer check (body       between 0 and 10),
  bitterness     integer check (bitterness between 0 and 10),
  rating         integer check (rating     between 0 and 10),
  notes          text,
  -- Analysis-ready brew ratio (yield / dose), maintained automatically.
  brew_ratio     numeric(6,2) generated always as (round(yield_g / nullif(dose_g, 0), 2)) stored
);

drop trigger if exists trg_espresso_logs_updated_at on public.espresso_logs;
create trigger trg_espresso_logs_updated_at
  before update on public.espresso_logs
  for each row execute function public.set_updated_at();

create index if not exists idx_espresso_published_date on public.espresso_logs(published, entry_date desc);
create index if not exists idx_espresso_owner on public.espresso_logs(owner_id);
create index if not exists idx_espresso_bean on public.espresso_logs(lower(bean));

alter table public.espresso_logs enable row level security;

drop policy if exists "public read published espresso" on public.espresso_logs;
create policy "public read published espresso"
  on public.espresso_logs for select using (published = true);
drop policy if exists "owner read espresso" on public.espresso_logs;
create policy "owner read espresso"
  on public.espresso_logs for select to authenticated using (owner_id = auth.uid());
drop policy if exists "owner insert espresso" on public.espresso_logs;
create policy "owner insert espresso"
  on public.espresso_logs for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists "owner update espresso" on public.espresso_logs;
create policy "owner update espresso"
  on public.espresso_logs for update to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "owner delete espresso" on public.espresso_logs;
create policy "owner delete espresso"
  on public.espresso_logs for delete to authenticated using (owner_id = auth.uid());

-- ---------------------------------------------------------------------------
-- archive_entries (general archive)
-- ---------------------------------------------------------------------------
create table if not exists public.archive_entries (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null default auth.uid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  title       text not null,
  slug        text unique not null,
  category    text not null default 'general archive',
  topic       text,
  mood        text,
  intro       text,
  body        text,
  tags        text[] not null default '{}',
  entry_date  date,
  cover_url   text,
  published   boolean not null default false
);

drop trigger if exists trg_archive_entries_updated_at on public.archive_entries;
create trigger trg_archive_entries_updated_at
  before update on public.archive_entries
  for each row execute function public.set_updated_at();

create index if not exists idx_archive_published_date on public.archive_entries(published, entry_date desc);
create index if not exists idx_archive_owner on public.archive_entries(owner_id);
create index if not exists idx_archive_tags on public.archive_entries using gin (tags);

alter table public.archive_entries enable row level security;

drop policy if exists "public read published archive" on public.archive_entries;
create policy "public read published archive"
  on public.archive_entries for select using (published = true);
drop policy if exists "owner read archive" on public.archive_entries;
create policy "owner read archive"
  on public.archive_entries for select to authenticated using (owner_id = auth.uid());
drop policy if exists "owner insert archive" on public.archive_entries;
create policy "owner insert archive"
  on public.archive_entries for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists "owner update archive" on public.archive_entries;
create policy "owner update archive"
  on public.archive_entries for update to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "owner delete archive" on public.archive_entries;
create policy "owner delete archive"
  on public.archive_entries for delete to authenticated using (owner_id = auth.uid());

-- ---------------------------------------------------------------------------
-- public_settings (one row per owner; homepage section visibility)
-- ---------------------------------------------------------------------------
create table if not exists public.public_settings (
  owner_id      uuid primary key default auth.uid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  show_recipes  boolean not null default true,
  show_espresso boolean not null default true,
  show_archive  boolean not null default true
);

drop trigger if exists trg_public_settings_updated_at on public.public_settings;
create trigger trg_public_settings_updated_at
  before update on public.public_settings
  for each row execute function public.set_updated_at();

alter table public.public_settings enable row level security;

drop policy if exists "public read settings" on public.public_settings;
create policy "public read settings"
  on public.public_settings for select using (true);
drop policy if exists "owner write settings" on public.public_settings;
create policy "owner write settings"
  on public.public_settings for all to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Storage: public "eva-media" bucket
-- Public display uses the public object URL, so NO broad SELECT policy is
-- granted (prevents listing/enumeration). Single-user site: any authenticated
-- session is Eva, so writes are gated on the bucket only.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('eva-media', 'eva-media', true)
on conflict (id) do update set public = true;

drop policy if exists "auth write eva media" on storage.objects;
create policy "auth write eva media"
  on storage.objects for insert to authenticated with check (bucket_id = 'eva-media');
drop policy if exists "auth update eva media" on storage.objects;
create policy "auth update eva media"
  on storage.objects for update to authenticated
  using (bucket_id = 'eva-media') with check (bucket_id = 'eva-media');
drop policy if exists "auth delete eva media" on storage.objects;
create policy "auth delete eva media"
  on storage.objects for delete to authenticated using (bucket_id = 'eva-media');

-- ---------------------------------------------------------------------------
-- Visitor counter (cookieless, privacy-friendly): timestamp + day + path only,
-- no IP and no cookie. Anyone may record a hit; only the owner reads aggregates.
-- ---------------------------------------------------------------------------
create table if not exists public.page_hits (
  id     bigint generated always as identity primary key,
  hit_at timestamptz not null default now(),
  day    date not null default current_date,
  path   text
);

create index if not exists idx_page_hits_day on public.page_hits(day);

alter table public.page_hits enable row level security;

drop policy if exists "anyone can record a hit" on public.page_hits;
create policy "anyone can record a hit"
  on public.page_hits for insert to anon, authenticated
  with check (path is null or char_length(path) <= 255);
drop policy if exists "owner can read hits" on public.page_hits;
create policy "owner can read hits"
  on public.page_hits for select to authenticated using (true);

-- ---------------------------------------------------------------------------
-- Analysis-ready views (security_invoker => respect the caller's RLS).
-- ---------------------------------------------------------------------------
create or replace view public.v_espresso_by_bean
  with (security_invoker = true) as
select
  coalesce(nullif(trim(bean), ''), 'unknown') as bean,
  count(*)                                     as shots,
  round(avg(rating), 2)                        as avg_rating,
  round(avg(brew_ratio), 2)                    as avg_brew_ratio,
  round(avg(time_s), 1)                        as avg_time_s,
  max(entry_date)                              as last_shot
from public.espresso_logs
group by 1;

create or replace view public.v_ingredient_frequency
  with (security_invoker = true) as
select
  lower(name)                                            as ingredient,
  coalesce(nullif(lower(category), ''), 'uncategorized') as category,
  count(*)                                               as uses,
  count(distinct recipe_id)                              as recipes
from public.recipe_ingredients
where name is not null and trim(name) <> ''
group by 1, 2;
