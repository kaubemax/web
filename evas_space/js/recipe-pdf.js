// ---------------------------------------------------------------------------
// Recipe -> PDF (client-side, one-click download)
// ---------------------------------------------------------------------------
// Renders a single recipe entry into a bespoke, A4-proportioned "recipe card"
// that matches Eva's Space styling, then rasterises it to a downloadable PDF
// with html2pdf.js. Everything happens in the browser: no data leaves the
// page, and it reuses the site's already-loaded self-hosted fonts.
// ---------------------------------------------------------------------------
import html2canvas from "https://esm.sh/html2canvas@1.4.1";
import { jsPDF } from "https://esm.sh/jspdf@2.5.2";
import {
  esc,
  formatDate,
  formatIngredient,
  normalizeIngredients,
  normalizeSteps,
  recipeGradient,
  starRating
} from "./client.js";

// Resolve the site favicon relative to wherever the page lives.
function brandIconUrl() {
  return new URL("./favicon-96.png", document.baseURI).href;
}

function coverBlock(item) {
  if (item.cover_url) {
    return `<div class="pdf-cover">
              <img src="${esc(item.cover_url)}" crossorigin="anonymous" alt="">
            </div>`;
  }
  return `<div class="pdf-cover pdf-cover--gradient" style="background:${recipeGradient(item.title)}">
            <span>${esc((item.title || "?").slice(0, 1))}</span>
          </div>`;
}

function cardMarkup(item) {
  const ingredients = normalizeIngredients(item.ingredients);
  const steps = normalizeSteps(item.steps);
  const meta = [
    item.category,
    item.servings && `Serves ${item.servings}`,
    item.prep_time && `Prep ${item.prep_time}`,
    item.cook_time && `Cook ${item.cook_time}`
  ]
    .filter(Boolean)
    .map(value => `<span>${esc(value)}</span>`)
    .join("<i>·</i>");

  return `
    <div class="pdf-page">
      <header class="pdf-head">
        <div class="pdf-brand">
          <img class="pdf-logo" src="${brandIconUrl()}" crossorigin="anonymous" alt="">
          <span class="pdf-brand-name">Eva's Space</span>
        </div>
        <p class="pdf-eyebrow">${esc(formatDate(item.date || item.created_at))}</p>
        <h1 class="pdf-title">${esc(item.title)}</h1>
        ${item.rating ? `<div class="pdf-stars">${starRating(item.rating)}</div>` : ""}
        ${meta ? `<div class="pdf-meta">${meta}</div>` : ""}
      </header>

      ${coverBlock(item)}

      ${item.intro ? `<p class="pdf-lead">${esc(item.intro)}</p>` : ""}

      <div class="pdf-body">
        <section class="pdf-ingredients">
          <h2>Ingredients</h2>
          <ul>
            ${ingredients.map(ing => `
              <li>
                <span class="pdf-ing-name">${esc(formatIngredient(ing))}</span>
                ${ing.category ? `<span class="pdf-ing-cat">${esc(ing.category)}</span>` : ""}
              </li>`).join("")}
          </ul>
        </section>
        <section class="pdf-method">
          <h2>Method</h2>
          <ol>
            ${steps.map(step => `<li><span class="pdf-method-text">${esc(step)}</span></li>`).join("")}
          </ol>
        </section>
      </div>

      <footer class="pdf-foot">
        <span>from Eva's Space</span>
        <span>kaubemax.de/evas_space</span>
      </footer>
    </div>`;
}

const CARD_STYLES = `
  .pdf-card {
    position: fixed; left: -10000px; top: 0;
    width: 760px; box-sizing: border-box;
    background: linear-gradient(135deg, #f7f2e9, #fdfaf4 48%, #eee4d6);
    color: #201d1b;
    font-family: "Inter", system-ui, sans-serif;
    font-size: 14px; line-height: 1.55;
  }
  .pdf-card * { box-sizing: border-box; }
  .pdf-page { padding: 52px 56px 44px; }
  .pdf-head { text-align: center; }
  /* Flex row keeps the logo glued to the wordmark and reliably centred. */
  .pdf-brand {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    font-family: "Instrument Serif", Georgia, serif; font-size: 21px;
    letter-spacing: .03em; color: #7c2835; line-height: 1;
  }
  .pdf-logo { display: block; width: 30px; height: 30px; }
  .pdf-eyebrow {
    margin: 22px 0 8px; text-transform: uppercase; letter-spacing: .24em;
    font-size: 11px; color: #b74353; font-weight: 600;
  }
  .pdf-title {
    margin: 0 auto; max-width: 92%;
    font-family: "Instrument Serif", Georgia, serif;
    font-weight: 400; font-size: 47px; line-height: 1.08; color: #201d1b;
  }
  .pdf-stars { margin-top: 12px; color: #b74353; font-size: 19px; letter-spacing: 3px; }
  .pdf-stars .star { color: #d8c7b4; }
  .pdf-stars .star.on { color: #b74353; }
  .pdf-meta {
    margin-top: 14px; font-size: 12.5px; color: #5b5048; line-height: 1;
  }
  .pdf-meta span { vertical-align: middle; }
  .pdf-meta i {
    font-style: normal; margin: 0 9px;
    color: #cdb39c; vertical-align: middle;
  }
  .pdf-cover {
    margin: 30px 0 0; height: 208px; border-radius: 16px; overflow: hidden;
    border: 1px solid rgba(124,40,53,.16);
  }
  .pdf-cover img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .pdf-cover--gradient { text-align: center; line-height: 208px; }
  .pdf-cover--gradient span {
    font-family: "Instrument Serif", Georgia, serif; font-size: 92px;
    color: rgba(255,255,255,.85); vertical-align: middle; line-height: 1;
  }
  .pdf-lead {
    margin: 26px auto 0; max-width: 78%; text-align: center;
    font-style: italic; font-size: 15px; line-height: 1.5; color: #4a4039;
  }
  .pdf-body {
    margin-top: 34px; display: flex; gap: 40px; align-items: flex-start;
  }
  .pdf-ingredients { flex: 0 0 37%; }
  .pdf-method { flex: 1; }
  .pdf-body h2 {
    font-family: "Instrument Serif", Georgia, serif; font-weight: 400;
    font-size: 23px; color: #7c2835; margin: 0 0 16px;
    padding-bottom: 9px; border-bottom: 1px solid rgba(124,40,53,.22);
  }
  .pdf-ingredients ul { list-style: none; margin: 0; padding: 0; }
  .pdf-ingredients li {
    padding: 8px 0; border-bottom: 1px dotted rgba(124,40,53,.2);
    break-inside: avoid;
  }
  .pdf-ingredients li:last-child { border-bottom: 0; }
  .pdf-ing-name { display: block; font-weight: 600; }
  .pdf-ing-cat {
    display: block; font-size: 10.5px; text-transform: uppercase;
    letter-spacing: .14em; color: #a3917f; margin-top: 3px;
  }
  .pdf-method ol { margin: 0; padding: 0; list-style: none; counter-reset: step; }
  .pdf-method li {
    display: flex; align-items: flex-start; gap: 14px;
    padding-bottom: 16px; break-inside: avoid; counter-increment: step;
  }
  .pdf-method li:last-child { padding-bottom: 0; }
  /* html2canvas renders text at the TOP of the line-box (it ignores
     line-height for vertical centring), so we centre the digit manually:
     line-height == font-size, then padding-top pushes it to the middle. */
  .pdf-method li::before {
    content: counter(step);
    flex: 0 0 27px; width: 27px; height: 27px; box-sizing: border-box;
    border-radius: 50%; background: #b74353;
    color: #fff; font-weight: 600; font-size: 13px;
    text-align: center; line-height: 13px; padding-top: 8px;
  }
  .pdf-method-text { display: block; padding-top: 3px; }
  .pdf-foot {
    margin-top: 34px; padding-top: 16px; border-top: 1px solid rgba(124,40,53,.2);
    display: flex; justify-content: space-between;
    font-size: 10.5px; letter-spacing: .1em; text-transform: uppercase;
    color: #a3917f;
  }`;

// Wait for an <img> inside the node to load (or fail) so html2canvas can paint it.
function waitForImages(node) {
  const imgs = [...node.querySelectorAll("img")];
  return Promise.all(imgs.map(img => (img.complete && img.naturalWidth)
    ? Promise.resolve()
    : new Promise(resolve => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", () => {
          // Cover failed (e.g. CORS) — drop it so generation still succeeds.
          img.closest(".pdf-cover")?.remove();
          resolve();
        }, { once: true });
      })));
}

// Build the detached, styled card node for a recipe (also used for previewing).
export function buildRecipeCard(entry) {
  const card = document.createElement("div");
  card.className = "pdf-card";
  const style = document.createElement("style");
  style.textContent = CARD_STYLES;
  card.appendChild(style);
  card.insertAdjacentHTML("beforeend", cardMarkup(entry));
  return card;
}

// Rasterise the card and lay it out across A4 pages, then trigger a download.
export async function downloadRecipePdf(entry) {
  if (!entry || entry.type !== "recipe") return;

  const card = buildRecipeCard(entry);
  document.body.appendChild(card);

  try {
    if (document.fonts?.ready) await document.fonts.ready;
    await waitForImages(card);

    const canvas = await html2canvas(card, {
      scale: 3,
      useCORS: true,
      backgroundColor: null,
      logging: false
    });

    // One page sized exactly to the card. A recipe card is a single visual unit,
    // so a content-height page avoids ugly mid-content cuts and blank trailing
    // pages — it just scales to fit when printed.
    const A4_W = 210; // mm
    const pageW = A4_W;
    const pageH = Math.max(1, (canvas.height * pageW) / canvas.width);
    const img = canvas.toDataURL("image/jpeg", 0.98);

    const pdf = new jsPDF({ unit: "mm", format: [pageW, pageH], orientation: "portrait" });
    pdf.addImage(img, "JPEG", 0, 0, pageW, pageH, undefined, "FAST");
    pdf.save(`${entry.slug || "recipe"}.pdf`);
  } finally {
    card.remove();
  }
}
