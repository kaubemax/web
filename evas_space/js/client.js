import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ---------------------------------------------------------------------------
// Connection
// ---------------------------------------------------------------------------
const STORE_KEY = "evas_space_entries_v1";
const DEMO_MIGRATION_KEY = "evas_space_demo_migrated_v2";
const VIEW_PREFS_KEY = "evas_space_view_prefs_v1";
const ESPRESSO_DEFAULTS_KEY = "evas_space_espresso_defaults_v1";

export function supabaseConfigured() {
  return Boolean(
    window.SUPABASE_URL &&
    window.SUPABASE_ANON_KEY &&
    !window.SUPABASE_URL.includes("YOUR-PROJECT-REF") &&
    !window.SUPABASE_ANON_KEY.includes("YOUR-ANON")
  );
}

export const supabaseEnabled = supabaseConfigured();
const BUCKET = window.SUPABASE_BUCKET || "eva-media";

export const sb = supabaseEnabled
  ? createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true }
    })
  : null;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUuid = value => typeof value === "string" && UUID_RE.test(value);

export const archiveTypes = [
  { type: "recipe", label: "Cooked Food", plural: "recipes" },
  { type: "espresso", label: "Espresso", plural: "espresso logs" },
  { type: "archive", label: "Archive", plural: "archive notes" }
];

// ---------------------------------------------------------------------------
// Demo data (used as local fallback when Supabase is not configured, and as
// one-click seed content once Eva is signed in).
// ---------------------------------------------------------------------------
export const demoEntries = [
  {
    id: "recipe-silk-tomato-rigatoni",
    type: "recipe",
    title: "Silk Tomato Rigatoni",
    slug: "silk-tomato-rigatoni",
    category: "cooked food",
    mood: "slow dinner",
    intro: "A glossy tomato sauce finished with butter, basil, and enough pasta water to make it feel restaurant-level.",
    date: "2026-06-08",
    cover_url: "",
    published: true,
    servings: "2",
    prep_time: "10 min",
    cook_time: "35 min",
    ingredients: [
      { name: "rigatoni", amount: "200", unit: "g", category: "pasta", note: "" },
      { name: "whole tomatoes", amount: "1", unit: "can", category: "pantry", note: "" },
      { name: "garlic", amount: "2", unit: "cloves", category: "vegetable", note: "sliced" },
      { name: "olive oil", amount: "1", unit: "tbsp", category: "pantry", note: "" },
      { name: "butter", amount: "1", unit: "tbsp", category: "dairy", note: "" },
      { name: "fresh basil", amount: "", unit: "", category: "herb", note: "to finish" },
      { name: "parmesan", amount: "", unit: "", category: "dairy", note: "finely grated" },
      { name: "salt", amount: "", unit: "", category: "seasoning", note: "" }
    ],
    steps: [
      "Warm oil and gently toast sliced garlic.",
      "Crush in the tomatoes and simmer until deep red.",
      "Cook pasta just shy of al dente.",
      "Emulsify sauce with pasta water, butter, and parmesan.",
      "Finish with torn basil and black pepper."
    ],
    created_at: "2026-06-08T18:00:00.000Z"
  },
  {
    id: "recipe-lemony-beans-toast",
    type: "recipe",
    title: "Lemony Beans on Toast",
    slug: "lemony-beans-on-toast",
    category: "cooked food",
    mood: "bright lunch",
    intro: "Creamy beans, lemon, herbs, and crisp bread. Quick enough for a normal day, polished enough to remember.",
    date: "2026-06-04",
    cover_url: "",
    published: true,
    servings: "2",
    prep_time: "8 min",
    cook_time: "12 min",
    ingredients: [
      { name: "white beans", amount: "1", unit: "jar", category: "pantry", note: "drained" },
      { name: "lemon", amount: "1", unit: "", category: "fruit", note: "zest and juice" },
      { name: "shallot", amount: "1", unit: "", category: "vegetable", note: "finely sliced" },
      { name: "parsley", amount: "", unit: "", category: "herb", note: "chopped" },
      { name: "sourdough", amount: "2", unit: "slices", category: "bread", note: "" },
      { name: "olive oil", amount: "", unit: "", category: "pantry", note: "" },
      { name: "chili flakes", amount: "", unit: "", category: "seasoning", note: "" }
    ],
    steps: [
      "Toast the bread until deeply crisp.",
      "Soften shallot in olive oil.",
      "Add beans with a splash of water and mash a few.",
      "Season with lemon zest, juice, parsley, and chili.",
      "Spoon over toast and finish with olive oil."
    ],
    created_at: "2026-06-04T12:00:00.000Z"
  },
  {
    id: "espresso-honeyed-morning",
    type: "espresso",
    title: "Honeyed Morning Shot",
    slug: "honeyed-morning-shot",
    category: "espresso itinerary",
    mood: "balanced",
    intro: "A rounder extraction after grinding one step finer. More sweetness, less hollow finish.",
    date: "2026-06-09",
    cover_url: "",
    published: true,
    bean: "Ethiopia Guji",
    roaster: "Sample roaster",
    machine: "Espresso machine",
    grinder: "Home grinder",
    dose_g: 18,
    yield_g: 40,
    time_s: 29,
    grind_setting: "5.2",
    water_temp_c: 93,
    pressure_bar: 9,
    acidity: 6,
    sweetness: 8,
    body: 7,
    bitterness: 3,
    rating: 8,
    notes: "Clear apricot sweetness. Next time try 1 g less yield to tighten the body.",
    created_at: "2026-06-09T07:30:00.000Z"
  },
  {
    id: "espresso-bright-test",
    type: "espresso",
    title: "Bright Test Shot",
    slug: "bright-test-shot",
    category: "espresso itinerary",
    mood: "too sharp",
    intro: "Useful comparison shot. Fast flow, high acidity, thin texture.",
    date: "2026-06-07",
    cover_url: "",
    published: true,
    bean: "Ethiopia Guji",
    roaster: "Sample roaster",
    machine: "Espresso machine",
    grinder: "Home grinder",
    dose_g: 18,
    yield_g: 42,
    time_s: 24,
    grind_setting: "5.8",
    water_temp_c: 93,
    pressure_bar: 9,
    acidity: 8,
    sweetness: 5,
    body: 4,
    bitterness: 2,
    rating: 5,
    notes: "Ran too fast. Finer grind should increase contact time and improve sweetness.",
    created_at: "2026-06-07T07:20:00.000Z"
  },
  {
    id: "espresso-dark-comfort",
    type: "espresso",
    title: "Dark Comfort Blend",
    slug: "dark-comfort-blend",
    category: "espresso itinerary",
    mood: "syrupy",
    intro: "A forgiving blend with chocolate body. Good baseline for milk drinks.",
    date: "2026-06-02",
    cover_url: "",
    published: true,
    bean: "House blend",
    roaster: "Sample roaster",
    machine: "Espresso machine",
    grinder: "Home grinder",
    dose_g: 18.5,
    yield_g: 37,
    time_s: 31,
    grind_setting: "4.9",
    water_temp_c: 92,
    pressure_bar: 9,
    acidity: 3,
    sweetness: 7,
    body: 9,
    bitterness: 5,
    rating: 7,
    notes: "Thick and chocolatey. A touch bitter at the end; lower temperature by 1 C.",
    created_at: "2026-06-02T08:10:00.000Z"
  },
  {
    id: "archive-market-notes",
    type: "archive",
    title: "Saturday Market Notes",
    slug: "saturday-market-notes",
    category: "general archive",
    topic: "market",
    mood: "observed",
    intro: "Small observations, ingredients to remember, and ideas that do not belong to one recipe yet.",
    date: "2026-06-01",
    cover_url: "",
    published: true,
    tags: ["market", "ideas", "seasonal"],
    body: "Good strawberries are starting to appear. The herb stand had especially fresh dill and tarragon. Possible idea: lemony potatoes with herbs and a soft egg.",
    created_at: "2026-06-01T10:00:00.000Z"
  }
];

// ---------------------------------------------------------------------------
// Auth (Supabase mode only)
// ---------------------------------------------------------------------------
export async function getUser() {
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session?.user ?? null;
}

export function onAuthChange(callback) {
  if (!sb) return () => {};
  const { data } = sb.auth.onAuthStateChange((_event, session) => callback(session?.user ?? null));
  return () => data.subscription.unsubscribe();
}

export async function signIn(email, password) {
  if (!sb) throw new Error("Supabase is not configured.");
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut() {
  if (!sb) return;
  await sb.auth.signOut();
}

// ---------------------------------------------------------------------------
// Row <-> entry mapping
// ---------------------------------------------------------------------------
const num = value => (value === null || value === undefined || value === "" ? null : Number(value));

function mapRecipe(row) {
  return {
    id: row.id,
    type: "recipe",
    title: row.title,
    slug: row.slug,
    category: row.category,
    mood: row.mood || "",
    intro: row.intro || "",
    date: row.entry_date || "",
    cover_url: row.cover_url || "",
    published: row.published,
    servings: row.servings || "",
    prep_time: row.prep_time || "",
    cook_time: row.cook_time || "",
    rating: num(row.rating),
    ingredients: (row.recipe_ingredients || [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map(({ name, amount, unit, category, note }) => ({ name, amount, unit, category, note })),
    steps: (row.recipe_steps || [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map(step => step.instruction),
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

function mapEspresso(row) {
  return {
    id: row.id,
    type: "espresso",
    title: row.title,
    slug: row.slug,
    category: row.category,
    mood: row.mood || "",
    intro: row.intro || "",
    date: row.entry_date || "",
    cover_url: row.cover_url || "",
    published: row.published,
    bean: row.bean || "",
    roaster: row.roaster || "",
    machine: row.machine || "",
    grinder: row.grinder || "",
    dose_g: num(row.dose_g),
    yield_g: num(row.yield_g),
    time_s: num(row.time_s),
    grind_setting: row.grind_setting || "",
    water_temp_c: num(row.water_temp_c),
    pressure_bar: num(row.pressure_bar),
    acidity: num(row.acidity),
    sweetness: num(row.sweetness),
    body: num(row.body),
    bitterness: num(row.bitterness),
    rating: num(row.rating),
    brew_ratio: num(row.brew_ratio),
    notes: row.notes || "",
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

function mapArchive(row) {
  return {
    id: row.id,
    type: "archive",
    title: row.title,
    slug: row.slug,
    category: row.category,
    topic: row.topic || "",
    mood: row.mood || "",
    intro: row.intro || "",
    body: row.body || "",
    tags: row.tags || [],
    date: row.entry_date || "",
    cover_url: row.cover_url || "",
    published: row.published,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

function commonRow(entry) {
  return {
    title: entry.title,
    slug: entry.slug,
    category: entry.category,
    mood: entry.mood || null,
    intro: entry.intro || null,
    entry_date: entry.date || null,
    cover_url: entry.cover_url || null,
    published: Boolean(entry.published)
  };
}

const byDateDesc = (a, b) =>
  new Date(b.date || b.created_at || 0) - new Date(a.date || a.created_at || 0);

// ---------------------------------------------------------------------------
// Entries: read
// ---------------------------------------------------------------------------
// scope: "public" -> published entries only (homepage / detail pages)
//        "owner"  -> all of the signed-in owner's rows (Studio)
export async function loadEntries(scope = "public") {
  const onlyPublished = scope === "public";
  if (!sb) {
    const all = localGetEntries();
    return onlyPublished ? all.filter(entry => entry.published) : all;
  }
  try {
    const recipeQuery = sb.from("recipes").select("*, recipe_ingredients(*), recipe_steps(*)");
    const espressoQuery = sb.from("espresso_logs").select("*");
    const archiveQuery = sb.from("archive_entries").select("*");
    if (onlyPublished) {
      recipeQuery.eq("published", true);
      espressoQuery.eq("published", true);
      archiveQuery.eq("published", true);
    }
    const [recipes, espresso, archive] = await Promise.all([recipeQuery, espressoQuery, archiveQuery]);
    const firstError = recipes.error || espresso.error || archive.error;
    if (firstError) throw firstError;
    return [
      ...recipes.data.map(mapRecipe),
      ...espresso.data.map(mapEspresso),
      ...archive.data.map(mapArchive)
    ].sort(byDateDesc);
  } catch (error) {
    console.warn("Eva's Space: Supabase load failed, falling back to demo data.", error);
    return onlyPublished ? [...demoEntries] : localGetEntries();
  }
}

// ---------------------------------------------------------------------------
// Entries: write
// ---------------------------------------------------------------------------
export async function upsertEntry(entry) {
  if (!sb) return localUpsertEntry(entry);
  if (entry.type === "recipe") return saveRecipe(entry);
  if (entry.type === "espresso") return saveEspresso(entry);
  return saveArchive(entry);
}

async function saveRecipe(entry) {
  const row = {
    ...commonRow(entry),
    servings: entry.servings || null,
    prep_time: entry.prep_time || null,
    cook_time: entry.cook_time || null,
    rating: num(entry.rating)
  };
  if (isUuid(entry.id)) row.id = entry.id;

  const { data, error } = await sb.from("recipes").upsert(row).select("id").single();
  if (error) throw error;
  const recipeId = data.id;

  await Promise.all([
    sb.from("recipe_ingredients").delete().eq("recipe_id", recipeId),
    sb.from("recipe_steps").delete().eq("recipe_id", recipeId)
  ]);

  const ingredients = normalizeIngredients(entry.ingredients)
    .filter(item => item.name)
    .map((item, index) => ({ recipe_id: recipeId, position: index, ...item }));
  const steps = normalizeSteps(entry.steps)
    .map((instruction, index) => ({ recipe_id: recipeId, position: index, instruction }));

  if (ingredients.length) {
    const { error: ingError } = await sb.from("recipe_ingredients").insert(ingredients);
    if (ingError) throw ingError;
  }
  if (steps.length) {
    const { error: stepError } = await sb.from("recipe_steps").insert(steps);
    if (stepError) throw stepError;
  }
  return recipeId;
}

async function saveEspresso(entry) {
  const row = {
    ...commonRow(entry),
    bean: entry.bean || null,
    roaster: entry.roaster || null,
    machine: entry.machine || null,
    grinder: entry.grinder || null,
    dose_g: num(entry.dose_g),
    yield_g: num(entry.yield_g),
    time_s: num(entry.time_s),
    grind_setting: entry.grind_setting || null,
    water_temp_c: num(entry.water_temp_c),
    pressure_bar: num(entry.pressure_bar),
    acidity: num(entry.acidity),
    sweetness: num(entry.sweetness),
    body: num(entry.body),
    bitterness: num(entry.bitterness),
    rating: num(entry.rating),
    notes: entry.notes || null
  };
  if (isUuid(entry.id)) row.id = entry.id;
  const { data, error } = await sb.from("espresso_logs").upsert(row).select("id").single();
  if (error) throw error;
  return data.id;
}

async function saveArchive(entry) {
  const row = {
    ...commonRow(entry),
    topic: entry.topic || null,
    body: entry.body || null,
    tags: normalizeTags(entry.tags)
  };
  if (isUuid(entry.id)) row.id = entry.id;
  const { data, error } = await sb.from("archive_entries").upsert(row).select("id").single();
  if (error) throw error;
  return data.id;
}

const tableForType = type =>
  type === "recipe" ? "recipes" : type === "espresso" ? "espresso_logs" : "archive_entries";

export async function deleteEntry(id, type) {
  if (!sb) return localDeleteEntry(id);
  const { error } = await sb.from(tableForType(type)).delete().eq("id", id);
  if (error) throw error;
}

// One-click sample content for a fresh, signed-in archive.
export async function seedDemoData() {
  if (!sb) {
    resetLocalDemo();
    return;
  }
  const existing = await loadEntries("owner");
  const slugs = new Set(existing.map(entry => entry.slug));
  for (const entry of demoEntries) {
    if (slugs.has(entry.slug)) continue;
    await upsertEntry({ ...entry, id: undefined });
  }
}

// Delete every entry owned by the signed-in account (RLS limits this to Eva's
// own rows). Recipe children cascade via the foreign key.
export async function wipeAllEntries() {
  if (!sb) {
    resetLocalDemo();
    return;
  }
  const allTime = "1970-01-01";
  for (const table of ["recipes", "espresso_logs", "archive_entries"]) {
    const { error } = await sb.from(table).delete().gte("created_at", allTime);
    if (error) throw error;
  }
}

// ---------------------------------------------------------------------------
// Visitor counter (cookieless, no PII: a timestamp + day bucket + path)
// ---------------------------------------------------------------------------
export async function recordHit(path = location.pathname) {
  if (!sb) return;
  try {
    // No .select() -> "return=minimal", so anon needs no read access.
    await sb.from("page_hits").insert({ path });
  } catch (error) {
    console.warn("Eva's Space: could not record visit.", error);
  }
}

export async function loadVisitsByDay() {
  if (!sb) return [];
  try {
    const { data, error } = await sb.from("v_visits_by_day").select("*");
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn("Eva's Space: could not load daily visits.", error);
    return [];
  }
}

export async function loadVisitStats() {
  if (!sb) return { total: 0, today: 0 };
  const today = new Date().toISOString().slice(0, 10);
  try {
    const [all, day] = await Promise.all([
      sb.from("page_hits").select("*", { count: "exact", head: true }),
      sb.from("page_hits").select("*", { count: "exact", head: true }).eq("day", today)
    ]);
    if (all.error || day.error) throw all.error || day.error;
    return { total: all.count ?? 0, today: day.count ?? 0 };
  } catch (error) {
    console.warn("Eva's Space: could not load visit stats.", error);
    return { total: 0, today: 0 };
  }
}

// ---------------------------------------------------------------------------
// Public homepage settings (section visibility)
// ---------------------------------------------------------------------------
const DEFAULT_PREFS = { recipe: true, espresso: true, archive: true };

export async function loadViewPrefs() {
  if (!sb) return localGetViewPrefs();
  try {
    const { data, error } = await sb
      .from("public_settings")
      .select("show_recipes, show_espresso, show_archive")
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (!data) return { ...DEFAULT_PREFS };
    return { recipe: data.show_recipes, espresso: data.show_espresso, archive: data.show_archive };
  } catch (error) {
    console.warn("Eva's Space: could not load public settings.", error);
    return { ...DEFAULT_PREFS };
  }
}

export async function saveViewPrefs(prefs) {
  if (!sb) return localSaveViewPrefs(prefs);
  const user = await getUser();
  if (!user) throw new Error("Sign in to change public visibility.");
  const { error } = await sb.from("public_settings").upsert({
    owner_id: user.id,
    show_recipes: prefs.recipe,
    show_espresso: prefs.espresso,
    show_archive: prefs.archive
  });
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Media upload
// ---------------------------------------------------------------------------
export async function uploadMedia(file) {
  if (!file) return "";
  if (!sb) return imageToDataUrl(file);
  const user = await getUser();
  if (!user) return imageToDataUrl(file);
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${user.id}/${crypto.randomUUID()}.${ext || "jpg"}`;
  const { error } = await sb.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined
  });
  if (error) throw error;
  const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ---------------------------------------------------------------------------
// Espresso last-used defaults (local convenience, both modes)
// ---------------------------------------------------------------------------
export function getEspressoDefaults() {
  try {
    return JSON.parse(localStorage.getItem(ESPRESSO_DEFAULTS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveEspressoDefaults(entry) {
  const defaults = {
    bean: entry.bean || "",
    roaster: entry.roaster || "",
    machine: entry.machine || "",
    grinder: entry.grinder || ""
  };
  localStorage.setItem(ESPRESSO_DEFAULTS_KEY, JSON.stringify(defaults));
}

// ---------------------------------------------------------------------------
// Local fallback persistence (when Supabase is not configured)
// ---------------------------------------------------------------------------
function localGetEntries() {
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) return [...demoEntries];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.length) return [...demoEntries];
    if (localStorage.getItem(DEMO_MIGRATION_KEY)) return parsed;
    const existingIds = new Set(parsed.map(entry => entry.id));
    const migrated = [...parsed, ...demoEntries.filter(entry => !existingIds.has(entry.id))];
    localStorage.setItem(STORE_KEY, JSON.stringify(migrated));
    localStorage.setItem(DEMO_MIGRATION_KEY, "1");
    return migrated;
  } catch {
    return [...demoEntries];
  }
}

function localUpsertEntry(entry) {
  const next = [
    { ...entry, updated_at: new Date().toISOString() },
    ...localGetEntries().filter(item => item.id !== entry.id)
  ];
  localStorage.setItem(STORE_KEY, JSON.stringify(next));
  return entry.id;
}

function localDeleteEntry(id) {
  localStorage.setItem(STORE_KEY, JSON.stringify(localGetEntries().filter(item => item.id !== id)));
}

function resetLocalDemo() {
  localStorage.removeItem(STORE_KEY);
  localStorage.removeItem(DEMO_MIGRATION_KEY);
}

function localGetViewPrefs() {
  try {
    return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(VIEW_PREFS_KEY) || "{}") };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

function localSaveViewPrefs(prefs) {
  localStorage.setItem(VIEW_PREFS_KEY, JSON.stringify(prefs));
}

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function esc(s) {
  return (s ?? "").toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function lines(text) {
  return (text ?? "").split("\n").map(line => line.trim()).filter(Boolean);
}

export function normalizeIngredients(value) {
  if (Array.isArray(value)) {
    return value
      .map(item => ({
        name: (item.name ?? "").toString().trim(),
        amount: (item.amount ?? "").toString().trim(),
        unit: (item.unit ?? "").toString().trim(),
        category: (item.category ?? "").toString().trim(),
        note: (item.note ?? "").toString().trim()
      }))
      .filter(item => item.name || item.amount || item.unit || item.category || item.note);
  }

  return lines(value).map(line => ({
    name: line,
    amount: "",
    unit: "",
    category: "",
    note: ""
  }));
}

export function normalizeSteps(value) {
  if (Array.isArray(value)) {
    return value.map(step => (step ?? "").toString().trim()).filter(Boolean);
  }
  return lines(value);
}

export function normalizeTags(value) {
  if (Array.isArray(value)) {
    return value.map(tag => (tag ?? "").toString().trim()).filter(Boolean);
  }
  return (value ?? "").toString().split(",").map(tag => tag.trim()).filter(Boolean);
}

export function formatIngredient(item) {
  const amount = [item.amount, item.unit].filter(Boolean).join(" ");
  const main = [amount, item.name].filter(Boolean).join(" ");
  return [main, item.note].filter(Boolean).join(" - ");
}

// 1-5 star rating as inline markup (uses the U+2605 star glyph, not an emoji).
export function starRating(value, max = 5) {
  const filled = Math.max(0, Math.min(max, Math.round(Number(value) || 0)));
  if (!filled) return "";
  let out = `<span class="stars" role="img" aria-label="${filled} out of ${max} stars">`;
  for (let i = 1; i <= max; i += 1) {
    out += `<span class="star${i <= filled ? " on" : ""}" aria-hidden="true">★</span>`;
  }
  return `${out}</span>`;
}

export function formatDate(date) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

export function imageToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function recipeGradient(title) {
  const palettes = [
    ["#f6a15f", "#efe2b7", "#7a9b76"],
    ["#b53f3f", "#f2c078", "#263b2a"],
    ["#f2d8a8", "#cc6f57", "#394b59"],
    ["#e6b8a2", "#f5f0df", "#47624f"]
  ];
  const index = Math.abs(slugify(title).split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0)) % palettes.length;
  const [a, b, c] = palettes[index];
  return `linear-gradient(135deg, ${a}, ${b} 48%, ${c})`;
}

export function espressoStats(entries) {
  const shots = entries
    .filter(entry => entry.type === "espresso" && entry.published)
    .sort((a, b) => new Date(a.date || a.created_at) - new Date(b.date || b.created_at));
  const avg = key => shots.length ? shots.reduce((sum, shot) => sum + Number(shot[key] || 0), 0) / shots.length : 0;
  return {
    shots,
    avgRating: avg("rating"),
    avgTime: avg("time_s"),
    avgYield: avg("yield_g"),
    best: [...shots].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))[0]
  };
}

export function entryStats(entries) {
  const published = entries.filter(entry => entry.published);
  const recipes = published.filter(entry => entry.type === "recipe");
  const espresso = published.filter(entry => entry.type === "espresso");
  const archive = published.filter(entry => entry.type === "archive");
  const ingredientCount = recipes.reduce((sum, recipe) => sum + normalizeIngredients(recipe.ingredients).length, 0);
  const avgRecipeIngredients = recipes.length ? ingredientCount / recipes.length : 0;
  const coffee = espressoStats(published);
  const ratedRecipes = recipes.filter(recipe => Number(recipe.rating) > 0);
  const avgFoodRating = ratedRecipes.length
    ? ratedRecipes.reduce((sum, recipe) => sum + Number(recipe.rating), 0) / ratedRecipes.length
    : 0;

  return {
    total: published.length,
    recipes: recipes.length,
    espresso: espresso.length,
    archive: archive.length,
    ingredientCount,
    avgRecipeIngredients,
    avgEspressoRating: coffee.avgRating,
    avgFoodRating
  };
}
