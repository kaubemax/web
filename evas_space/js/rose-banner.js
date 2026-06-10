// Digital cross-rose banner: roses, buds, leaves and a vine drawn as a grid of
// crisp X marks. A position-based delay makes a brightness wave roll across the
// crosses (see .xmark in style.css). Generated as SVG so it stays sharp at any
// size.

const svgNS = "http://www.w3.org/2000/svg";
const W = 1600;
const H = 500;
const STEP = 10;
const X_SIZE = 8;
const waveDuration = 8;

function setWaveDelay(el, x, y) {
  const normalizedX = x / W;
  const verticalVariation = Math.sin(y * 0.036) * 0.52;
  const organicOffset = Math.sin((x + y) * 0.019) * 0.24;
  const delay = normalizedX * waveDuration + verticalVariation + organicOffset;
  el.style.setProperty("--delay", `${delay.toFixed(2)}s`);
}

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
  const RINGS = 4;                  // concentric petal layers
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
      const edge = 0.88 + 0.12 * Math.cos((theta + outerRot) * PETALS);
      if (r > edge) continue;

      let idx;
      if (r < 0.2) {
        // Rolled bud swirl at the heart.
        idx = Math.sin(theta * 2 + r * 20) < -0.25 ? 1 : 0;
      } else {
        // Rolled petals: each layer runs dark at its base to light at its tip,
        // and the creases between petals are deepened for separation.
        const face = (scallop + 1) / 2;
        let tone = 0.04 + 0.34 * r + 0.32 * ringFrac + 0.26 * face;
        if (scallop < -0.55) tone -= 0.26;
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
  setWaveDelay(group, x, y);
  return group;
}

export function renderRoseBanner(root = document) {
  const layer = root.querySelector(".xmark-layer");
  if (!layer) return;

  const fragment = document.createDocumentFragment();
  buildArtwork().forEach(mark => fragment.appendChild(createXMark(mark)));
  layer.replaceChildren(fragment);
}
