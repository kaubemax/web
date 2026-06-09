# Eva's Space

Static GitHub Pages frontend for `kaubemax.de/evas_space/`.

The site is designed as Eva's personal archive with two main notebooks:

- Cooked food entries: recipes, ingredients, method, photos, story notes.
- Espresso itinerary: daily espresso photos, dose, yield, time, grind, taste scores, rating, and improvement notes.
- General archive: flexible notes, observations, lists, ideas, and memories.

## Current frontend behavior

The frontend runs without a build step and without a backend:

- `index.html` is the public homepage with the digital X-mark rose background, recipe archive, espresso dashboard, chart, and archive sections.
- `recipe.html` renders either a cooked-food entry or an espresso entry based on `?type=...&slug=...`.
- `editor.html` is the prototype studio with a dashboard, visibility toggles, stats, and separate edit view for all entry types.
- `js/client.js` contains demo data and a localStorage persistence layer.
- `css/style.css` contains the full responsive visual system.

Until Supabase is connected, the editor stores changes only in the current browser's local storage. This is intentional for frontend development and works on GitHub Pages.

## GitHub Pages limits

GitHub Pages can serve static files only. It cannot securely:

- Store new entries permanently for all visitors.
- Upload photos to a server.
- Protect write access by itself.
- Run scheduled jobs or server-side image processing.

So the frontend must stay static, and Supabase should provide persistence, auth, and media storage.

## Supabase needed later

Run `schema.sql` in Supabase after creating the project. The backend contract is:

- Auth: one Eva account, public sign-ups disabled.
- Storage: one public bucket named `eva-media`.
- Table `recipes`: cooked-food entries.
- Table `recipe_ingredients`: one structured row per ingredient with `amount`, `unit`, `name`, `category`, `note`, and `position`.
- Table `recipe_steps`: one ordered instruction row per method step.
- Table `espresso_logs`: espresso diary entries.
- Table `archive_entries`: flexible general-purpose archive entries.
- Table `public_settings`: public section visibility toggles.
- RLS: public visitors read only `published = true`; Eva can read/write her own rows.

The public anon key is still safe to commit because write access depends on Supabase Auth and RLS.

## Structured cooking data

Cooking data should stay structured from the beginning. The editor therefore avoids saving ingredients as one plain textarea. Each ingredient is captured as:

- `amount`: free text for easy entry, e.g. `200`, `1`, `1/2`
- `unit`: e.g. `g`, `ml`, `tbsp`, `can`, `cloves`
- `name`: the ingredient itself, e.g. `tomatoes`
- `category`: e.g. `vegetable`, `pantry`, `dairy`, `herb`
- `note`: prep or quality detail, e.g. `chopped`, `canned`, `finely grated`
- `position`: display/order index

Method instructions are also stored as ordered rows in `recipe_steps`, not as a text blob.

This makes later features straightforward: shopping lists, ingredient frequency, pantry overlap, category filters, recipe scaling, and comparisons across cooked entries.

## Dashboard and visibility

The Studio dashboard currently calculates stats from local browser data:

- total published entries
- recipe count
- espresso log count
- general archive count
- ingredients tracked
- average espresso rating

Archive visibility toggles are stored in local storage for now. In Supabase, these map to `public_settings.show_recipes`, `show_espresso`, and `show_archive`.

Espresso defaults for `bean`, `roaster`, `machine`, and `grinder` are remembered locally after saving an espresso entry. In Supabase this could be a small `editor_preferences` table later, but it can also remain local-only if it is just a convenience feature.

## One-time backend setup

1. Create a Supabase project.
2. Create a public Storage bucket named exactly `eva-media`.
3. Run `schema.sql` in the SQL editor.
4. Authentication -> Users -> Add user for Eva.
5. Authentication settings -> disable public sign-ups.
6. Project Settings -> API -> paste Project URL and anon key into `js/supabase-config.js`.
7. Replace the localStorage functions in `js/client.js` with Supabase reads/writes.

## Local preview

From the repo root:

```sh
python3 -m http.server 4173
```

Open:

- `http://localhost:4173/evas_space/`
- `http://localhost:4173/evas_space/editor.html`
