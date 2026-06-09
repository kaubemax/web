const STORE_KEY = "evas_space_entries_v1";
const DEMO_MIGRATION_KEY = "evas_space_demo_migrated_v2";
const VIEW_PREFS_KEY = "evas_space_view_prefs_v1";
const ESPRESSO_DEFAULTS_KEY = "evas_space_espresso_defaults_v1";

export const archiveTypes = [
  { type: "recipe", label: "Cooked Food", plural: "recipes" },
  { type: "espresso", label: "Espresso", plural: "espresso logs" },
  { type: "archive", label: "Archive", plural: "archive notes" }
];

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

export function supabaseConfigured() {
  return Boolean(
    window.SUPABASE_URL &&
    window.SUPABASE_ANON_KEY &&
    !window.SUPABASE_URL.includes("YOUR-PROJECT-REF") &&
    !window.SUPABASE_ANON_KEY.includes("YOUR-ANON")
  );
}

export function getEntries() {
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) return demoEntries;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.length) return demoEntries;
    if (localStorage.getItem(DEMO_MIGRATION_KEY)) return parsed;
    const existingIds = new Set(parsed.map(entry => entry.id));
    const migrated = [...parsed, ...demoEntries.filter(entry => !existingIds.has(entry.id))];
    saveEntries(migrated);
    localStorage.setItem(DEMO_MIGRATION_KEY, "1");
    return migrated;
  } catch {
    return demoEntries;
  }
}

export function saveEntries(entries) {
  localStorage.setItem(STORE_KEY, JSON.stringify(entries));
}

export function upsertEntry(entry) {
  const entries = getEntries().filter(item => item.id !== entry.id);
  const next = [{ ...entry, updated_at: new Date().toISOString() }, ...entries];
  saveEntries(next);
  return entry;
}

export function deleteEntry(id) {
  saveEntries(getEntries().filter(item => item.id !== id));
}

export function resetDemoEntries() {
  localStorage.removeItem(STORE_KEY);
  localStorage.removeItem(DEMO_MIGRATION_KEY);
}

export function getViewPrefs() {
  const fallback = { recipe: true, espresso: true, archive: true };
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(VIEW_PREFS_KEY) || "{}") };
  } catch {
    return fallback;
  }
}

export function saveViewPrefs(prefs) {
  localStorage.setItem(VIEW_PREFS_KEY, JSON.stringify(prefs));
}

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

  return {
    total: published.length,
    recipes: recipes.length,
    espresso: espresso.length,
    archive: archive.length,
    ingredientCount,
    avgRecipeIngredients,
    avgEspressoRating: coffee.avgRating
  };
}
