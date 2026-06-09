# Eva's Space - Project Handover

## Preview

Local preview server:

```sh
python3 -m http.server 4173
```

URLs:

- Public site: `http://localhost:4173/evas_space/`
- Studio/dashboard/editor: `http://localhost:4173/evas_space/editor.html`

Target GitHub Pages path:

- `https://kaubemax.de/evas_space/`

## Current status

Eva's Space is a static GitHub Pages frontend wired to a live Supabase backend.

- Backend is provisioned (project `bqmvzzowgctdzyxsniir`): all tables, RLS, the public `eva-media` storage bucket, analysis views, and security hardening are applied. See `schema.sql` for the canonical, idempotent copy.
- Frontend is wired: `js/client.js` reads published entries for the public pages, gates the Studio behind Supabase Auth, writes structured rows, uploads photos to storage, and stores section visibility in `public_settings`.
- If Supabase is ever unconfigured (placeholder values in `js/supabase-config.js`), the frontend transparently falls back to `localStorage` + demo data, so it still runs anywhere.

### Remaining manual steps (Supabase dashboard)

These two cannot be done from the repo and are required before the Studio can be used:

1. Authentication -> Users -> Add user: create Eva's account (email + password).
2. Authentication -> Providers/Sign-ups: disable public sign-ups.

After signing in at `editor.html`, use **Load samples** to seed the demo entries, or just start creating real ones.

Implemented archive types:

- `recipe`: cooked-food entries with structured ingredients and ordered method steps.
- `espresso`: espresso itinerary/log entries with extraction data and taste scores.
- `archive`: general-purpose notes, observations, lists, ideas, and memories.

Implemented views:

- `index.html`: public homepage with digital X-mark rose background, recipe archive, espresso dashboard/chart, espresso timeline, and general archive.
- `recipe.html`: detail page for all three entry types. The filename is legacy; it now renders recipes, espresso logs, and archive notes.
- `editor.html`: private Studio prototype with Dashboard and separate Edit view.

Data layer:

- Studio writes go to Supabase (Postgres + Storage) under Eva's authenticated account.
- Public pages read only `published = true` rows via RLS.
- `localStorage` is now only a fallback for when Supabase is not configured.

## File map

- `index.html`
  Public homepage shell. Loads `js/home.js`.

- `recipe.html`
  Detail renderer for `recipe`, `espresso`, and `archive` entries.

- `editor.html`
  Studio UI. Contains Dashboard, visibility toggles, entry list, and edit form.

- `css/style.css`
  Full visual system, responsive behavior, dashboard/editor styling, espresso slider styling, and rose banner CSS.

- `js/client.js`
  Shared local data layer, demo data, helpers, normalization functions, local preferences, and stats.

- `js/home.js`
  Homepage rendering logic.

- `js/rose-banner.js`
  Procedural SVG generator for the digital X-mark rose background. X marks are snapped to a tight fixed grid.

- `js/supabase-config.js`
  Placeholder Supabase URL, anon key, and bucket name.

- `schema.sql`
  Supabase database schema, row-level security policies, and storage policies.

- `README.md`
  Setup and project notes.

## Local prototype data

The local frontend uses these keys:

- `evas_space_entries_v1`
  Main entry array.

- `evas_space_demo_migrated_v2`
  One-time flag so new demo records are merged into old local data only once.

- `evas_space_view_prefs_v1`
  Public archive visibility toggles:
  - `recipe`
  - `espresso`
  - `archive`

- `evas_space_espresso_defaults_v1`
  Last-used espresso defaults:
  - `bean`
  - `roaster`
  - `machine`
  - `grinder`

## Entry shapes

### Recipe

```js
{
  id,
  type: "recipe",
  title,
  slug,
  category: "cooked food",
  mood,
  intro,
  date,
  cover_url,
  published,
  servings,
  prep_time,
  cook_time,
  ingredients: [
    { amount, unit, name, category, note }
  ],
  steps: [
    "Instruction text"
  ],
  created_at,
  updated_at
}
```

### Espresso

```js
{
  id,
  type: "espresso",
  title,
  slug,
  category: "espresso itinerary",
  mood,
  intro,
  date,
  cover_url,
  published,
  bean,
  roaster,
  machine,
  grinder,
  dose_g,
  yield_g,
  time_s,
  grind_setting,
  water_temp_c,
  pressure_bar,
  acidity,
  sweetness,
  body,
  bitterness,
  rating,
  notes,
  created_at,
  updated_at
}
```

### General archive

```js
{
  id,
  type: "archive",
  title,
  slug,
  category: "general archive",
  topic,
  mood,
  intro,
  body,
  tags: [],
  date,
  cover_url,
  published,
  created_at,
  updated_at
}
```

## Frontend behavior

### Public site

`index.html` renders only entries with `published: true`.

Visibility of the public sections is controlled by local view preferences:

- `recipe`
- `espresso`
- `archive`

When Supabase is connected, these should map to `public_settings`.

### Studio dashboard

Current dashboard stats:

- total published entries
- recipe count
- espresso log count
- general archive note count
- tracked ingredient count
- average espresso rating

Current dashboard controls:

- public section visibility toggles
- local entry list
- reset demo data
- open new entry form

### Studio edit view

The form is hidden by default unless:

- user clicks `New entry`
- user clicks an entry `Edit`
- URL includes `?type=recipe`, `?type=espresso`, or `?type=archive`

Recipe editor:

- structured ingredient rows
- ordered method step rows

Espresso editor:

- extraction fields
- taste sliders with visible values
- last-used defaults for `bean`, `roaster`, `machine`, `grinder`

Archive editor:

- topic
- tags
- body note

## Backend plan

Supabase is still owed. The frontend should remain static and GitHub Pages-compatible. Supabase should provide:

- Auth
- Postgres data
- Storage
- Row-Level Security
- public settings

### Supabase setup steps

1. Create a Supabase project.
2. Create a public Storage bucket named exactly `eva-media`.
3. Run `schema.sql`.
4. Create Eva's user in Authentication.
5. Disable public sign-ups.
6. Copy Project URL and anon key into `js/supabase-config.js`.
7. Replace `localStorage` data functions in `js/client.js` with Supabase calls.

## Required Supabase tables

### `recipes`

Purpose:

- Main cooked-food recipe entry.

Important columns:

- `id uuid primary key`
- `owner_id uuid default auth.uid()`
- `created_at timestamptz`
- `updated_at timestamptz`
- `title text`
- `slug text unique`
- `category text default 'cooked food'`
- `mood text`
- `intro text`
- `entry_date date`
- `cover_url text`
- `published boolean`
- `servings text`
- `prep_time text`
- `cook_time text`

### `recipe_ingredients`

Purpose:

- Normalized structured ingredients.

Important columns:

- `id uuid primary key`
- `recipe_id uuid references recipes(id) on delete cascade`
- `position integer`
- `name text`
- `amount text`
- `unit text`
- `category text`
- `note text`

Why normalized:

- shopping lists
- filtering by ingredient
- ingredient frequency
- pantry overlap
- category summaries
- recipe scaling later

### `recipe_steps`

Purpose:

- Ordered method instructions.

Important columns:

- `id uuid primary key`
- `recipe_id uuid references recipes(id) on delete cascade`
- `position integer`
- `instruction text`

### `espresso_logs`

Purpose:

- Espresso itinerary entries with structured extraction and taste data.

Important columns:

- `id uuid primary key`
- `owner_id uuid default auth.uid()`
- `title text`
- `slug text unique`
- `category text default 'espresso itinerary'`
- `mood text`
- `intro text`
- `entry_date date`
- `cover_url text`
- `published boolean`
- `bean text`
- `roaster text`
- `machine text`
- `grinder text`
- `dose_g numeric(5,2)`
- `yield_g numeric(5,2)`
- `time_s integer`
- `grind_setting text`
- `water_temp_c numeric(4,1)`
- `pressure_bar numeric(4,1)`
- `acidity integer check 0-10`
- `sweetness integer check 0-10`
- `body integer check 0-10`
- `bitterness integer check 0-10`
- `rating integer check 0-10`
- `notes text`

### `archive_entries`

Purpose:

- General-purpose archive notes.

Important columns:

- `id uuid primary key`
- `owner_id uuid default auth.uid()`
- `title text`
- `slug text unique`
- `category text default 'general archive'`
- `topic text`
- `mood text`
- `intro text`
- `body text`
- `tags text[]`
- `entry_date date`
- `cover_url text`
- `published boolean`

### `public_settings`

Purpose:

- Controls which public archive sections are visible.

Important columns:

- `id uuid primary key`
- `owner_id uuid default auth.uid()`
- `show_recipes boolean default true`
- `show_espresso boolean default true`
- `show_archive boolean default true`

Frontend mapping:

- `show_recipes` -> homepage recipe section
- `show_espresso` -> homepage espresso section
- `show_archive` -> homepage general archive section

### Storage bucket: `eva-media`

Purpose:

- Recipe photos
- Espresso photos
- Archive photos

Bucket should be public.

Public read is acceptable because only published entries should expose their `cover_url`.

## Required RLS model

Public users:

- can read published recipes
- can read ingredients/steps for published recipes
- can read published espresso logs
- can read published archive entries
- can read public settings
- can read public storage objects in `eva-media`

Authenticated Eva:

- can read all own rows
- can insert/update/delete own rows
- can upload/update/delete own media
- can update own public settings

Important:

- The Supabase anon key can be committed publicly.
- Write safety must come from Supabase Auth and RLS.

## Supabase implementation notes

`localStorage` replacement should likely happen in `js/client.js`.

Recommended approach:

- Keep helper exports stable where possible.
- Add async functions:
  - `loadEntries()`
  - `saveRecipeWithChildren()`
  - `saveEspressoLog()`
  - `saveArchiveEntry()`
  - `deleteEntryByType()`
  - `loadPublicSettings()`
  - `savePublicSettings()`
  - `uploadMedia(file)`

Recipes require multi-step writes:

1. upsert row in `recipes`
2. delete existing `recipe_ingredients` and `recipe_steps` for that recipe
3. insert current ingredient rows with `position`
4. insert current step rows with `position`

This is simple enough client-side for now, but a Supabase RPC function would be cleaner later if consistency becomes a concern.

## Known issues / next work

- Supabase is not connected yet.
- No real login gate exists in current Studio after the redesign. The old auth-gated Supabase flow was replaced by local prototype behavior. When Supabase is connected, Studio should require `sb.auth.getSession()` before showing Dashboard/Edit.
- Media upload is local preview only. Images are converted to data URLs in browser storage, which is not suitable for production.
- Entry detail page filename is still `recipe.html`; it should eventually be renamed to `entry.html`, with redirects or updated links.
- Dashboard stats are basic. Useful future stats:
  - recipe ingredient frequency
  - most common ingredient categories
  - espresso average ratio
  - espresso rating trend
  - best espresso recipe by bean/machine/grinder
  - public/draft split
  - posts per month
- Archive visibility is local-only until Supabase `public_settings` is wired.
- Espresso last-used defaults are local-only. This may be fine, or it can become an `editor_preferences` table later.

## Verification already run

Current checks that passed:

```sh
for f in evas_space/js/*.js; do node --check "$f" || exit 1; done
```

Inline module parse checks passed for:

- `editor.html`
- `recipe.html`

Stale reference scan was clean for:

- old embroidery terms
- removed AI/OpenRouter plan
- old recipe-only bucket name

## Git status note

At time of handover, `evas_space/` is untracked in git:

```sh
?? evas_space/
```

No commit has been made.
