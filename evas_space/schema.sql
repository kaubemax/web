-- ===========================================================================
-- Eva's Space - Supabase schema
-- Run this in: Supabase dashboard -> SQL Editor -> New query -> paste -> Run
-- ===========================================================================

-- Required backend pieces:
-- 1. Supabase Auth with public sign-ups disabled.
-- 2. A public Storage bucket named "eva-media".
-- 3. Public read access for published entries.
-- 4. Authenticated write access for Eva's account.
-- 5. Public settings for archive section visibility.

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------------------
-- Cooked food entries
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
  cook_time    text
);

drop trigger if exists trg_recipes_updated_at on public.recipes;
create trigger trg_recipes_updated_at
  before update on public.recipes
  for each row execute function public.set_updated_at();

alter table public.recipes enable row level security;

drop policy if exists "public read published recipes" on public.recipes;
create policy "public read published recipes"
  on public.recipes for select
  using (published = true);

drop policy if exists "owner read recipes" on public.recipes;
create policy "owner read recipes"
  on public.recipes for select
  to authenticated
  using (owner_id = auth.uid());

drop policy if exists "owner insert recipes" on public.recipes;
create policy "owner insert recipes"
  on public.recipes for insert
  to authenticated
  with check (owner_id = auth.uid());

drop policy if exists "owner update recipes" on public.recipes;
create policy "owner update recipes"
  on public.recipes for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "owner delete recipes" on public.recipes;
create policy "owner delete recipes"
  on public.recipes for delete
  to authenticated
  using (owner_id = auth.uid());

-- Structured recipe data. Keep ingredients and method steps as rows, not text
-- blobs, so they can be searched, filtered, grouped, and summarized later.
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

create index if not exists idx_recipe_ingredients_recipe_position
  on public.recipe_ingredients(recipe_id, position);

create index if not exists idx_recipe_ingredients_name
  on public.recipe_ingredients(lower(name));

alter table public.recipe_ingredients enable row level security;

drop policy if exists "public read published ingredients" on public.recipe_ingredients;
create policy "public read published ingredients"
  on public.recipe_ingredients for select
  using (
    exists (
      select 1 from public.recipes
      where recipes.id = recipe_ingredients.recipe_id
      and recipes.published = true
    )
  );

drop policy if exists "owner read ingredients" on public.recipe_ingredients;
create policy "owner read ingredients"
  on public.recipe_ingredients for select
  to authenticated
  using (
    exists (
      select 1 from public.recipes
      where recipes.id = recipe_ingredients.recipe_id
      and recipes.owner_id = auth.uid()
    )
  );

drop policy if exists "owner insert ingredients" on public.recipe_ingredients;
create policy "owner insert ingredients"
  on public.recipe_ingredients for insert
  to authenticated
  with check (
    exists (
      select 1 from public.recipes
      where recipes.id = recipe_ingredients.recipe_id
      and recipes.owner_id = auth.uid()
    )
  );

drop policy if exists "owner update ingredients" on public.recipe_ingredients;
create policy "owner update ingredients"
  on public.recipe_ingredients for update
  to authenticated
  using (
    exists (
      select 1 from public.recipes
      where recipes.id = recipe_ingredients.recipe_id
      and recipes.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.recipes
      where recipes.id = recipe_ingredients.recipe_id
      and recipes.owner_id = auth.uid()
    )
  );

drop policy if exists "owner delete ingredients" on public.recipe_ingredients;
create policy "owner delete ingredients"
  on public.recipe_ingredients for delete
  to authenticated
  using (
    exists (
      select 1 from public.recipes
      where recipes.id = recipe_ingredients.recipe_id
      and recipes.owner_id = auth.uid()
    )
  );

create table if not exists public.recipe_steps (
  id          uuid primary key default gen_random_uuid(),
  recipe_id   uuid not null references public.recipes(id) on delete cascade,
  position    integer not null default 0,
  instruction text not null
);

create index if not exists idx_recipe_steps_recipe_position
  on public.recipe_steps(recipe_id, position);

alter table public.recipe_steps enable row level security;

drop policy if exists "public read published steps" on public.recipe_steps;
create policy "public read published steps"
  on public.recipe_steps for select
  using (
    exists (
      select 1 from public.recipes
      where recipes.id = recipe_steps.recipe_id
      and recipes.published = true
    )
  );

drop policy if exists "owner read steps" on public.recipe_steps;
create policy "owner read steps"
  on public.recipe_steps for select
  to authenticated
  using (
    exists (
      select 1 from public.recipes
      where recipes.id = recipe_steps.recipe_id
      and recipes.owner_id = auth.uid()
    )
  );

drop policy if exists "owner insert steps" on public.recipe_steps;
create policy "owner insert steps"
  on public.recipe_steps for insert
  to authenticated
  with check (
    exists (
      select 1 from public.recipes
      where recipes.id = recipe_steps.recipe_id
      and recipes.owner_id = auth.uid()
    )
  );

drop policy if exists "owner update steps" on public.recipe_steps;
create policy "owner update steps"
  on public.recipe_steps for update
  to authenticated
  using (
    exists (
      select 1 from public.recipes
      where recipes.id = recipe_steps.recipe_id
      and recipes.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.recipes
      where recipes.id = recipe_steps.recipe_id
      and recipes.owner_id = auth.uid()
    )
  );

drop policy if exists "owner delete steps" on public.recipe_steps;
create policy "owner delete steps"
  on public.recipe_steps for delete
  to authenticated
  using (
    exists (
      select 1 from public.recipes
      where recipes.id = recipe_steps.recipe_id
      and recipes.owner_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Espresso itinerary entries
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
  acidity        integer check (acidity between 0 and 10),
  sweetness      integer check (sweetness between 0 and 10),
  body           integer check (body between 0 and 10),
  bitterness     integer check (bitterness between 0 and 10),
  rating         integer check (rating between 0 and 10),
  notes          text
);

drop trigger if exists trg_espresso_logs_updated_at on public.espresso_logs;
create trigger trg_espresso_logs_updated_at
  before update on public.espresso_logs
  for each row execute function public.set_updated_at();

alter table public.espresso_logs enable row level security;

drop policy if exists "public read published espresso" on public.espresso_logs;
create policy "public read published espresso"
  on public.espresso_logs for select
  using (published = true);

drop policy if exists "owner read espresso" on public.espresso_logs;
create policy "owner read espresso"
  on public.espresso_logs for select
  to authenticated
  using (owner_id = auth.uid());

drop policy if exists "owner insert espresso" on public.espresso_logs;
create policy "owner insert espresso"
  on public.espresso_logs for insert
  to authenticated
  with check (owner_id = auth.uid());

drop policy if exists "owner update espresso" on public.espresso_logs;
create policy "owner update espresso"
  on public.espresso_logs for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "owner delete espresso" on public.espresso_logs;
create policy "owner delete espresso"
  on public.espresso_logs for delete
  to authenticated
  using (owner_id = auth.uid());

-- ---------------------------------------------------------------------------
-- General purpose archive entries
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

alter table public.archive_entries enable row level security;

drop policy if exists "public read published archive" on public.archive_entries;
create policy "public read published archive"
  on public.archive_entries for select
  using (published = true);

drop policy if exists "owner read archive" on public.archive_entries;
create policy "owner read archive"
  on public.archive_entries for select
  to authenticated
  using (owner_id = auth.uid());

drop policy if exists "owner insert archive" on public.archive_entries;
create policy "owner insert archive"
  on public.archive_entries for insert
  to authenticated
  with check (owner_id = auth.uid());

drop policy if exists "owner update archive" on public.archive_entries;
create policy "owner update archive"
  on public.archive_entries for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "owner delete archive" on public.archive_entries;
create policy "owner delete archive"
  on public.archive_entries for delete
  to authenticated
  using (owner_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Public page settings
-- ---------------------------------------------------------------------------
create table if not exists public.public_settings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  show_recipes boolean not null default true,
  show_espresso boolean not null default true,
  show_archive boolean not null default true
);

drop trigger if exists trg_public_settings_updated_at on public.public_settings;
create trigger trg_public_settings_updated_at
  before update on public.public_settings
  for each row execute function public.set_updated_at();

alter table public.public_settings enable row level security;

drop policy if exists "public read settings" on public.public_settings;
create policy "public read settings"
  on public.public_settings for select
  using (true);

drop policy if exists "owner write settings" on public.public_settings;
create policy "owner write settings"
  on public.public_settings for all
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Media bucket policies
-- Create a PUBLIC bucket named "eva-media" before running these policies.
-- ---------------------------------------------------------------------------
drop policy if exists "public read eva media" on storage.objects;
create policy "public read eva media"
  on storage.objects for select
  using (bucket_id = 'eva-media');

drop policy if exists "auth upload eva media" on storage.objects;
create policy "auth upload eva media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'eva-media' and owner = auth.uid());

drop policy if exists "auth update eva media" on storage.objects;
create policy "auth update eva media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'eva-media' and owner = auth.uid())
  with check (bucket_id = 'eva-media' and owner = auth.uid());

drop policy if exists "auth delete eva media" on storage.objects;
create policy "auth delete eva media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'eva-media' and owner = auth.uid());
