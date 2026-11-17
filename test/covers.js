// Hand-drawn, game-specific cover art for the /test tiles.
//
// Every scene is a small flat-vector illustration of the game's actual subject
// (the bird and pipes, the cookie, the vault door), so a tile is recognisable
// without reading its title. Titles are laid over the art by the page, and the
// bottom of each cover stays comparatively calm so the text reads cleanly.

const WIDTH = 400;
const HEIGHT = 300;

let uid = 0;

const OUTLINE = "#0b0b12";

function round(value) {
  return Math.round(value * 10) / 10;
}

function slugKey(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function box(x, y, w, h, fill, rx = 0, extra = "") {
  return `<rect x="${round(x)}" y="${round(y)}" width="${round(w)}" height="${round(h)}" rx="${rx}" fill="${fill}" ${extra}/>`;
}

function circle(cx, cy, r, fill, extra = "") {
  return `<circle cx="${round(cx)}" cy="${round(cy)}" r="${round(r)}" fill="${fill}" ${extra}/>`;
}

function ellipse(cx, cy, rx, ry, fill, extra = "") {
  return `<ellipse cx="${round(cx)}" cy="${round(cy)}" rx="${round(rx)}" ry="${round(ry)}" fill="${fill}" ${extra}/>`;
}

function poly(points, fill, extra = "") {
  return `<polygon points="${points.map(([x, y]) => `${round(x)},${round(y)}`).join(" ")}" fill="${fill}" ${extra}/>`;
}

function path(d, fill, extra = "") {
  return `<path d="${d}" fill="${fill}" ${extra}/>`;
}

function line(d, color, width, extra = "") {
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" ${extra}/>`;
}

/** A simple stick figure; pose shifts the arms and legs. */
function stickman(x, y, scale, color = OUTLINE, pose = "run") {
  const s = scale;
  const head = `<circle cx="${round(x)}" cy="${round(y - 46 * s)}" r="${round(12 * s)}" fill="${color}"/>`;
  const body = line(`M${round(x)} ${round(y - 34 * s)} L${round(x)} ${round(y + 2 * s)}`, color, round(5 * s));
  const arms =
    pose === "run"
      ? line(`M${round(x)} ${round(y - 26 * s)} L${round(x - 22 * s)} ${round(y - 4 * s)} M${round(x)} ${round(y - 26 * s)} L${round(x + 22 * s)} ${round(y - 38 * s)}`, color, round(5 * s))
      : pose === "swing"
        ? line(`M${round(x)} ${round(y - 26 * s)} L${round(x - 16 * s)} ${round(y - 54 * s)} M${round(x)} ${round(y - 26 * s)} L${round(x + 16 * s)} ${round(y - 54 * s)}`, color, round(5 * s))
        : line(`M${round(x)} ${round(y - 22 * s)} L${round(x - 18 * s)} ${round(y + 4 * s)} M${round(x)} ${round(y - 22 * s)} L${round(x + 18 * s)} ${round(y + 4 * s)}`, color, round(5 * s));
  const legs =
    pose === "run"
      ? line(`M${round(x)} ${round(y + 2 * s)} L${round(x - 20 * s)} ${round(y + 34 * s)} M${round(x)} ${round(y + 2 * s)} L${round(x + 20 * s)} ${round(y + 30 * s)}`, color, round(5 * s))
      : line(`M${round(x)} ${round(y + 2 * s)} L${round(x - 14 * s)} ${round(y + 34 * s)} M${round(x)} ${round(y + 2 * s)} L${round(x + 14 * s)} ${round(y + 34 * s)}`, color, round(5 * s));
  return head + body + arms + legs;
}

function heart(cx, cy, size, fill) {
  return path(
    `M${cx} ${cy + size * 0.62} C ${cx - size * 1.15} ${cy - size * 0.2}, ${cx - size * 0.45} ${cy - size * 0.95}, ${cx} ${cy - size * 0.34} C ${cx + size * 0.45} ${cy - size * 0.95}, ${cx + size * 1.15} ${cy - size * 0.2}, ${cx} ${cy + size * 0.62} Z`,
    fill
  );
}

function star(cx, cy, size, fill, extra = "") {
  const points = [];
  for (let index = 0; index < 10; index += 1) {
    const radius = index % 2 ? size * 0.45 : size;
    const angle = (Math.PI / 5) * index - Math.PI / 2;
    points.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]);
  }
  return poly(points, fill, extra);
}

function cloud(x, y, scale, color) {
  return `<g opacity=".9">${circle(x, y, 18 * scale, color)}${circle(x + 20 * scale, y - 8 * scale, 22 * scale, color)}${circle(x + 44 * scale, y, 16 * scale, color)}${box(x - 14 * scale, y, 74 * scale, 16 * scale, color, 8 * scale)}</g>`;
}

function ground(y, fill, accent) {
  return `${box(0, y, WIDTH, HEIGHT - y, fill)}${accent ? `<path d="M0 ${y} Q 100 ${y - 22} 200 ${y} T 400 ${y} L400 ${y + 18} L0 ${y + 18} Z" fill="${accent}"/>` : ""}`;
}

// --- scenes ---------------------------------------------------------------

const SCENES = {
  bitlife: () => `
    ${box(0, 0, 400, 300, "#2a1d44")}
    ${circle(96, 70, 96, "#3b2a5e", 'opacity=".8"')}
    ${circle(318, 44, 64, "#4a2f72", 'opacity=".7"')}
    ${box(108, 118, 184, 148, "#f7f3ff", 16)}
    ${circle(200, 168, 44, "#f2c39b")}
    ${path("M156 168 q0 -52 44 -52 q44 0 44 52 q-12 -22 -44 -22 q-32 0 -44 22Z", "#3a2417")}
    ${circle(186, 166, 4.5, "#2a2118")}
    ${circle(214, 166, 4.5, "#2a2118")}
    ${path("M188 184 q12 10 24 0", "none", 'stroke="#b8675a" stroke-width="4" stroke-linecap="round"')}
    ${path("M152 266 q0 -44 48 -44 q48 0 48 44 Z", "#5b7cfa")}
    ${heart(330, 108, 26, "#ff4d6d")}
    ${box(268, 196, 106, 30, "#ffffff", 9)}
    ${box(276, 204, 40, 8, "#c9c4d8", 4)}
    ${box(276, 216, 72, 5, "#e2def0", 3)}
    ${box(268, 236, 106, 30, "#8b5cf6", 9)}
    ${box(276, 244, 52, 8, "#ffffff", 4, 'opacity=".85"')}
    ${box(276, 256, 70, 5, "#ffffff", 3, 'opacity=".5"')}
  `,

  "impossible-quiz": () => `
    ${box(0, 0, 400, 300, "#141024")}
    ${circle(300, 60, 120, "#2b1b52")}
    ${star(58, 62, 16, "#ffd84d", 'opacity=".8"')}
    ${star(344, 214, 12, "#ff7ad9", 'opacity=".7"')}
    ${ground(246, "#1d1330", "#241640")}
    ${circle(196, 128, 94, "#fde047")}
    ${circle(196, 128, 94, "none", 'stroke="#f59e0b" stroke-width="10"')}
    ${line("M156 104 q0 -36 40 -36 q40 0 40 36 q0 24 -29 35 q-11 4 -11 20", "#3b1d6e", 18)}
    ${circle(196, 190, 13, "#3b1d6e")}
    ${box(104, 212, 52, 24, "#22c55e", 8)}
    ${box(240, 212, 52, 24, "#ef4444", 8)}
    ${line("M116 216 l28 16 M144 216 l-28 16", "#052e16", 5)}
    ${star(330, 128, 16, "#f0abfc", 'opacity=".8"')}
  `,

  "run-3": () => `
    ${box(0, 0, 400, 300, "#070b1e")}
    ${circle(200, 150, 150, "#101a3d")}
    ${[132, 104, 76, 48].map((r, i) => `<circle cx="200" cy="150" r="${r}" fill="none" stroke="hsl(${196 + i * 24} 90% 62%)" stroke-width="${8 - i}" opacity="${0.55 - i * 0.08}"/>`).join("")}
    ${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${40 + i * 66}" cy="${54 + (i % 3) * 18}" r="2.5" fill="#cfe6ff" opacity=".7"/>`).join("")}
    ${circle(200, 150, 34, "#13224f")}
    ${path("M176 174 q24 -12 48 0 l0 18 q-24 8 -48 0 Z", "#1b2f6e")}
    ${stickman(206, 152, 1.25, "#7cf6d6", "run")}
    ${box(52, 236, 90, 10, "#2a3f8f", 5, 'transform="rotate(-14 97 241)"')}
    ${box(266, 62, 72, 10, "#2a3f8f", 5, 'transform="rotate(18 302 67)"')}
  `,

  "awsome-tanks": () => `
    ${box(0, 0, 400, 300, "#25130f")}
    ${circle(300, 70, 90, "#3c1d15")}
    ${ground(232, "#341a12", "#3f2015")}
    ${star(92, 96, 40, "#ffb648", 'opacity=".9"')}
    ${star(92, 96, 20, "#ffe6a3")}
    ${path("M118 232 l0 -34 q0 -12 12 -12 l96 0 q12 0 12 12 l0 34 Z", "#6f7f52")}
    ${path("M142 186 l0 -26 q0 -8 8 -8 l44 0 q8 0 8 8 l0 26 Z", "#7d8f5c")}
    ${box(190, 168, 96, 12, "#5b6a43", 6)}
    ${box(272, 160, 18, 28, "#4c5838", 4)}
    ${circle(142, 236, 15, "#2c3126")}
    ${circle(182, 236, 15, "#2c3126")}
    ${circle(222, 236, 15, "#2c3126")}
    ${circle(142, 236, 6, "#6f7f52")}
    ${circle(182, 236, 6, "#6f7f52")}
    ${circle(222, 236, 6, "#6f7f52")}
    ${box(300, 208, 62, 26, "#c2410c", 4)}
    ${poly([[300, 208], [362, 208], [342, 186], [318, 186]], "#f97316")}
    ${box(50, 258, 300, 6, "#1b0d09", 3, 'opacity=".8"')}
  `,

  "brawl-simulator-3d": () => `
    ${box(0, 0, 400, 300, "#170f2b")}
    ${circle(200, 150, 130, "#291849", 'opacity=".9"')}
    ${ground(238, "#221541", "#2c1b52")}
    ${box(74, 66, 112, 34, "#f472b6", 17, 'transform="rotate(18 130 83)"')}
    ${box(74, 66, 112, 34, "#f9a8d4", 17, 'transform="rotate(18 130 83)" opacity=".35"')}
    ${box(214, 62, 112, 34, "#38bdf8", 17, 'transform="rotate(-18 270 79)"')}
    ${box(214, 62, 112, 34, "#bae6fd", 17, 'transform="rotate(-18 270 79)" opacity=".4"')}
    ${star(200, 104, 54, "#fde047")}
    ${star(200, 104, 28, "#fff7cc")}
    ${circle(130, 196, 34, "#f9a8d4")}
    ${circle(270, 196, 34, "#7dd3fc")}
    ${box(96, 224, 68, 18, "#f472b6", 9)}
    ${box(236, 224, 68, 18, "#38bdf8", 9)}
    ${line("M18 274 L382 274", "#4c2f86", 4)}
  `,

  "retro-bowl": () => `
    ${box(0, 0, 400, 300, "#0f1f18")}
    ${box(0, 96, 400, 204, "#1d6b3d")}
    ${[0, 1, 2, 3, 4, 5].map((i) => box(i * 68, 96, 34, 204, "#217a45", 0, 'opacity=".55"')).join("")}
    ${[0, 1, 2, 3, 4, 5].map((i) => line(`M0 ${116 + i * 34} L400 ${116 + i * 34}`, "#e9f7ee", 2, 'opacity=".35"')).join("")}
    ${box(0, 96, 400, 6, "#0b3a22")}
    ${box(0, 88, 400, 8, "#e2e8f0", 0, 'opacity=".18"')}
    ${box(20, 30, 118, 46, "#0b1220", 8, 'stroke="#1f2937" stroke-width="3"')}
    ${box(32, 40, 94, 8, "#f59e0b", 4)}
    ${box(32, 56, 44, 8, "#38bdf8", 4)}
    ${box(84, 56, 42, 8, "#ef4444", 4)}
    ${ellipse(232, 176, 62, 38, "#a16207", 'transform="rotate(-16 232 176)"')}
    ${ellipse(232, 176, 62, 38, "none", 'stroke="#f8fafc" stroke-width="4" transform="rotate(-16 232 176)"')}
    ${line("M226 141 L238 211", "#f8fafc", 3, 'opacity=".9"')}
    ${[0, 1, 2].map((i) => box(218, 154 + i * 13, 28, 4, "#f8fafc", 2, 'transform="rotate(-16 232 176)"')).join("")}
    ${circle(120, 200, 16, "#fbbf24")}
    ${path("M104 210 q0 -22 16 -22 q16 0 16 22 Z", "#fbbf24")}
    ${line("M120 232 l-12 30 M120 232 l12 30", "#fbbf24", 6)}
    ${line("M120 214 l-20 10 M120 214 l18 -8", "#fbbf24", 6)}
    ${circle(304, 186, 16, "#e11d48")}
    ${path("M288 196 q0 -22 16 -22 q16 0 16 22 Z", "#e11d48")}
    ${line("M304 218 l-14 32 M304 218 l14 32", "#e11d48", 6)}
    ${line("M304 200 l-18 6 M304 200 l16 -12", "#e11d48", 6)}
    ${star(348, 52, 12, "#fde047", 'opacity=".8"')}
  `,

  "drive-mad": () => `
    ${box(0, 0, 400, 300, "#0b1630")}
    ${circle(316, 60, 52, "#fbbf24")}
    ${circle(316, 60, 84, "#fbbf24", 'opacity=".12"')}
    ${path("M0 232 Q 90 172 178 222 T 400 200 L400 300 L0 300 Z", "#16274f")}
    ${path("M0 258 Q 120 214 240 258 T 400 240 L400 300 L0 300 Z", "#122044")}
    ${[0, 1, 2, 3].map((i) => box(18 + i * 100, 266, 54, 6, "#64748b", 3, 'opacity=".45"')).join("")}
    ${box(76, 192, 132, 26, "#f97316", 8, 'transform="rotate(-18 142 205)"')}
    ${box(96, 168, 56, 26, "#fb923c", 8, 'transform="rotate(-18 124 181)"')}
    ${box(104, 176, 28, 14, "#bae6fd", 3, 'transform="rotate(-18 118 183)"')}
    ${circle(96, 222, 15, "#0f172a")}
    ${circle(176, 208, 15, "#0f172a")}
    ${circle(96, 222, 6, "#94a3b8")}
    ${circle(176, 208, 6, "#94a3b8")}
    ${line("M56 96 L122 96", "#38bdf8", 4, 'opacity=".45"')}
    ${line("M36 122 L94 122", "#38bdf8", 3, 'opacity=".3"')}
    ${poly([[250, 234], [334, 234], [302, 190], [272, 190]], "#1e3a5f")}
    ${line("M214 172 L266 152", "#fde68a", 4, 'stroke-dasharray="9 8"')}
    ${star(242, 88, 14, "#fde68a", 'opacity=".8"')}
  `,

  "monster-track": () => `
    ${box(0, 0, 400, 300, "#0f2418")}
    ${circle(318, 52, 42, "#fde047")}
    ${cloud(44, 44, 0.8, "#c7f9d4")}
    ${path("M0 212 Q 90 164 182 208 T 400 192 L400 300 L0 300 Z", "#2f5f3b")}
    ${path("M0 250 Q 120 222 240 256 T 400 242 L400 300 L0 300 Z", "#254d31")}
    ${box(136, 182, 136, 30, "#ea580c", 10)}
    ${box(156, 152, 78, 34, "#f97316", 10)}
    ${box(182, 158, 36, 18, "#bae6fd", 4)}
    ${box(136, 176, 136, 8, "#fdba74", 4, 'opacity=".55"')}
    ${[0, 1, 2].map((i) => `${circle(154 + i * 48, 212, 23, "#18181b")}${circle(154 + i * 48, 212, 9, "#a8a29e")}`).join("")}
    ${poly([[52, 234], [100, 234], [82, 172], [72, 172]], "#4d7c0f")}
    ${poly([[18, 234], [56, 234], [38, 194]], "#65a30d")}
    ${box(294, 144, 8, 58, "#4d7c0f", 4)}
    ${poly([[270, 152], [324, 152], [298, 112]], "#65a30d")}
  `,

  "monster-tracks-2": () => `
    ${box(0, 0, 400, 300, "#231437")}
    ${circle(84, 56, 48, "#f0abfc")}
    ${path("M0 226 Q 110 176 220 224 T 400 212 L400 300 L0 300 Z", "#4c1d95")}
    ${box(84, 178, 124, 28, "#22c55e", 9)}
    ${box(104, 150, 62, 30, "#4ade80", 9)}
    ${box(118, 156, 30, 16, "#e0f2fe", 4)}
    ${[0, 1].map((i) => `${circle(116 + i * 58, 206, 22, "#0f172a")}${circle(116 + i * 58, 206, 9, "#a3e635")}`).join("")}
    ${box(236, 166, 120, 28, "#f43f5e", 9)}
    ${box(254, 138, 58, 30, "#fb7185", 9)}
    ${box(266, 144, 28, 16, "#fdf2f8", 4)}
    ${[0, 1].map((i) => `${circle(266 + i * 56, 194, 22, "#0f172a")}${circle(266 + i * 56, 194, 9, "#fda4af")}`).join("")}
    ${poly([[352, 194], [386, 194], [366, 164]], "#a855f7")}
    ${star(214, 74, 14, "#fde047", 'opacity=".85"')}
    ${star(330, 100, 10, "#f0abfc", 'opacity=".7"')}
  `,

  "moto-x3m": () => `
    ${box(0, 0, 400, 300, "#2a1206")}
    ${circle(320, 66, 58, "#fb923c")}
    ${ground(248, "#3b1a09", "#4a210c")}
    ${poly([[210, 250], [372, 250], [352, 196], [286, 196]], "#7c2d12")}
    ${poly([[24, 250], [170, 250], [140, 208], [58, 208]], "#7c2d12")}
    ${circle(112, 208, 30, "#111827")}
    ${circle(238, 198, 30, "#111827")}
    ${circle(112, 208, 11, "#f97316")}
    ${circle(238, 198, 11, "#f97316")}
    ${path("M112 208 L168 168 L222 190 L238 198 L206 150 L142 156 Z", "#e2e8f0")}
    ${path("M168 168 L196 140 L216 146 L206 158 Z", "#f43f5e")}
    ${circle(206, 132, 12, "#fbbf24")}
    ${line("M70 176 L128 176", "#fdba74", 4, 'opacity=".5"')}
    ${poly([[60, 148], [96, 148], [78, 118]], "#fb923c", 'opacity=".7"')}
  `,

  "drift-boss": () => `
    ${box(0, 0, 400, 300, "#0b1a2b")}
    ${[0, 1, 2, 3, 4].map((i) => box(i * 82, 60 + (i % 2) * 22, 58, 70, "#122b45", 4)).join("")}
    ${circle(322, 52, 34, "#7dd3fc", 'opacity=".85"')}
    ${box(0, 190, 400, 110, "#0e2a3d")}
    ${line("M0 208 L400 208", "#38bdf8", 3, 'opacity=".45"')}
    ${line("M0 240 L400 240", "#38bdf8", 2, 'opacity=".22"')}
    ${path("M96 252 q40 -42 96 -8 q44 26 96 -14", "none", 'stroke="#fbbf24" stroke-width="8" stroke-dasharray="16 12" opacity=".65"')}
    ${box(112, 178, 132, 30, "#f43f5e", 9, 'transform="rotate(-12 178 193)"')}
    ${box(132, 148, 58, 30, "#fb7185", 9, 'transform="rotate(-12 161 163)"')}
    ${box(144, 156, 30, 16, "#bae6fd", 4, 'transform="rotate(-12 159 164)"')}
    ${circle(132, 210, 16, "#0f172a")}
    ${circle(220, 198, 16, "#0f172a")}
    ${circle(132, 210, 6, "#94a3b8")}
    ${circle(220, 198, 6, "#94a3b8")}
    ${poly([[272, 196], [306, 196], [289, 170]], "#f97316")}
    ${poly([[316, 214], [346, 214], [331, 192]], "#f97316")}
    ${line("M48 120 L112 120", "#38bdf8", 4, 'opacity=".4"')}
    ${line("M30 146 L92 146", "#38bdf8", 3, 'opacity=".28"')}
    ${star(70, 78, 12, "#fde68a", 'opacity=".7"')}
  `,

  "tunnel-rush": () => `
    ${box(0, 0, 400, 300, "#0a0a1f")}
    ${[150, 126, 102, 78, 54].map((r, i) => `<rect x="${200 - r}" y="${150 - r * 0.72}" width="${r * 2}" height="${r * 1.44}" rx="${18 - i * 2}" fill="none" stroke="hsl(${280 + i * 22} 95% 66%)" stroke-width="${10 - i}" opacity="${0.85 - i * 0.1}" transform="rotate(${i * 6} 200 150)"/>`).join("")}
    ${[0, 1, 2, 3, 4, 5].map((i) => line(`M${20 + i * 20} ${40 + (i % 2) * 12} L${60 + i * 20} ${40 + (i % 2) * 12}`, "#f0abfc", 3, 'opacity=".5"')).join("")}
    ${circle(196, 150, 26, "#fdf4ff")}
    ${circle(196, 150, 12, "#d946ef")}
    ${poly([[300, 236], [356, 236], [336, 206], [316, 206]], "#22d3ee")}
    ${line("M120 268 L280 268", "#a855f7", 4, 'stroke-dasharray="14 10" opacity=".6"')}
  `,

  ovo: () => `
    ${box(0, 0, 400, 300, "#0d1424")}
    ${[0, 1, 2, 3].map((i) => box(30 + i * 22, 190 - i * 22, 76, 10, "#233a5c", 5, `transform="rotate(${-12 + i * 6} ${68 + i * 22} ${190 - i * 22})"`)).join("")}
    ${box(240, 168, 94, 10, "#233a5c", 5, 'transform="rotate(10 287 173)"')}
    ${stickman(196, 176, 1.15, "#e2f3ff", "run")}
    ${line("M244 118 L292 150", "#38bdf8", 4, 'stroke-dasharray="9 8" opacity=".7"')}
    ${circle(300, 156, 10, "#38bdf8", 'opacity=".6"')}
    ${poly([[70, 236], [110, 236], [90, 208]], "#fbbf24")}
    ${poly([[300, 236], [348, 236], [324, 202]], "#fbbf24")}
    ${line("M0 250 L400 250", "#17e0c0", 3, 'opacity=".35"')}
  `,

  "stickman-hook": () => `
    ${box(0, 0, 400, 300, "#0c1524")}
    ${circle(330, 64, 60, "#1e3a5f")}
    ${path("M60 120 L120 88", "none", 'stroke="#94a3b8" stroke-width="5"')}
    ${line("M120 88 L206 86", "#e2e8f0", 3)}
    ${stickman(212, 150, 1.2, "#fbbf24", "swing")}
    ${line("M206 86 L212 96", "#e2e8f0", 3)}
    ${box(120, 84, 16, 8, "#64748b", 3)}
    ${box(0, 244, 400, 56, "#132033")}
    ${poly([[80, 244], [124, 244], [102, 216]], "#334155")}
    ${poly([[150, 244], [196, 244], [172, 210]], "#334155")}
    ${circle(300, 216, 14, "#22d3ee", 'opacity=".5"')}
    ${line("M266 196 q20 -14 40 0", "none", 'stroke="#38bdf8" stroke-width="4" opacity=".5"')}
  `,

  "doodle-jump": () => `
    ${box(0, 0, 400, 300, "#fdf6e3")}
    ${[0, 1, 2, 3].map((i) => box(24, 236 - i * 44, 74, 12, "#cbe7a5", 6, `transform="rotate(${i % 2 ? 4 : -4} 61 ${240 - i * 44})"`)).join("")}
    ${box(266, 204, 74, 12, "#bfe08f", 6, 'transform="rotate(5 303 210)"')}
    ${box(272, 132, 62, 12, "#bfe08f", 6, 'transform="rotate(-5 303 138)"')}
    ${box(150, 82, 60, 12, "#bfe08f", 6)}
    ${path("M126 230 L126 184 q0 -22 22 -22 l34 0 q22 0 22 22 l0 46 Z", "#8bc34a")}
    ${circle(136, 172, 9, "#ffffff")}
    ${circle(160, 172, 9, "#ffffff")}
    ${circle(139, 174, 4, "#1f2937")}
    ${circle(163, 174, 4, "#1f2937")}
    ${path("M138 190 q12 10 24 0", "none", 'stroke="#1f2937" stroke-width="4" stroke-linecap="round"')}
    ${line("M126 224 L108 244 M180 224 L198 244", "#4d7c0f", 7)}
    ${star(342, 70, 16, "#fbbf24")}
    ${star(40, 58, 12, "#fbbf24", 'opacity=".7"')}
    ${path("M228 60 q8 -10 16 0 q8 -10 16 0", "none", 'stroke="#94a3b8" stroke-width="4"')}
    ${line("M0 274 L400 274", "#b45309", 4, 'stroke-dasharray="14 10" opacity=".35"')}
  `,

  "flappy-bird": () => `
    ${box(0, 0, 400, 300, "#4ec0ca")}
    ${cloud(40, 52, 1, "#eafcff")}
    ${cloud(288, 78, 0.8, "#eafcff")}
    ${box(0, 254, 400, 46, "#ded895")}
    ${path("M0 254 Q 100 240 200 254 T 400 250 L400 262 L0 262 Z", "#7ec850")}
    ${box(268, 0, 74, 148, "#5fc93f", 0, 'stroke="#3f8f2b" stroke-width="6"')}
    ${box(258, 140, 94, 30, "#5fc93f", 6, 'stroke="#3f8f2b" stroke-width="6"')}
    ${box(268, 214, 74, 60, "#5fc93f", 0, 'stroke="#3f8f2b" stroke-width="6"')}
    ${box(258, 200, 94, 30, "#5fc93f", 6, 'stroke="#3f8f2b" stroke-width="6"')}
    ${path("M118 160 q-6 -34 32 -42 q44 -10 58 20 q8 18 -10 26 q-24 10 -50 6 q-24 -4 -30 -10Z", "#f6d365")}
    ${circle(186, 132, 16, "#ffffff")}
    ${circle(190, 132, 7, "#1f2937")}
    ${poly([[206, 138], [232, 146], [206, 152]], "#f97316")}
    ${path("M132 150 q-18 8 -24 -4 q14 -14 30 -8Z", "#fbbf24")}
    ${line("M158 196 L158 210", "#1f2937", 3, 'opacity=".3"')}
  `,

  "crossy-road": () => `
    ${box(0, 0, 400, 300, "#7fd1e8")}
    ${box(0, 206, 400, 94, "#3f3f46")}
    ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => box(i * 54 + 8, 248, 30, 6, "#fbbf24", 3)).join("")}
    ${box(0, 206, 400, 10, "#a1a1aa")}
    ${box(0, 292, 400, 8, "#a1a1aa")}
    ${box(250, 150, 108, 44, "#f472b6", 10)}
    ${box(266, 132, 62, 28, "#f9a8d4", 8)}
    ${circle(272, 198, 12, "#18181b")}
    ${circle(336, 198, 12, "#18181b")}
    ${box(60, 128, 96, 42, "#38bdf8", 10, 'transform="rotate(180 108 149)"')}
    ${box(76, 112, 52, 24, "#7dd3fc", 8)}
    ${circle(80, 176, 11, "#18181b")}
    ${circle(136, 176, 11, "#18181b")}
    ${path("M176 218 q10 -34 34 -34 q24 0 34 34 Z", "#ffffff")}
    ${circle(198, 186, 12, "#ffffff")}
    ${circle(222, 186, 12, "#ffffff")}
    ${circle(200, 184, 3.5, "#111827")}
    ${circle(224, 184, 3.5, "#111827")}
    ${poly([[210, 188], [220, 192], [210, 196]], "#f59e0b")}
    ${line("M214 200 L214 212", "#f59e0b", 4)}
  `,

  "tiny-fishing": () => `
    ${box(0, 0, 400, 300, "#0b3a5b")}
    ${box(0, 0, 400, 118, "#0e4a70")}
    ${circle(320, 46, 26, "#bae6fd", 'opacity=".75"')}
    ${path("M0 112 Q 60 96 120 112 T 240 110 T 400 104 L400 122 L0 122 Z", "#0d4266")}
    ${line("M96 6 L96 88", "#e2e8f0", 4)}
    ${line("M96 88 L186 162", "#e2e8f0", 4)}
    ${circle(188, 168, 7, "#f8fafc")}
    ${path("M188 172 q10 -4 12 6", "none", 'stroke="#94a3b8" stroke-width="3"')}
    ${path("M212 208 q44 -20 76 4 q-26 28 -68 16 Z", "#fbbf24")}
    ${circle(252, 216, 5, "#1f2937")}
    ${poly([[286, 212], [316, 200], [316, 226]], "#f59e0b")}
    ${path("M70 196 q38 -26 70 0 q-34 22 -70 0Z", "#22d3ee")}
    ${circle(90, 196, 4, "#0b3a5b")}
    ${path("M282 180 q34 -22 62 0 q-30 18 -62 0Z", "#38bdf8", 'opacity=".85"')}
    ${path("M46 236 q40 -24 74 0 q-36 22 -74 0Z", "#0ea5e9", 'opacity=".7"')}
    ${path("M150 262 q46 -24 84 0 q-40 22 -84 0Z", "#0284c7", 'opacity=".55"')}
    ${[0, 1, 2, 3].map((i) => `<circle cx="${60 + i * 92}" cy="${34 + (i % 2) * 20}" r="${4 + i}" fill="none" stroke="#7dd3fc" stroke-width="2" opacity=".35"/>`).join("")}
    ${line("M0 154 q54 -14 108 0 M240 140 q60 -16 120 0", "none", 'stroke="#38bdf8" stroke-width="3" opacity=".25"')}
  `,

  "cookie-clicker": () => `
    ${box(0, 0, 400, 300, "#2a1608")}
    ${circle(200, 150, 132, "#3d2410", 'opacity=".9"')}
    ${circle(200, 148, 96, "#d9a05b")}
    ${circle(200, 148, 96, "none", 'stroke="#a9743a" stroke-width="8"')}
    ${[[168, 116, 14], [232, 130, 12], [186, 176, 15], [238, 182, 10], [146, 158, 9], [214, 96, 8], [152, 200, 11], [252, 158, 7]]
      .map(([x, y, r]) => circle(x, y, r, "#4a2b12"))
      .join("")}
    ${star(314, 74, 18, "#fde68a")}
    ${star(78, 92, 12, "#fcd34d")}
    ${star(300, 216, 14, "#fbbf24")}
    ${circle(92, 214, 4, "#fde68a")}
    ${circle(330, 132, 3, "#fde68a")}
    ${box(120, 250, 160, 8, "#1c0f06", 4, 'opacity=".6"')}
  `,

  "2048": () => `
    ${box(0, 0, 400, 300, "#faf8ef")}
    ${box(84, 42, 232, 232, "#bbada0", 14)}
    ${[0, 1, 2, 3].map((row) =>
      [0, 1, 2, 3]
        .map((column) => {
          const values = [
            ["#eee4da", "#cdc1b4", "#f2b179", "#f59563"],
            ["#f2b179", "#edc22e", "#cdc1b4", "#eee4da"],
            ["#f59563", "#f2b179", "#edc22e", "#cdc1b4"],
            ["#edc22e", "#f2b179", "#eee4da", "#f59563"]
          ];
          const colors = values[row][column];
          return box(96 + column * 52, 54 + row * 52, 44, 44, colors, 6);
        })
        .join("")
    ).join("")}
    ${box(96, 158, 44, 44, "#edc22e", 6)}
    ${box(148, 54, 44, 44, "#f2b179", 6)}
    ${line("M96 214 L340 214", "#8f7a66", 4, 'opacity=".35"')}
    ${circle(64, 240, 10, "#8f7a66", 'opacity=".3"')}
  `,

  "super-smash-flash": () => `
    ${box(0, 0, 400, 300, "#120c2b")}
    ${circle(200, 150, 140, "#20134d", 'opacity=".9"')}
    ${[0, 1, 2, 3].map((i) => line(`M0 ${28 + i * 34} L400 ${8 + i * 34}`, "#7c3aed", 2, 'opacity=".25"')).join("")}
    ${poly([[52, 240], [348, 240], [318, 208], [82, 208]], "#3b2a6b")}
    ${poly([[82, 208], [318, 208], [318, 220], [82, 220]], "#2a1d52")}
    ${star(200, 120, 74, "#fbbf24", 'opacity=".95"')}
    ${star(200, 120, 40, "#fef3c7")}
    ${circle(126, 178, 22, "#f9a8d4")}
    ${path("M104 186 q0 -26 22 -26 q22 0 22 26 Z", "#ec4899")}
    ${line("M126 212 l-12 26 M126 212 l12 26", "#ec4899", 5)}
    ${circle(272, 178, 22, "#7dd3fc")}
    ${path("M250 186 q0 -26 22 -26 q22 0 22 26 Z", "#0ea5e9")}
    ${line("M272 212 l-12 26 M272 212 l12 26", "#0ea5e9", 5)}
    ${line("M148 160 L182 132", "#f9a8d4", 5)}
    ${line("M252 160 L218 132", "#7dd3fc", 5)}
    ${line("M40 268 L360 268", "#4c1d95", 4)}
  `,

  "super-mario-63": () => `
    ${box(0, 0, 400, 300, "#5c94fc")}
    ${cloud(40, 56, 1.1, "#ffffff")}
    ${cloud(280, 80, 0.9, "#ffffff")}
    ${box(0, 244, 400, 56, "#c84c0c")}
    ${path("M0 244 Q 60 214 120 244 T 240 244 T 400 240 L400 254 L0 254 Z", "#e07a2f")}
    ${box(60, 190, 60, 60, "#c84c0c", 4, 'stroke="#8f3608" stroke-width="4"')}
    ${box(70, 200, 40, 20, "#f4a261", 2)}
    ${path("M120 244 l0 -104 q0 -10 10 -10 l34 0 q10 0 10 10 l0 104 Z", "#f97316")}
    ${box(126, 150, 42, 12, "#fbbf24", 4)}
    ${circle(148, 122, 24, "#f2c39b")}
    ${path("M124 118 q0 -34 24 -34 q24 0 24 34 q-8 -12 -24 -12 q-16 0 -24 12Z", "#dc2626")}
    ${circle(140, 120, 3.5, "#1f2937")}
    ${circle(156, 120, 3.5, "#1f2937")}
    ${path("M124 100 q24 -14 48 0", "none", 'stroke="#dc2626" stroke-width="8" stroke-linecap="round"')}
    ${star(296, 132, 30, "#fde047")}
    ${circle(296, 132, 7, "#1f2937")}
  `,

  "fancy-pants-adventures": () => `
    ${box(0, 0, 400, 300, "#f6e3b8")}
    ${circle(300, 56, 44, "#fbbf24")}
    ${circle(300, 56, 72, "#fbbf24", 'opacity=".18"')}
    ${cloud(58, 48, 0.9, "#fffdf6")}
    ${cloud(214, 34, 0.6, "#fffdf6")}
    ${path("M0 206 Q 82 152 170 200 T 400 176 L400 300 L0 300 Z", "#dcb87e")}
    ${path("M0 250 Q 120 216 240 252 T 400 240 L400 300 L0 300 Z", "#c9a163")}
    ${box(262, 78, 12, 128, "#8b5e34", 5)}
    ${circle(268, 62, 34, "#3f8f4f")}
    ${circle(244, 78, 24, "#4aa35c")}
    ${circle(292, 78, 24, "#4aa35c")}
    ${box(18, 150, 78, 13, "#a16207", 5, 'transform="rotate(-4 57 156)"')}
    ${box(300, 190, 88, 13, "#a16207", 5, 'transform="rotate(6 344 196)"')}
    ${[0, 1, 2].map((i) => `<circle cx="${116 + i * 34}" cy="${128 - i * 16}" r="8" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>`).join("")}
    ${stickman(196, 132, 1.5, "#111827", "swing")}
    ${path("M168 134 L224 134 L220 172 L172 172 Z", "#f97316")}
    ${path("M170 134 L222 134 L220 144 L172 144 Z", "#fb923c")}
    ${line("M182 172 L166 214 M210 172 L226 214", "#111827", 8)}
    ${path("M228 82 q44 -12 50 30 q-30 10 -50 -30Z", "#111827")}
    ${circle(200, 92, 13, "#111827")}
    ${circle(206, 88, 4, "#f6e3b8")}
    ${poly([[248, 252], [288, 252], [268, 224]], "#8b5e34")}
    ${star(348, 116, 13, "#fbbf24")}
  `,

  "dad-n-me": () => `
    ${box(0, 0, 400, 300, "#1c2436")}
    ${circle(120, 64, 72, "#243049", 'opacity=".9"')}
    ${box(0, 232, 400, 68, "#151b28")}
    ${circle(140, 118, 30, "#f2c39b")}
    ${path("M112 116 q0 -30 28 -30 q28 0 28 30 q-10 -12 -28 -12 q-18 0 -28 12Z", "#3b2416")}
    ${circle(130, 118, 4, "#1f2937")}
    ${circle(150, 118, 4, "#1f2937")}
    ${path("M88 232 q4 -46 52 -46 q48 0 52 46Z", "#e11d48")}
    ${circle(258, 126, 26, "#fb923c")}
    ${circle(250, 124, 4, "#1f2937")}
    ${circle(266, 124, 4, "#1f2937")}
    ${path("M214 232 q4 -40 44 -40 q40 0 44 40Z", "#0ea5e9")}
    ${star(196, 148, 22, "#fde047")}
    ${line("M188 236 l-22 34 M204 236 l22 34", "none", 'stroke="#f2c39b" stroke-width="6" stroke-linecap="round"')}
    ${line("M300 236 l-18 32 M310 236 l18 32", "none", 'stroke="#fb923c" stroke-width="6" stroke-linecap="round"')}
  `,

  "portal-the-flash-version": () => `
    ${box(0, 0, 400, 300, "#1b2026")}
    ${box(0, 0, 400, 300, "#242a31", 0, 'opacity=".6"')}
    ${[0, 1, 2, 3].map((i) => box(0, 60 + i * 60, 400, 2, "#39424c", 0, 'opacity=".5"')).join("")}
    ${[0, 1, 2, 3, 4].map((i) => box(60 + i * 70, 0, 2, 300, "#39424c", 0, 'opacity=".4"')).join("")}
    ${ellipse(126, 148, 54, 68, "#f97316")}
    ${ellipse(126, 148, 40, 54, "#0b0f14")}
    ${ellipse(282, 148, 54, 68, "#38bdf8")}
    ${ellipse(282, 148, 40, 54, "#0b0f14")}
    ${box(168, 196, 62, 62, "#cbd5e1", 4, 'stroke="#94a3b8" stroke-width="4"')}
    ${box(178, 206, 42, 20, "#e2e8f0", 2)}
    ${circle(199, 232, 5, "#38bdf8")}
    ${box(70, 254, 260, 8, "#11161c", 4)}
    ${line("M150 108 L180 108", "#fbbf24", 3, 'stroke-dasharray="6 6" opacity=".7"')}
  `,
};

Object.assign(SCENES, {
  "henry-stickmin-escaping-the-prison": () => `
    ${box(0, 0, 400, 300, "#101a2e")}
    ${circle(304, 56, 42, "#f1f5f9")}
    ${circle(290, 46, 36, "#101a2e")}
    ${box(0, 0, 400, 300, "#16233c", 0, 'opacity=".55"')}
    ${[0, 1, 2, 3, 4].map((i) => box(28 + i * 74, 0, 16, 300, "#334155", 3)).join("")}
    ${box(0, 0, 400, 16, "#1f2d47")}
    ${box(0, 284, 400, 16, "#1f2d47")}
    ${stickman(196, 178, 1.2, "#e2e8f0", "idle")}
    ${box(288, 118, 46, 8, "#fbbf24", 3, 'transform="rotate(-12 311 122)"')}
    ${star(112, 84, 20, "#fde047", 'opacity=".8"')}
    ${line("M0 252 L400 252", "#475569", 3, 'opacity=".5"')}
  `,

  "henry-stickmin-breaking-the-bank": () => `
    ${box(0, 0, 400, 300, "#191521")}
    ${box(0, 0, 400, 300, "#241d33", 0, 'opacity=".7"')}
    ${circle(200, 142, 96, "#a3a3ad")}
    ${circle(200, 142, 96, "none", 'stroke="#6b6b76" stroke-width="10"')}
    ${circle(200, 142, 62, "#8b8b96")}
    ${circle(200, 142, 62, "none", 'stroke="#5b5b66" stroke-width="8"')}
    ${[0, 1, 2, 3].map((i) => line(`M200 142 L${200 + Math.cos((i * Math.PI) / 2 + 0.4) * 52} ${142 + Math.sin((i * Math.PI) / 2 + 0.4) * 52}`, "#5b5b66", 6)).join("")}
    ${circle(200, 142, 16, "#fbbf24")}
    ${box(150, 262, 100, 12, "#cbd5e1", 4)}
    ${box(160, 240, 26, 22, "#fbbf24", 3)}
    ${box(190, 244, 26, 18, "#f59e0b", 3)}
    ${box(220, 246, 22, 16, "#fbbf24", 3)}
    ${line("M28 78 L96 78 M28 78 L28 146", "#ef4444", 3, 'opacity=".7"')}
    ${line("M372 78 L304 78 M372 78 L372 146", "#ef4444", 3, 'opacity=".7"')}
    ${stickman(52, 250, 0.9, "#111827", "idle")}
  `,

  "stick-rpg": () => `
    ${box(0, 0, 400, 300, "#243b55")}
    ${path("M0 214 Q 100 186 200 212 T 400 204 L400 300 L0 300 Z", "#2f6b3f")}
    ${path("M0 250 Q 130 226 260 254 T 400 246 L400 300 L0 300 Z", "#275a35")}
    ${box(24, 24, 130, 12, "#111827", 6)}
    ${box(24, 24, 92, 12, "#ef4444", 6)}
    ${box(24, 44, 130, 8, "#111827", 4)}
    ${box(24, 44, 58, 8, "#38bdf8", 4)}
    ${stickman(150, 190, 1.1, "#f8fafc", "swing")}
    ${line("M188 142 L232 108", "#fbbf24", 6)}
    ${poly([[232, 108], [246, 96], [240, 114]], "#e2e8f0")}
    ${ellipse(272, 196, 38, 30, "#4ade80")}
    ${circle(260, 190, 6, "#052e16")}
    ${circle(284, 190, 6, "#052e16")}
    ${path("M262 206 q10 8 20 0", "none", 'stroke="#052e16" stroke-width="3"')}
    ${star(330, 76, 16, "#fde047")}
    ${circle(352, 128, 12, "#fde047", 'opacity=".5"')}
  `,

  "bloons-tower-defense-4": () => `
    ${box(0, 0, 400, 300, "#3a5a40")}
    ${path("M-10 260 Q 80 200 160 236 T 300 180 T 410 210", "none", 'stroke="#d6c79b" stroke-width="34" opacity=".85"')}
    ${path("M-10 260 Q 80 200 160 236 T 300 180 T 410 210", "none", 'stroke="#bfae7f" stroke-width="3" stroke-dasharray="10 10" opacity=".6"')}
    ${circle(96, 96, 34, "#ef4444")}
    ${circle(84, 86, 11, "#fca5a5", 'opacity=".7"')}
    ${circle(168, 78, 26, "#3b82f6")}
    ${circle(158, 70, 8, "#bfdbfe", 'opacity=".7"')}
    ${circle(238, 110, 20, "#22c55e")}
    ${circle(230, 104, 6, "#bbf7d0", 'opacity=".7"')}
    ${circle(276, 214, 26, "#fbbf24")}
    ${circle(268, 208, 8, "#fef3c7", 'opacity=".7"')}
    ${circle(150, 232, 30, "#f8fafc")}
    ${circle(142, 224, 8, "#d1d5db")
    }
    ${circle(158, 226, 6, "#d1d5db")}
    ${circle(148, 238, 4, "#1f2937")}
    ${circle(160, 238, 4, "#1f2937")}
    ${line("M180 220 L214 200", "#1f2937", 5)}
    ${poly([[214, 200], [232, 190], [222, 206]], "#fbbf24")}
    ${circle(64, 200, 14, "#14532d", 'opacity=".5"')}
  `,

  "bloons-super-monkey": () => `
    ${box(0, 0, 400, 300, "#1b3a4b")}
    ${circle(200, 146, 132, "#24506b", 'opacity=".8"')}
    ${circle(92, 52, 22, "#ef4444")}
    ${circle(146, 38, 16, "#3b82f6")}
    ${circle(276, 56, 20, "#22c55e")}
    ${circle(332, 38, 14, "#a855f7")}
    ${circle(58, 128, 14, "#fbbf24")}
    ${circle(348, 128, 12, "#f472b6")}
    ${path("M136 246 q-18 -92 64 -92 q82 0 64 92 Z", "#dc2626")}
    ${circle(200, 150, 52, "#8b5a2b")}
    ${circle(200, 150, 52, "none", 'stroke="#6b4423" stroke-width="4"')}
    ${ellipse(200, 158, 24, 17, "#d9a05b")}
    ${circle(182, 140, 7, "#111827")}
    ${circle(218, 140, 7, "#111827")}
    ${circle(202, 156, 4, "#4a2c12")}
    ${circle(198, 156, 4, "#4a2c12")}
    ${path("M182 170 q18 12 36 0", "none", 'stroke="#4a2c12" stroke-width="4" stroke-linecap="round"')}
    ${line("M156 200 L104 178", "#f8fafc", 7)}
    ${line("M244 200 L296 178", "#f8fafc", 7)}
    ${line("M102 178 L82 168", "#fbbf24", 5)}
    ${line("M298 178 L318 168", "#fbbf24", 5)}
    ${star(200, 236, 22, "#fde047")}
    ${star(262, 106, 12, "#fde047", 'opacity=".8"')}
  `,

  "the-worlds-hardest-game": () => `
    ${box(0, 0, 400, 300, "#0f1424")}
    ${box(0, 0, 400, 300, "#151c30", 0, 'opacity=".7"')}
    ${box(48, 48, 304, 206, "#1e2a44", 10)}
    ${box(74, 74, 60, 60, "#22c55e", 6)}
    ${box(266, 168, 60, 60, "#22c55e", 6)}
    ${[0, 1, 2, 3, 4].map((i) => `${circle(140 + (i % 2) * 90, 96 + i * 32, 13, "#38bdf8")}${circle(140 + (i % 2) * 90, 96 + i * 32, 5, "#0ea5e9")}`).join("")}
    ${box(196, 138, 22, 22, "#ef4444", 3)}
    ${box(150, 200, 22, 22, "#ef4444", 3, 'opacity=".55"')}
    ${line("M96 74 L96 120 M120 74 L120 108", "#fbbf24", 3, 'stroke-dasharray="6 5" opacity=".7"')}
    ${star(200, 30, 12, "#fde047", 'opacity=".7"')}
  `,

  "learn-to-fly": () => `
    ${box(0, 0, 400, 300, "#8ecae6")}
    ${circle(320, 56, 36, "#fde047")}
    ${cloud(36, 62, 0.9, "#ffffff")}
    ${cloud(230, 44, 0.7, "#ffffff")}
    ${box(0, 236, 400, 64, "#0e7490")}
    ${path("M0 236 Q 100 220 200 238 T 400 232 L400 248 L0 248 Z", "#67e8f9")}
    ${poly([[40, 236], [300, 236], [124, 150]], "#a5f3fc", 'opacity=".7"')}
    ${poly([[70, 236], [214, 236], [128, 128]], "#cffafe")}
    ${path("M126 132 q44 -16 62 8 q4 10 -10 12 l-44 0 q-16 -2 -8 -20Z", "#f97316")}
    ${circle(176, 138, 8, "#1f2937")}
    ${line("M126 140 L96 152", "#f97316", 5)}
    ${line("M188 144 L214 152", "#f97316", 5)}
    ${line("M20 60 L92 60 M10 84 L74 84", "#ffffff", 4, 'opacity=".55"')}
    ${poly([[300, 230], [316, 200], [332, 230]], "#ef4444")}
    ${line("M316 200 L316 168", "#111827", 3)}
  `,

  "papas-pizzeria": () => `
    ${box(0, 0, 400, 300, "#2b1a12")}
    ${box(0, 0, 400, 300, "#3a2417", 0, 'opacity=".6"')}
    ${box(0, 220, 400, 80, "#4a2c1a")}
    ${circle(196, 140, 96, "#f5c469")}
    ${circle(196, 140, 84, "#f2b544")}
    ${circle(196, 140, 84, "none", 'stroke="#d99429" stroke-width="6"')}
    ${[[160, 112, 12], [228, 118, 11], [186, 164, 12], [232, 172, 10], [146, 158, 9], [212, 92, 8], [156, 194, 10], [250, 148, 8]]
      .map(([x, y, r]) => circle(x, y, r, "#c2261f"))
      .join("")}
    ${[[180, 126, 8], [216, 148, 7], [172, 178, 7], [244, 108, 6]].map(([x, y, r]) => circle(x, y, r, "#2f6b3f")).join("")}
    ${box(268, 190, 108, 76, "#111827", 8)}
    ${box(280, 202, 84, 40, "#f97316", 6)}
    ${box(288, 246, 68, 10, "#fbbf24", 5)}
    ${box(52, 176, 66, 78, "#f8fafc", 6)}
    ${box(62, 190, 46, 6, "#94a3b8", 3)}
    ${box(62, 204, 34, 6, "#94a3b8", 3)}
    ${star(120, 84, 14, "#fbbf24")}
  `,

  bloxorz: () => `
    ${box(0, 0, 400, 300, "#131a2c")}
    ${circle(200, 158, 152, "#1c2740", 'opacity=".95"')}
    ${[0, 1, 2, 3].map((i) => line(`M0 ${38 + i * 40} L400 ${18 + i * 40}`, "#2b3f66", 2, 'opacity=".35"')).join("")}
    ${poly([[16, 206], [196, 206], [246, 178], [66, 178]], "#4b6489")}
    ${poly([[66, 178], [246, 178], [246, 198], [66, 198]], "#35496b")}
    ${poly([[196, 206], [246, 198], [246, 178], [196, 186]], "#2a3b57")}
    ${poly([[16, 206], [66, 198], [66, 178], [16, 186]], "#2a3b57")}
    ${poly([[262, 222], [392, 222], [392, 196], [262, 196]], "#3d5273")}
    ${poly([[262, 196], [392, 196], [392, 180], [262, 180]], "#54709a")}
    ${poly([[148, 74], [250, 74], [250, 130], [148, 130]], "#38bdf8")}
    ${poly([[148, 74], [198, 50], [300, 50], [250, 74]], "#9be3ff")}
    ${poly([[250, 74], [300, 50], [300, 106], [250, 130]], "#0ea5e9")}
    ${box(186, 92, 30, 20, "#e0f2fe", 3)}
    ${poly([[206, 202], [242, 202], [242, 168], [206, 168]], "#22c55e")}
    ${poly([[206, 168], [224, 158], [260, 158], [242, 168]], "#4ade80")}
    ${poly([[242, 168], [260, 158], [260, 192], [242, 202]], "#16a34a")}
    ${line("M170 216 L210 216 M170 234 L200 234", "#7f93b5", 4, 'opacity=".6"')}
    ${star(330, 108, 14, "#fbbf24", 'opacity=".85"')}
  `,

  "age-of-war": () => `
    ${box(0, 0, 400, 300, "#f4a261")}
    ${circle(306, 54, 42, "#fde047")}
    ${path("M0 204 Q 100 174 200 200 T 400 190 L400 300 L0 300 Z", "#8b5e34")}
    ${path("M0 248 Q 120 226 240 250 T 400 244 L400 300 L0 300 Z", "#6b4423")}
    ${stickman(132, 168, 1.35, "#3f2a1a", "swing")}
    ${line("M176 112 L226 48", "#7c2d12", 10)}
    ${ellipse(234, 36, 20, 26, "#9a3412")}
    ${box(250, 164, 122, 52, "#4b5563", 8)}
    ${box(266, 132, 64, 36, "#6b7280", 7)}
    ${box(280, 142, 36, 14, "#111827", 3)}
    ${box(364, 172, 32, 12, "#374151", 5)}
    ${[0, 1, 2].map((i) => `${circle(268 + i * 34, 222, 15, "#1f2937")}${circle(268 + i * 34, 222, 5, "#6b7280")}`).join("")}
    ${line("M250 182 L230 156", "#4b5563", 9)}
    ${poly([[50, 250], [96, 250], [72, 212]], "#a16207")}
    ${line("M198 136 q42 26 0 54", "none", 'stroke="#3f2a1a" stroke-width="4" stroke-dasharray="8 8" opacity=".45"')}
  `,

  "duck-life": () => `
    ${box(0, 0, 400, 300, "#6ec6e6")}
    ${cloud(60, 50, 0.9, "#ffffff")}
    ${box(0, 226, 400, 74, "#c2410c")}
    ${[0, 1, 2, 3, 4].map((i) => box(0, 240 + i * 14, 400, 3, "#f8fafc", 0, 'opacity=".25"')).join("")}
    ${ellipse(196, 200, 62, 44, "#fde047")}
    ${circle(238, 158, 30, "#fde047")}
    ${poly([[262, 158], [300, 166], [262, 176]], "#f97316")}
    ${circle(246, 148, 5, "#1f2937")}
    ${path("M150 196 q-18 -10 -26 4 q16 12 30 4Z", "#fbbf24")}
    ${line("M180 236 L172 258 M214 236 L222 258", "#f97316", 6)}
    ${box(74, 168, 16, 56, "#111827", 6)}
    ${box(60, 158, 44, 16, "#374151", 6)}
    ${circle(292, 118, 16, "#f8fafc", 'opacity=".8"')}
    ${line("M30 92 L84 92 M22 114 L70 114", "#ffffff", 4, 'opacity=".5"')}
  `,

  "duck-life-2-world-champion": () => `
    ${box(0, 0, 400, 300, "#2a1d44")}
    ${[0, 1, 2, 3].map((i) => line(`M${20 + i * 14} 40 L${40 + i * 14} 70`, "#fde047", 3, 'opacity=".35"')).join("")}
    ${box(146, 196, 108, 74, "#fbbf24", 6)}
    ${box(96, 216, 50, 54, "#94a3b8", 6)}
    ${box(254, 216, 50, 54, "#b45309", 6)}
    ${box(120, 268, 160, 12, "#111827", 4)}
    ${ellipse(200, 156, 44, 34, "#fde047")}
    ${circle(228, 124, 22, "#fde047")}
    ${poly([[246, 124], [276, 132], [246, 140]], "#f97316")}
    ${circle(234, 116, 4, "#1f2937")}
    ${circle(200, 168, 20, "none", 'stroke="#f59e0b" stroke-width="6"')}
    ${star(200, 168, 12, "#fbbf24")}
    ${star(160, 96, 14, "#fde047")}
    ${star(280, 84, 10, "#fde047")}
    ${circle(76, 148, 6, "#f472b6", 'opacity=".6"')}
  `,

  "riddle-school": () => `
    ${box(0, 0, 400, 300, "#1f3a2e")}
    ${box(24, 28, 352, 150, "#1e4d3a", 6, 'stroke="#8b5e34" stroke-width="6"')}
    ${path("M150 96 q0 -28 26 -28 q26 0 26 28 q0 18 -22 26 l0 16", "none", 'stroke="#e2e8f0" stroke-width="9" stroke-linecap="round"')}
    ${circle(176, 158, 7, "#e2e8f0")}
    ${box(0, 196, 400, 104, "#3f2a1a")}
    ${box(96, 200, 208, 72, "#8b5e34", 6)}
    ${box(112, 210, 176, 20, "#f8fafc", 4)}
    ${box(112, 238, 90, 10, "#cbd5e1", 3)}
    ${stickman(268, 176, 0.85, "#f8fafc", "swing")}
    ${line("M300 130 L336 96", "#fbbf24", 6)}
    ${star(344, 84, 14, "#fde047")}
    ${box(58, 212, 22, 16, "#ef4444", 3)}
  `,

  "riddle-school-3": () => `
    ${box(0, 0, 400, 300, "#14263a")}
    ${box(0, 0, 400, 220, "#1b3350")}
    ${[0, 1, 2, 3, 4].map((i) => `${box(18 + i * 74, 40, 58, 150, "#2b4a70", 5)}${box(34 + i * 74, 62, 26, 8, "#94a3b8", 4)}${circle(47 + i * 74, 130, 6, "#fbbf24")}`).join("")}
    ${box(0, 214, 400, 86, "#0e1b29")}
    ${box(0, 214, 400, 6, "#475569")}
    ${path("M150 214 l0 -70 q0 -10 10 -10 l80 0 q10 0 10 10 l0 70 Z", "#0b1220", 0, 'stroke="#475569" stroke-width="5"')}
    ${circle(286, 128, 8, "#fbbf24")}
    ${line("M296 128 L336 128", "#fbbf24", 5)}
    ${poly([[336, 128], [352, 118], [352, 138]], "#fbbf24")}
    ${stickman(96, 196, 0.9, "#e2e8f0", "idle")}
    ${star(56, 250, 12, "#38bdf8", 'opacity=".6"')}
  `,

  hexgl: () => `
    ${box(0, 0, 400, 300, "#05060f")}
    ${poly([[0, 300], [150, 150], [250, 150], [400, 300]], "#0b1024")}
    ${[0, 1, 2].map((i) => `<path d="M${120 - i * 26} 300 L${168 - i * 9} ${168 - i * 12} M${280 + i * 26} 300 L${232 + i * 9} ${168 - i * 12}" stroke="hsl(${190 + i * 30} 100% 62%)" stroke-width="4" opacity="${0.8 - i * 0.2}" fill="none"/>`).join("")}
    ${[0, 1, 2, 3].map((i) => line(`M0 ${180 + i * 34} L400 ${180 + i * 34}`, "#1e3a8a", 2, 'opacity=".5"')).join("")}
    ${poly([[150, 236], [250, 236], [230, 200], [170, 200]], "#22d3ee", 'opacity=".9"')}
    ${poly([[170, 200], [230, 200], [216, 182], [184, 182]], "#a5f3fc")}
    ${circle(200, 150, 26, "#f0abfc")}
    ${poly([[176, 150], [224, 150], [200, 118]], "#e879f9")}
    ${line("M200 148 L200 88", "#38bdf8", 4, 'opacity=".8"')}
    ${star(330, 66, 12, "#a5f3fc", 'opacity=".7"')}
  `,

  "cut-the-rope": () => `
    ${box(0, 0, 400, 300, "#2d8a4e")}
    ${circle(200, 170, 150, "#35a05c", 'opacity=".6"')}
    ${line("M120 20 L152 96", "#7c4a1e", 5)}
    ${line("M152 96 L196 132", "#7c4a1e", 5)}
    ${line("M196 132 L228 196", "#7c4a1e", 5)}
    ${box(224, 196, 26, 18, "#f472b6", 4)}
    ${box(230, 190, 14, 8, "#fbcfe8", 3)}
    ${path("M112 214 q0 -58 58 -58 q58 0 58 58 q0 44 -58 44 q-58 0 -58 -44Z", "#86efac")}
    ${path("M126 206 q0 -40 44 -40 q44 0 44 40 q0 32 -44 32 q-44 0 -44 -32Z", "#4ade80")}
    ${circle(158, 190, 12, "#ffffff")}
    ${circle(198, 190, 12, "#ffffff")}
    ${circle(160, 192, 6, "#1f2937")}
    ${circle(200, 192, 6, "#1f2937")}
    ${path("M170 216 q14 12 28 0", "none", 'stroke="#166534" stroke-width="5" stroke-linecap="round"')}
    ${star(302, 92, 16, "#fde047")}
    ${circle(66, 236, 8, "#fef3c7", 'opacity=".5"')}
  `,

  "geometry-dash": () => `
    ${box(0, 0, 400, 300, "#14102b")}
    ${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M0 ${40 + i * 30} L400 ${10 + i * 30}" stroke="hsl(${280 + i * 12} 90% 60%)" stroke-width="2" opacity=".28"/>`).join("")}
    ${box(0, 232, 400, 68, "#241a45")}
    ${[0, 1, 2, 3, 4, 5].map((i) => poly([[i * 70, 232], [i * 70 + 24, 200], [i * 70 + 48, 232]], "#7c3aed")).join("")}
    ${box(148, 168, 52, 52, "#fde047", 6, 'transform="rotate(14 174 194)"')}
    ${box(162, 182, 24, 24, "#fbbf24", 4, 'transform="rotate(14 174 194)"')}
    ${circle(174, 194, 6, "#fef3c7")}
    ${line("M40 150 L100 150 M20 176 L74 176", "#a78bfa", 4, 'opacity=".5"')}
    ${star(320, 76, 18, "#c4b5fd", 'opacity=".8"')}
    ${poly([[262, 196], [286, 196], [274, 174]], "#f472b6")}
  `,

  "basket-random": () => `
    ${box(0, 0, 400, 300, "#e2b98a")}
    ${box(0, 0, 400, 120, "#c89b6a")}
    ${box(0, 200, 400, 100, "#b8875a")}
    ${box(268, 64, 8, 90, "#94a3b8", 3)}
    ${box(258, 60, 92, 10, "#f8fafc", 4)}
    ${path("M252 74 L340 74 L322 122 L270 122 Z", "none", 'stroke="#f8fafc" stroke-width="3" opacity=".9"')}
    ${circle(186, 108, 30, "#f97316")}
    ${circle(186, 108, 30, "none", 'stroke="#7c2d12" stroke-width="4"')}
    ${line("M186 78 L186 138 M156 108 L216 108", "#7c2d12", 4)}
    ${stickman(118, 200, 1, "#1f2937", "swing")}
    ${stickman(238, 196, 1, "#7c2d12", "run")}
    ${line("M148 160 L186 128", "#1f2937", 3, 'stroke-dasharray="7 7" opacity=".6"')}
    ${star(60, 60, 12, "#fde047", 'opacity=".6"')}
  `,

  "basketball-stars": () => `
    ${box(0, 0, 400, 300, "#111827")}
    ${circle(200, 120, 150, "#1f2937", 'opacity=".9"')}
    ${box(0, 226, 400, 74, "#7c2d12")}
    ${line("M0 226 L400 226", "#fbbf24", 4, 'opacity=".4"')}
    ${box(238, 60, 8, 90, "#9ca3af", 3)}
    ${box(228, 56, 92, 10, "#f8fafc", 4)}
    ${path("M222 70 L326 70 L308 128 L240 128 Z", "none", 'stroke="#f8fafc" stroke-width="3"')}
    ${path("M240 70 L264 128 M300 70 L280 128 M222 96 L326 96", "none", 'stroke="#f8fafc" stroke-width="3"')}
    ${circle(196, 168, 34, "#f97316")}
    ${circle(196, 168, 34, "none", 'stroke="#7c2d12" stroke-width="4"')}
    ${line("M196 134 L196 202 M162 168 L230 168", "#7c2d12", 4)}
    ${stickman(120, 214, 1.15, "#f8fafc", "swing")}
    ${stickman(300, 210, 1.05, "#fbbf24", "run")}
    ${star(44, 60, 14, "#fde047", 'opacity=".7"')}
  `,

  "getaway-shootout": () => `
    ${box(0, 0, 400, 300, "#1a2233")}
    ${circle(320, 54, 40, "#fde68a", 'opacity=".8"')}
    ${box(0, 160, 150, 140, "#2b3648")}
    ${box(250, 186, 150, 114, "#2b3648")}
    ${box(0, 148, 160, 14, "#475569")}
    ${box(246, 174, 160, 14, "#475569")}
    ${stickman(96, 132, 1, "#f8fafc", "swing")}
    ${box(122, 138, 34, 7, "#fbbf24", 3)}
    ${stickman(292, 158, 1, "#f472b6", "swing")}
    ${box(240, 164, 34, 7, "#fbbf24", 3)}
    ${line("M150 78 L236 120", "#fde047", 3, 'stroke-dasharray="8 8" opacity=".7"')}
    ${circle(206, 96, 5, "#fde047", 'opacity=".8"')}
    ${box(150, 244, 106, 40, "#ef4444", 10)}
    ${box(168, 226, 54, 24, "#f87171", 8)}
    ${circle(174, 288, 12, "#111827")}
    ${circle(236, 288, 12, "#111827")}
  `,

  "bad-ice-cream": () => `
    ${box(0, 0, 400, 300, "#1c2b4a")}
    ${[0, 1, 2, 3, 4].map((i) => box(12 + i * 78, 226 + (i % 2) * 18, 62, 74, "#bfe6ff", 7, 'opacity=".9"')).join("")}
    ${[0, 1, 2, 3, 4].map((i) => box(12 + i * 78, 226 + (i % 2) * 18, 62, 9, "#f0f9ff", 4, 'opacity=".8"')).join("")}
    ${poly([[166, 106], [246, 106], [206, 226]], "#fcd9a8")}
    ${line("M182 142 L230 142 M188 170 L224 170", "none", 'stroke="#e0b071" stroke-width="4" opacity=".8"')}
    ${circle(184, 82, 34, "#f9a8d4")}
    ${circle(222, 82, 34, "#7dd3fc")}
    ${circle(203, 58, 32, "#fde047")}
    ${circle(203, 96, 8, "#7f1d1d")}
    ${path("M188 40 q16 10 32 0", "none", 'stroke="#fbbf24" stroke-width="5"')}
    ${circle(88, 138, 26, "#fbbf24")}
    ${circle(80, 130, 5, "#78350f")}
    ${circle(96, 130, 5, "#78350f")}
    ${circle(302, 148, 24, "#a78bfa")}
    ${circle(294, 140, 5, "#3b0764")}
    ${circle(310, 140, 5, "#3b0764")}
    ${star(336, 86, 14, "#fde047", 'opacity=".8"')}
  `,

  "iron-snout": () => `
    ${box(0, 0, 400, 300, "#2a1a3d")}
    ${circle(200, 150, 140, "#3a2453", 'opacity=".8"')}
    ${box(0, 236, 400, 64, "#1b1128")}
    ${circle(158, 160, 54, "#f9a8a8")}
    ${ellipse(158, 174, 28, 18, "#f472b6")}
    ${circle(146, 172, 4, "#7f1d1d")}
    ${circle(170, 172, 4, "#7f1d1d")}
    ${circle(142, 138, 5, "#1f2937")}
    ${circle(174, 138, 5, "#1f2937")}
    ${poly([[132, 118], [148, 104], [150, 122]], "#fbcfe8")}
    ${poly([[184, 118], [168, 104], [166, 122]], "#fbcfe8")}
    ${path("M104 208 q0 -30 54 -30 q54 0 54 30 Z", "#fda4af")}
    ${circle(232, 172, 34, "#94a3b8")}
    ${circle(248, 160, 6, "#111827")}
    ${circle(232, 160, 6, "#111827")}
    ${poly([[264, 176], [292, 186], [266, 192]], "#64748b")}
    ${circle(286, 210, 18, "#e2e8f0")}
    ${star(60, 84, 14, "#fde047", 'opacity=".7"')}
  `,

  "we-become-what-we-behold": () => `
    ${box(0, 0, 400, 300, "#d6d3d1")}
    ${box(0, 0, 400, 300, "#0f172a", 0, 'opacity=".08"')}
    ${box(0, 208, 400, 92, "#a8a29e")}
    ${box(96, 96, 208, 112, "#111827", 10)
    }
    ${box(112, 112, 176, 80, "#38bdf8", 6, 'opacity=".85"')}
    ${circle(200, 152, 22, "#f8fafc")}
    ${circle(200, 152, 10, "#0ea5e9")}
    ${box(140, 208, 120, 16, "#111827", 4)}
    ${box(178, 224, 44, 54, "#1f2937", 6)}
    ${stickman(80, 200, 0.95, "#111827", "swing")}
    ${stickman(320, 198, 0.95, "#111827", "idle")}
    ${box(286, 196, 34, 8, "#111827", 3)}
    ${star(56, 76, 14, "#f59e0b", 'opacity=".7"')}
  `,

  "happy-wheels": () => `
    ${box(0, 0, 400, 300, "#3b1f2b")}
    ${circle(320, 60, 42, "#fda4af", 'opacity=".5"')}
    ${path("M0 236 L120 236 L200 160 L400 190 L400 300 L0 300 Z", "#4b2233")}
    ${line("M200 160 L400 190", "#6b2f44", 4)}
    ${[0, 1, 2, 3].map((i) => poly([[240 + i * 36, 300], [258 + i * 36, 258], [276 + i * 36, 300]], "#cbd5e1")).join("")}
    ${circle(132, 212, 26, "#111827")}
    ${circle(200, 196, 18, "#111827")}
    ${circle(132, 212, 9, "#94a3b8")}
    ${circle(200, 196, 6, "#94a3b8")}
    ${line("M132 212 L170 190 L200 196", "#f8fafc", 5)}
    ${stickman(152, 158, 0.95, "#fbbf24", "swing")}
    ${circle(300, 122, 14, "#f87171", 'opacity=".6"')}
    ${circle(342, 150, 8, "#f87171", 'opacity=".5"')}
    ${line("M60 92 L110 92", "#fda4af", 4, 'opacity=".5"')}
  `,

  "duck-life-3-evolution": () => `
    ${box(0, 0, 400, 300, "#102a43")}
    ${circle(200, 150, 140, "#1c3d5a", 'opacity=".8"')}
    ${["#38bdf8", "#22d3ee", "#a5f3fc"].map((color, i) => `<path d="M${140 + i * 0} 60 q40 30 0 60 q-40 -30 0 -60" fill="none" stroke="${color}" stroke-width="5" opacity="${0.9 - i * 0.25}" transform="translate(${i * 40} ${i * 10})"/>`).join("")}
    ${ellipse(120, 214, 34, 26, "#fde047")}
    ${circle(142, 192, 18, "#fde047")}
    ${poly([[158, 192], [186, 198], [158, 204]], "#f97316")}
    ${line("M228 216 L200 200", "#22d3ee", 4, 'stroke-dasharray="8 7"')}
    ${ellipse(268, 210, 40, 30, "#4ade80")}
    ${circle(296, 184, 22, "#4ade80")}
    ${poly([[314, 184], [346, 190], [314, 198]], "#f59e0b")}
    ${circle(300, 178, 4, "#052e16")}
    ${star(60, 72, 14, "#fde047")}
    ${star(330, 96, 10, "#a5f3fc", 'opacity=".7"')}
  `,

  "vex-4": () => `
    ${box(0, 0, 400, 300, "#0d1b2a")}
    ${box(0, 0, 400, 300, "#132b3f", 0, 'opacity=".7"')}
    ${box(0, 226, 400, 74, "#0a1420")}
    ${box(48, 150, 108, 16, "#334155", 4, 'transform="rotate(-8 102 158)"')}
    ${box(238, 186, 128, 16, "#334155", 4, 'transform="rotate(6 302 194)"')}
    ${[0, 1, 2, 3, 4, 5].map((i) => poly([[160 + i * 24, 226], [172 + i * 24, 202], [184 + i * 24, 226]], "#7dd3fc")).join("")}
    ${stickman(200, 168, 1.05, "#f8fafc", "run")}
    ${line("M244 128 L280 128", "#38bdf8", 4, 'opacity=".6"')}
    ${line("M256 104 L296 104", "#38bdf8", 3, 'opacity=".4"')}
    ${star(60, 62, 12, "#fde047", 'opacity=".7"')}
    ${circle(330, 92, 18, "none", 'stroke="#f472b6" stroke-width="3" opacity=".6"')}
  `,
});

const FALLBACK = () => `
  ${box(0, 0, 400, 300, "#1a1a24")}
  ${ground(238, "#22222e", "#2a2a38")}
  ${star(200, 140, 46, "#3b3b52")}
  ${circle(200, 140, 18, "#4b4b66")}
`;

/** Return a self-contained cover illustration for a catalog entry. */
export function coverSvg(game) {
  uid += 1;
  const key = slugKey(game && game.name);
  const scene = SCENES[key] || FALLBACK;
  const id = `cover-${uid}`;
  return `<svg viewBox="0 0 ${WIDTH} ${HEIGHT}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="presentation" focusable="false">
    <defs>
      <linearGradient id="${id}-shade" x1="0" y1="0" x2="0" y2="1">
        <stop offset=".55" stop-color="#000000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000000" stop-opacity=".38"/>
      </linearGradient>
    </defs>
    ${scene()}
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#${id}-shade)"/>
  </svg>`;
}

export { SCENES, slugKey };
