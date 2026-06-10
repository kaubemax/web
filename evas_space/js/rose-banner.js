// Digital cross-rose banner: roses, buds, leaves and a vine drawn as a grid of
// crisp X marks. The crosses are static; a single light band sweeps across them
// (.rose-x-banner__glow in style.css) to make the colour bloom — so the effect
// costs one animated element no matter how many crosses there are. Generated as
// SVG so it stays sharp at any size.

const svgNS = "http://www.w3.org/2000/svg";
const W = 1600;
const H = 500;
const STEP = 10;
const X_SIZE = 8;

function snap(value) {
  return Math.round(value / STEP) * STEP;
}

function addMark(marks, x, y, cls, small = false) {
  marks.push({ x: snap(x), y: snap(y), cls, small });
}

function addRose(marks, cx, cy, rx, ry, palette, angle = 0) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const last = palette.length - 1;  // palette runs dark[0] -> light[last]
  const RINGS = 3;                  // concentric petal layers (fewer = bolder petals)
  const PETALS = 5;                 // petals around each layer

  for (let x = -rx; x <= rx; x += STEP) {
    for (let y = -ry; y <= ry; y += STEP) {
      const nx = x / rx;
      const ny = y / ry;
      const r = Math.hypot(nx, ny);
      if (r > 1) continue;

      const theta = Math.atan2(ny, nx);
      const ringPos = r * RINGS;
      const ring = Math.min(RINGS - 1, Math.floor(ringPos));
      const ringFrac = ringPos - ring;                   // 0 petal base .. 1 tip

      // Each layer is rotated half a petal from the last, so petals interleave
      // like a real rose rather than lining up into spokes.
      const rot = ring * (Math.PI / PETALS);
      const scallop = Math.cos((theta + rot) * PETALS);  // +1 face .. -1 crease

      // Scalloped flower silhouette, aligned to the outermost layer.
      const outerRot = (RINGS - 1) * (Math.PI / PETALS);
      const edge = 0.86 + 0.14 * Math.cos((theta + outerRot) * PETALS);
      if (r > edge) continue;

      let idx;
      if (r < 0.2) {
        // Rolled bud swirl at the heart.
        idx = Math.sin(theta * 2 + r * 20) < -0.25 ? 1 : 0;
      } else {
        // Rolled petals: each layer runs dark at its base to light at its tip
        // (heavy ringFrac weight = bold concentric petals), with the creases
        // between petals deepened for clean separation.
        const face = (scallop + 1) / 2;
        let tone = 0.02 + 0.3 * r + 0.5 * ringFrac + 0.22 * face;
        if (scallop < -0.6) tone -= 0.22;
        idx = Math.min(last, Math.max(0, Math.floor(tone * palette.length)));
      }

      const xr = x * cos - y * sin;
      const yr = x * sin + y * cos;
      addMark(marks, cx + xr, cy + yr, `${palette[idx]} flower`);
    }
  }
}

function addLeaf(marks, cx, cy, length, width, angle = 0) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  for (let x = -length / 2; x <= length / 2; x += STEP) {
    for (let y = -width / 2; y <= width / 2; y += STEP) {
      const nx = x / (length / 2);
      const maxY = (1 - Math.abs(nx)) * width / 2;
      if (Math.abs(y) > maxY) continue;
      if (Math.random() < 0.08) continue;
      const xr = x * cos - y * sin;
      const yr = x * sin + y * cos;
      const edge = Math.abs(y) / Math.max(maxY, 1);
      const cls = edge > 0.55 ? "leaf-dark leaf" : x > 0 ? "leaf-sage leaf" : "leaf-olive leaf";
      addMark(marks, cx + xr, cy + yr, cls, true);
    }
  }
}

function addStem(marks, points) {
  for (let i = 0; i < points.length - 1; i += 1) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const steps = Math.max(2, Math.floor(dist / STEP));
    for (let s = 0; s <= steps; s += 1) {
      const t = s / steps;
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t + Math.sin((i + t) * Math.PI) * 3;
      addMark(marks, x, y, (s + i) % 3 === 0 ? "leaf-dark stem" : "leaf-green stem", true);
    }
  }
}

function addBud(marks, cx, cy, angle = 0) {
  addLeaf(marks, cx - 14, cy + 24, 52, 24, angle + 0.8);
  addLeaf(marks, cx + 16, cy + 26, 54, 24, angle - 0.8);
  addRose(marks, cx, cy, 32, 54, ["rose-dark", "rose-red", "rose-coral", "rose-pink", "rose-light"], angle);
}

function buildArtwork() {
  const marks = [];

  // Main flowing vine and branching stems.
  addStem(marks, [[50, 335], [190, 285], [315, 350], [462, 295], [620, 345], [785, 320], [960, 355], [1110, 300], [1270, 345], [1450, 280], [1555, 345]]);
  addStem(marks, [[175, 285], [250, 175], [350, 260], [430, 190]]);
  addStem(marks, [[640, 345], [735, 240], [825, 320], [875, 245]]);
  addStem(marks, [[1110, 300], [1195, 235], [1305, 275], [1380, 175]]);
  addStem(marks, [[1450, 280], [1535, 190]]);

  // Roses and buds.
  addBud(marks, 63, 153, -0.45);
  addRose(marks, 282, 178, 126, 88, ["rose-dark", "rose-red", "rose-pink", "rose-blush", "rose-light"], -0.12);
  addRose(marks, 174, 346, 116, 82, ["rose-burgundy", "rose-dark", "rose-red", "rose-coral", "rose-blush"], 0.16);
  addRose(marks, 589, 370, 78, 62, ["rose-red", "rose-coral", "rose-pink", "rose-blush", "rose-light"], -0.05);
  addBud(marks, 585, 175, 0.05);
  addRose(marks, 800, 252, 152, 105, ["rose-burgundy", "rose-dark", "rose-red", "rose-coral", "rose-blush"], 0.03);
  addBud(marks, 960, 317, 0.22);
  addRose(marks, 1145, 344, 96, 76, ["rose-dark", "rose-red", "rose-coral", "rose-pink", "rose-light"], -0.08);
  addRose(marks, 1340, 185, 132, 92, ["rose-burgundy", "rose-dark", "rose-red", "rose-coral", "rose-blush"], 0.1);
  addBud(marks, 1532, 168, 0.55);

  // Leaves as a flowing modern vine.
  [
    [112, 280, 95, 42, -0.55], [360, 247, 92, 48, -1.02], [405, 318, 86, 42, 0.55], [468, 260, 82, 40, -0.18],
    [342, 409, 95, 42, -0.62], [456, 391, 60, 34, 1.0], [520, 284, 80, 40, 0.15],
    [905, 382, 92, 40, -0.15], [1014, 405, 66, 34, -0.68], [1015, 305, 78, 36, -0.92],
    [1080, 226, 86, 43, 0.43], [1183, 206, 80, 38, -1.16], [1205, 270, 82, 38, 0.3],
    [1258, 381, 66, 34, 1.02], [1328, 344, 70, 34, -1.14], [1395, 288, 90, 40, 0.42], [1480, 359, 92, 42, 0.42]
  ].forEach(args => addLeaf(marks, ...args));

  // Dedupe grid positions for a crisp digital result.
  const unique = new Map();
  marks.forEach(mark => {
    const key = `${mark.x},${mark.y}`;
    if (!unique.has(key)) unique.set(key, mark);
  });
  return [...unique.values()];
}

function createXMark({ x, y, cls, small }) {
  const group = document.createElementNS(svgNS, "g");
  group.setAttribute("class", `xmark ${cls}${small ? " small" : ""}`);
  group.setAttribute("transform", `translate(${x} ${y})`);

  const lineA = document.createElementNS(svgNS, "line");
  lineA.setAttribute("x1", "0");
  lineA.setAttribute("y1", "0");
  lineA.setAttribute("x2", String(X_SIZE));
  lineA.setAttribute("y2", String(X_SIZE));

  const lineB = document.createElementNS(svgNS, "line");
  lineB.setAttribute("x1", String(X_SIZE));
  lineB.setAttribute("y1", "0");
  lineB.setAttribute("x2", "0");
  lineB.setAttribute("y2", String(X_SIZE));

  group.append(lineA, lineB);
  // A touch of static opacity variation reads as hand-stitched thread; it costs
  // nothing because nothing here animates.
  group.style.opacity = (0.82 + Math.random() * 0.18).toFixed(2);
  return group;
}

export function renderRoseBanner(root = document) {
  const layer = root.querySelector(".xmark-layer");
  if (!layer) return;

  const fragment = document.createDocumentFragment();
  buildArtwork().forEach(mark => fragment.appendChild(createXMark(mark)));
  layer.replaceChildren(fragment);

  if (new URLSearchParams(location.search).has("tune")) {
    mountTuner(root.querySelector(".rose-x-banner"));
  }
}

// ---------------------------------------------------------------------------
// Live tuning panel — open the homepage with ?tune to dial in the bloom wave.
// Each slider just writes a CSS variable on the banner, so changes are instant
// and you can read off the final values to bake in.
// ---------------------------------------------------------------------------
const TUNER_CONTROLS = [
  { var: "--wave-dur", label: "Speed (cycle)", min: 4, max: 40, step: 0.5, unit: "s", value: 15 },
  { var: "--glow-strength", label: "Brightness", min: 0, max: 1, step: 0.01, unit: "", value: 0.85 },
  { var: "--band-1", label: "Band 1 width", min: 300, max: 2400, step: 20, unit: "px", value: 1100 },
  { var: "--band-2", label: "Band 2 width", min: 300, max: 2400, step: 20, unit: "px", value: 720 }
];

function mountTuner(banner) {
  if (!banner || document.getElementById("rose-tuner")) return;

  const panel = document.createElement("div");
  panel.id = "rose-tuner";
  panel.style.cssText = "position:fixed;top:16px;right:16px;z-index:9999;width:250px;" +
    "padding:14px 16px;border-radius:12px;background:rgba(28,20,16,.9);color:#fff;" +
    "font:13px/1.4 system-ui,sans-serif;box-shadow:0 12px 40px rgba(0,0,0,.35);backdrop-filter:blur(6px)";

  const title = document.createElement("strong");
  title.textContent = "Bloom wave";
  title.style.cssText = "display:block;margin-bottom:10px;font-size:14px";
  panel.appendChild(title);

  TUNER_CONTROLS.forEach(control => {
    const row = document.createElement("label");
    row.style.cssText = "display:block;margin:10px 0";

    const head = document.createElement("span");
    head.style.cssText = "display:flex;justify-content:space-between;margin-bottom:3px";
    const name = document.createElement("span");
    name.textContent = control.label;
    const out = document.createElement("span");
    out.style.opacity = ".75";
    out.textContent = control.value + control.unit;
    head.append(name, out);

    const input = document.createElement("input");
    input.type = "range";
    input.min = control.min;
    input.max = control.max;
    input.step = control.step;
    input.value = control.value;
    input.style.cssText = "width:100%;accent-color:#ff8f89";
    input.addEventListener("input", () => {
      const v = control.unit ? input.value + control.unit : input.value;
      banner.style.setProperty(control.var, v);
      out.textContent = v;
    });

    row.append(head, input);
    panel.appendChild(row);
  });

  const copy = document.createElement("button");
  copy.textContent = "Copy values";
  copy.style.cssText = "margin-top:8px;width:100%;padding:7px;border:0;border-radius:8px;" +
    "background:#ff8f89;color:#3a0d12;font-weight:600;cursor:pointer";
  copy.addEventListener("click", () => {
    const css = TUNER_CONTROLS
      .map(c => `  ${c.var}: ${banner.style.getPropertyValue(c.var) || (c.value + c.unit)};`)
      .join("\n");
    navigator.clipboard?.writeText(`.rose-x-banner {\n${css}\n}`);
    copy.textContent = "Copied!";
    setTimeout(() => { copy.textContent = "Copy values"; }, 1200);
  });
  panel.appendChild(copy);

  document.body.appendChild(panel);
}
