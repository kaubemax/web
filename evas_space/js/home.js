import { esc, espressoStats, formatDate, loadEntries, loadViewPrefs, normalizeTags, recipeGradient, recordHit, starRating } from "./client.js";
import { renderRoseBanner } from "./rose-banner.js";

renderRoseBanner();
recordHit();

let allEntries = [];
let allRecipes = [];
let allEspresso = [];
let allArchive = [];
let viewPrefs = { recipe: true, espresso: true, archive: true };

function matchesQuery(entry, q) {
  if (!q) return true;
  const parts = [
    entry.title, entry.intro, entry.mood, entry.category, entry.topic, entry.body,
    entry.bean, entry.roaster, entry.machine, entry.grinder, entry.grind_setting, entry.notes,
    normalizeTags(entry.tags).join(" ")
  ];
  if (Array.isArray(entry.ingredients)) {
    parts.push(entry.ingredients.map(i => `${i.name} ${i.note} ${i.category}`).join(" "));
  }
  if (Array.isArray(entry.steps)) parts.push(entry.steps.join(" "));
  return parts.filter(Boolean).join(" ").toLowerCase().includes(q);
}

function cardImage(entry) {
  if (entry.cover_url) {
    return `<div class="entry-image" style="background-image:url('${esc(entry.cover_url)}')"></div>`;
  }
  return `<div class="entry-image generated" style="background:${recipeGradient(entry.title)}"><span>${esc(entry.title.slice(0, 1))}</span></div>`;
}

function renderRecipes(recipes) {
  const grid = document.getElementById("recipe-grid");
  if (!recipes.length) {
    grid.innerHTML = `<p class="muted empty-note">No recipes yet.</p>`;
    return;
  }
  grid.innerHTML = recipes.map(entry => `
    <a class="entry-card" href="./recipe.html?type=recipe&slug=${encodeURIComponent(entry.slug)}">
      ${cardImage(entry)}
      <div class="entry-card-body">
        <div class="card-kicker">${esc(entry.mood || entry.category || "recipe")}</div>
        <h3>${esc(entry.title)}</h3>
        <p>${esc(entry.intro || "")}</p>
        <div class="entry-meta">
          <span>${esc(formatDate(entry.date || entry.created_at))}</span>
          ${entry.rating ? starRating(entry.rating) : `<span>${esc(entry.cook_time || entry.prep_time || "")}</span>`}
        </div>
      </div>
    </a>
  `).join("");
}

function renderArchive(archive) {
  const grid = document.getElementById("archive-grid");
  if (!archive.length) {
    grid.innerHTML = `<p class="muted empty-note">No notes yet.</p>`;
    return;
  }
  grid.innerHTML = archive.map(entry => `
    <a class="entry-card archive-card" href="./recipe.html?type=archive&slug=${encodeURIComponent(entry.slug)}">
      ${cardImage(entry)}
      <div class="entry-card-body">
        <div class="card-kicker">${esc(entry.topic || entry.category || "archive")}</div>
        <h3>${esc(entry.title)}</h3>
        <p>${esc(entry.intro || entry.body || "")}</p>
        <div class="entry-meta">
          <span>${esc(formatDate(entry.date || entry.created_at))}</span>
          ${normalizeTags(entry.tags).slice(0, 2).map(tag => `<span>${esc(tag)}</span>`).join("")}
        </div>
      </div>
    </a>
  `).join("");
}

function renderChart(shots) {
  if (!shots.length) return `<div class="empty">No espresso data yet.</div>`;
  const width = 640;
  const height = 250;
  const pad = 34;
  const points = shots.map((shot, index) => {
    const x = shots.length === 1 ? width / 2 : pad + (index * (width - pad * 2)) / (shots.length - 1);
    const y = height - pad - (Number(shot.rating || 0) / 10) * (height - pad * 2);
    return { x, y, shot };
  });
  const path = points.map((point, index) => `${index ? "L" : "M"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");

  return `
    <svg viewBox="0 0 ${width} ${height}" aria-label="Espresso rating trend chart">
      <path class="chart-grid" d="M34 54 H606 M34 109 H606 M34 164 H606 M34 219 H606"/>
      <path class="chart-line" d="${path}"/>
      ${points.map(point => `
        <a href="./recipe.html?type=espresso&slug=${encodeURIComponent(point.shot.slug)}" aria-label="${esc(point.shot.title)}, rating ${esc(point.shot.rating)} of 10">
          <circle class="chart-hit" cx="${point.x}" cy="${point.y}" r="16"></circle>
          <circle class="chart-dot" cx="${point.x}" cy="${point.y}" r="6"><title>${esc(point.shot.title)}: ${esc(point.shot.rating)}/10</title></circle>
        </a>
      `).join("")}
    </svg>
  `;
}

function renderEspresso(entries, espresso) {
  const stats = espressoStats(entries);
  document.getElementById("avg-rating").textContent = `${stats.avgRating.toFixed(1)} avg`;
  document.getElementById("avg-time").textContent = `${Math.round(stats.avgTime)}s`;
  document.getElementById("avg-yield").textContent = `${stats.avgYield.toFixed(1)}g`;
  document.getElementById("best-shot").textContent = stats.best ? stats.best.title : "Best shot pending";
  document.getElementById("rating-chart").innerHTML = renderChart(stats.shots);
  const list = document.getElementById("espresso-list");
  if (!espresso.length) {
    list.innerHTML = `<p class="muted empty-note">No espresso logs yet.</p>`;
    return;
  }
  list.innerHTML = espresso.map(entry => `
    <a class="espresso-row" href="./recipe.html?type=espresso&slug=${encodeURIComponent(entry.slug)}">
      <div>
        <span class="date-chip">${esc(formatDate(entry.date || entry.created_at))}</span>
        <h3>${esc(entry.title)}</h3>
        <p>${esc(entry.intro || entry.notes || "")}</p>
      </div>
      <div class="shot-specs">
        <span>${esc(entry.dose_g)}g in</span>
        <span>${esc(entry.yield_g)}g out</span>
        <span>${esc(entry.time_s)}s</span>
        <strong>${esc(entry.rating)}/10</strong>
      </div>
    </a>
  `).join("");
}

// ---------------------------------------------------------------------------
// Search: one consolidated results grid instead of filtering the whole page
// ---------------------------------------------------------------------------
const typeLabel = entry =>
  entry.type === "recipe" ? "Cooked food" : entry.type === "espresso" ? "Espresso" : (entry.topic || "Archive");

function resultMeta(entry) {
  if (entry.type === "recipe") {
    return entry.rating ? starRating(entry.rating) : `<span>${esc(entry.cook_time || entry.prep_time || "")}</span>`;
  }
  if (entry.type === "espresso") {
    return `<span>${esc(entry.rating)}/10</span>`;
  }
  return normalizeTags(entry.tags).slice(0, 2).map(tag => `<span>${esc(tag)}</span>`).join("");
}

function resultCard(entry) {
  return `
    <a class="entry-card${entry.type === "archive" ? " archive-card" : ""}" href="./recipe.html?type=${entry.type}&slug=${encodeURIComponent(entry.slug)}">
      ${cardImage(entry)}
      <div class="entry-card-body">
        <div class="card-kicker">${esc(typeLabel(entry))}</div>
        <h3>${esc(entry.title)}</h3>
        <p>${esc(entry.intro || entry.notes || entry.body || "")}</p>
        <div class="entry-meta">
          <span>${esc(formatDate(entry.date || entry.created_at))}</span>
          ${resultMeta(entry)}
        </div>
      </div>
    </a>
  `;
}

function setSection(id, show) {
  const el = document.getElementById(id);
  if (el) el.hidden = !show;
}

function showNormalView() {
  document.getElementById("search-results").hidden = true;
  document.querySelector(".intro-grid").hidden = false;
  setSection("recipes", viewPrefs.recipe);
  setSection("espresso", viewPrefs.espresso);
  setSection("archive", viewPrefs.archive);
}

function showSearchView(query, results) {
  document.querySelector(".intro-grid").hidden = true;
  setSection("recipes", false);
  setSection("espresso", false);
  setSection("archive", false);

  const section = document.getElementById("search-results");
  section.hidden = false;
  document.getElementById("results-title").textContent =
    `${results.length} result${results.length === 1 ? "" : "s"} for “${query}”`;
  document.getElementById("results-grid").innerHTML = results.length
    ? results.map(resultCard).join("")
    : `<p class="muted empty-note">No entries match “${esc(query)}”. Try a different word or tag.</p>`;
}

function applyFilter(rawQuery) {
  const query = rawQuery.trim();
  const summary = document.getElementById("search-summary");
  if (!query) {
    showNormalView();
    if (summary) summary.textContent = "";
    return;
  }
  const q = query.toLowerCase();
  const results = allEntries
    .filter(entry => matchesQuery(entry, q))
    .sort((a, b) => new Date(b.date || b.created_at || 0) - new Date(a.date || a.created_at || 0));
  showSearchView(query, results);
  if (summary) summary.textContent = `${results.length} result${results.length === 1 ? "" : "s"}`;
}

async function render() {
  const [entries, prefs] = await Promise.all([loadEntries("public"), loadViewPrefs()]);
  allEntries = entries;
  viewPrefs = prefs;
  allRecipes = entries.filter(entry => entry.type === "recipe");
  allEspresso = entries.filter(entry => entry.type === "espresso");
  allArchive = entries.filter(entry => entry.type === "archive");

  renderRecipes(allRecipes);
  renderEspresso(allEntries, allEspresso);
  renderArchive(allArchive);
  showNormalView();

  const search = document.getElementById("site-search");
  if (search) {
    search.addEventListener("input", () => applyFilter(search.value));
  }
}

render();
