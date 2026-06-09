const svgNS = "http://www.w3.org/2000/svg";
const viewBoxWidth = 1600;
const waveDuration = 11;
const gridSize = 10;
const markSize = 9;

function waveNoise(seed, amount = 0.5) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return (value - Math.floor(value) - 0.5) * amount;
}

function snap(value) {
  return Math.round(value / gridSize) * gridSize;
}

function addStitch(stitches, x, y, colorClass, role) {
  stitches.push({
    x: snap(x),
    y: snap(y),
    c: `${colorClass} ${role}`
  });
}

function cubicPoint(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return {
    x: u ** 3 * p0.x + 3 * u ** 2 * t * p1.x + 3 * u * t ** 2 * p2.x + t ** 3 * p3.x,
    y: u ** 3 * p0.y + 3 * u ** 2 * t * p1.y + 3 * u * t ** 2 * p2.y + t ** 3 * p3.y
  };
}

function addStem(stitches, points, density = 25) {
  for (let i = 0; i <= density; i += 1) {
    const t = i / density;
    const point = cubicPoint(points[0], points[1], points[2], points[3], t);
    const color = i % 5 === 0 ? "leaf-sage" : i % 3 === 0 ? "leaf-olive" : "leaf-green";
    addStitch(stitches, point.x, point.y, color, "stem");
  }
}

function addLeaf(stitches, cx, cy, rx, ry, angleDeg, flip = 1) {
  const angle = angleDeg * Math.PI / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const step = gridSize;

  for (let y = -ry; y <= ry; y += step) {
    for (let x = -rx; x <= rx; x += step) {
      const ellipse = (x / rx) ** 2 + (y / ry) ** 2;
      if (ellipse > 1) continue;
      const taper = Math.abs(x / rx);
      if (Math.abs(y / ry) > 1 - taper * 0.32) continue;
      const px = cx + x * cos - y * sin;
      const py = cy + x * sin + y * cos;
      const edge = ellipse > 0.72;
      const mid = flip * y < 0;
      const color = edge ? "leaf-dark" : mid ? "leaf-sage" : "leaf-green";
      addStitch(stitches, px, py, color, "leaf");
    }
  }
}

function addRose(stitches, cx, cy, rx, ry, palette) {
  const step = gridSize;
  for (let y = -ry; y <= ry; y += step) {
    for (let x = -rx; x <= rx; x += step) {
      const nx = x / rx;
      const ny = y / ry;
      const radius = Math.sqrt(nx * nx + ny * ny);
      if (radius > 1) continue;

      const angle = Math.atan2(ny, nx);
      const spiral = Math.sin(angle * 3.2 + radius * 9.5);
      const petalCut = Math.sin(angle * 5.5 + radius * 4.2);
      if (radius > 0.86 && petalCut < -0.55) continue;

      let color = palette.mid;
      if (radius < 0.2 || spiral > 0.62) color = palette.dark;
      else if (spiral > 0.22 || nx < -0.28 && ny > -0.1) color = palette.shadow;
      else if (radius > 0.68 && (ny < -0.12 || nx > 0.2)) color = palette.light;
      else if (radius > 0.46 && spiral < -0.28) color = palette.highlight;
      addStitch(stitches, cx + x, cy + y, color, "flower");
    }
  }
}

function addBud(stitches, cx, cy, scale, palette) {
  addRose(stitches, cx, cy, 28 * scale, 38 * scale, palette);
  addLeaf(stitches, cx - 18 * scale, cy + 34 * scale, 22 * scale, 9 * scale, -32, -1);
  addLeaf(stitches, cx + 20 * scale, cy + 30 * scale, 20 * scale, 9 * scale, 35, 1);
}

function createArtwork() {
  const stitches = [];
  const pale = { dark: "rose-coral", shadow: "rose-pink", mid: "rose-blush", highlight: "rose-light", light: "rose-light" };
  const ruby = { dark: "rose-burgundy", shadow: "rose-dark", mid: "rose-red", highlight: "rose-coral", light: "rose-pink" };
  const deep = { dark: "rose-burgundy", shadow: "rose-dark", mid: "rose-red", highlight: "rose-coral", light: "rose-blush" };

  addStem(stitches, [{ x: 40, y: 355 }, { x: 360, y: 270 }, { x: 650, y: 380 }, { x: 980, y: 305 }], 58);
  addStem(stitches, [{ x: 580, y: 324 }, { x: 850, y: 240 }, { x: 1160, y: 360 }, { x: 1560, y: 265 }], 64);
  addStem(stitches, [{ x: 120, y: 390 }, { x: 450, y: 420 }, { x: 1040, y: 250 }, { x: 1510, y: 365 }], 72);

  [
    [310, 330, 58, 20, -25], [430, 255, 78, 24, 22], [610, 346, 68, 22, -38],
    [720, 285, 92, 28, 18], [880, 365, 78, 24, -25], [1040, 282, 88, 26, 34],
    [1190, 360, 74, 24, -22], [1350, 250, 86, 26, 24]
  ].forEach(([x, y, rx, ry, angle], index) => addLeaf(stitches, x, y, rx, ry, angle, index % 2 ? -1 : 1));

  addBud(stitches, 92, 315, 0.82, ruby);
  addRose(stitches, 320, 190, 124, 94, pale);
  addRose(stitches, 380, 340, 104, 78, ruby);
  addRose(stitches, 615, 360, 78, 58, pale);
  addBud(stitches, 705, 270, 0.65, ruby);
  addRose(stitches, 810, 250, 154, 112, deep);
  addBud(stitches, 935, 325, 0.72, pale);
  addRose(stitches, 1115, 365, 92, 68, pale);
  addRose(stitches, 1300, 190, 126, 92, ruby);
  addBud(stitches, 1510, 295, 0.78, ruby);

  const seen = new Set();
  return stitches.filter(stitch => {
    const key = `${stitch.x}:${stitch.y}:${stitch.c}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function createXMark({ x, y, c }) {
  const group = document.createElementNS(svgNS, "g");
  group.setAttribute("class", `xmark ${c}`);
  group.setAttribute("transform", `translate(${x} ${y})`);

  const lineA = document.createElementNS(svgNS, "line");
  lineA.setAttribute("x1", "0");
  lineA.setAttribute("y1", "0");
  lineA.setAttribute("x2", String(markSize));
  lineA.setAttribute("y2", String(markSize));

  const lineB = document.createElementNS(svgNS, "line");
  lineB.setAttribute("x1", String(markSize));
  lineB.setAttribute("y1", "0");
  lineB.setAttribute("x2", "0");
  lineB.setAttribute("y2", String(markSize));

  group.append(lineA, lineB);
  return group;
}

function setWaveDelay(mark) {
  const transform = mark.getAttribute("transform") || "";
  const match = transform.match(/translate\(([-\d.]+)[ ,]+([-\d.]+)\)/);
  if (!match) return;
  const x = Number(match[1]);
  const y = Number(match[2]);
  const normalizedX = x / viewBoxWidth;
  const verticalVariation = Math.sin(y * 0.035) * 0.55;
  const randomVariation = waveNoise(x * 0.23 + y * 0.71, 0.5);
  const delay = normalizedX * waveDuration + verticalVariation + randomVariation;
  mark.style.setProperty("--delay", `${(-delay).toFixed(2)}s`);
}

export function renderRoseBanner(root = document) {
  const layer = root.querySelector(".xmark-layer");
  if (!layer) return;

  const fragment = document.createDocumentFragment();
  createArtwork().forEach(stitch => {
    const mark = createXMark(stitch);
    setWaveDelay(mark);
    fragment.appendChild(mark);
  });
  layer.replaceChildren(fragment);
}
