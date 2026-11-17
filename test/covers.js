// Generated cover artwork for the /test tile experiment.
//
// Each game gets a deterministic abstract cover built from its name and
// category: a vivid gradient, a poster-style category motif, a dark foreground
// silhouette and a light sweep. The artwork fills any tile shape (the SVG is
// sliced), and the game title is laid over it in the page, so portrait and
// landscape tiles both read well.

const WIDTH = 400;
const HEIGHT = 300;

let uid = 0;

const CATEGORY_HUE = {
  driving: 208,
  action: 356,
  arcade: 278,
  puzzle: 192,
  sports: 138,
  casual: 44,
  adventure: 164,
  strategy: 232,
  skill: 322
};

function round(value) {
  return Math.round(value * 10) / 10;
}

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function makeRandom(seed) {
  let state = seed || 1;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

// Variant choice reads a different slice of the hash than the palette does,
// so colour and composition vary independently.
function pick(seed, index) {
  return ((seed >>> 11) ^ (index || 0)) % 2;
}

// Three- and four-way variant choice, mixed with the tile position so two
// neighbours never draw the same composition.
function variantOf(seed, index, count) {
  const mixed = ((seed >>> 9) ^ Math.imul((index || 0) + 1, 2654435761)) >>> 0;
  return mixed % count;
}

function paletteFor(game, seed, index) {
  const category = String(game.category || "").toLowerCase();
  const base = CATEGORY_HUE[category] ?? 210;
  // The golden-angle step means neighbouring tiles always land far apart on the
  // colour wheel, so the same motif never appears in the same colour twice.
  const golden = ((index || 0) * 137.508) % 360;
  const hue = Math.round((base * 0.34 + golden * 0.66 + (seed % 23)) % 360);
  return {
    accent: `hsl(${hue} 95% 62%)`,
    warm: `hsl(${(hue + 30) % 360} 96% 56%)`,
    cool: `hsl(${(hue + 164) % 360} 90% 68%)`,
    pale: `hsl(${(hue + 14) % 360} 88% 82%)`,
    gold: `hsl(${38 + (seed % 20)} 97% 61%)`,
    mid: `hsl(${(hue + 6) % 360} 74% 28%)`,
    deep: `hsl(${(hue + 20) % 360} 80% 10%)`,
    ink: `hsl(${(hue + 26) % 360} 82% 4%)`
  };
}

function starPoints(cx, cy, spikes, outer, inner) {
  const points = [];
  for (let index = 0; index < spikes * 2; index += 1) {
    const radius = index % 2 ? inner : outer;
    const angle = (Math.PI / spikes) * index - Math.PI / 2;
    points.push(`${round(cx + Math.cos(angle) * radius)},${round(cy + Math.sin(angle) * radius)}`);
  }
  return points.join(" ");
}

function dotField(color, random, opacity = 0.14, step = 28, radius = 2.1) {
  let out = "";
  for (let y = 18; y < HEIGHT; y += step) {
    for (let x = 16; x < WIDTH; x += step) {
      const jitter = random() * 6 - 3;
      out += `<circle cx="${round(x + jitter)}" cy="${round(y + jitter)}" r="${round(radius * (0.6 + random() * 0.8))}" fill="${color}" opacity="${opacity.toFixed(2)}"/>`;
    }
  }
  return out;
}

function speedLines(color, random) {
  let out = "";
  for (let index = 0; index < 5; index += 1) {
    out += `<rect x="${round(random() * 90)}" y="${round(18 + index * 20)}" width="${round(90 + random() * 120)}" height="${index % 2 ? 4 : 3}" rx="2" fill="${color}" opacity="${(0.42 - index * 0.06).toFixed(2)}"/>`;
  }
  return out;
}

function sparkle(cx, cy, size, color, opacity = 0.9) {
  const inner = size * 0.28;
  return `<path d="M${cx} ${cy - size} Q${round(cx + inner)} ${round(cy - inner)} ${cx + size} ${cy} Q${round(cx + inner)} ${round(cy + inner)} ${cx} ${cy + size} Q${round(cx - inner)} ${round(cy + inner)} ${cx - size} ${cy} Q${round(cx - inner)} ${round(cy - inner)} ${cx} ${cy - size} Z" fill="${color}" opacity="${opacity}"/>`;
}

function hexagon(cx, cy, radius) {
  const points = [];
  for (let index = 0; index < 6; index += 1) {
    const angle = (Math.PI / 3) * index - Math.PI / 6;
    points.push(`${round(cx + Math.cos(angle) * radius)},${round(cy + Math.sin(angle) * radius)}`);
  }
  return points.join(" ");
}

function face(cx, cy, size, color) {
  const eyeX = size * 0.34;
  const eyeY = -size * 0.16;
  const eyeR = size * 0.17;
  const pupilR = eyeR * 0.46;
  return `
    <circle cx="${round(cx - eyeX)}" cy="${round(cy + eyeY)}" r="${round(eyeR)}" fill="#ffffff" opacity=".95"/>
    <circle cx="${round(cx + eyeX)}" cy="${round(cy + eyeY)}" r="${round(eyeR)}" fill="#ffffff" opacity=".95"/>
    <circle cx="${round(cx - eyeX + pupilR * 0.2)}" cy="${round(cy + eyeY)}" r="${round(pupilR)}" fill="${color}"/>
    <circle cx="${round(cx + eyeX + pupilR * 0.2)}" cy="${round(cy + eyeY)}" r="${round(pupilR)}" fill="${color}"/>
    <path d="M${round(cx - size * 0.26)} ${round(cy + size * 0.2)} q${round(size * 0.26)} ${round(size * 0.22)} ${round(size * 0.52)} 0" fill="none" stroke="${color}" stroke-width="${round(size * 0.055)}" stroke-linecap="round"/>
  `;
}

function stickers(c, random) {
  let out = "";
  for (let index = 0; index < 4; index += 1) {
    const x = round(18 + random() * 364);
    const y = round(14 + random() * 150);
    const color = [c.accent, c.warm, c.cool, c.gold][Math.floor(random() * 4)];
    const kind = Math.floor(random() * 3);
    if (kind === 0) {
      out += `<circle cx="${x}" cy="${y}" r="${round(3 + random() * 5)}" fill="#ffffff" opacity=".5"/>`;
    } else if (kind === 1) {
      out += `<rect x="${x}" y="${y}" width="${round(8 + random() * 12)}" height="${round(3 + random() * 4)}" rx="2" fill="${color}" opacity=".7" transform="rotate(${round(random() * 180 - 90)} ${x} ${y})"/>`;
    } else {
      out += sparkle(x, y, round(6 + random() * 7), "#ffffff", 0.62);
    }
  }
  return out;
}

function ground(color, opacity = 0.85) {
  return `<path d="M0 300 L0 258 Q104 242 214 252 T400 244 L400 300 Z" fill="${color}" opacity="${opacity}"/>`;
}

function confetti(c, random, count = 7) {
  let out = "";
  for (let index = 0; index < count; index += 1) {
    const x = round(24 + random() * 350);
    const y = round(24 + random() * 210);
    const color = [c.accent, c.warm, c.cool, c.gold][index % 4];
    out += `<rect x="${x}" y="${y}" width="${round(7 + random() * 11)}" height="${round(3 + random() * 4)}" rx="1.5" fill="${color}" opacity="${(0.55 + random() * 0.35).toFixed(2)}" transform="rotate(${round(random() * 180 - 90)} ${x} ${y})"/>`;
  }
  return out;
}

// --- driving -------------------------------------------------------------

function roadCover(c, random) {
  const sunX = round(244 + random() * 128);
  const sunY = round(52 + random() * 58);
  const sunR = round(34 + random() * 34);
  const horizon = round(142 + random() * 44);
  const centerX = round(176 + random() * 56);
  const topHalf = round(16 + random() * 14);
  const bottomHalf = round(74 + random() * 46);
  const laneCount = 4 + Math.floor(random() * 3);

  let peaks = "";
  for (let index = 0; index < 3; index += 1) {
    const px = round(-30 + index * 150 + random() * 60);
    const width = round(80 + random() * 90);
    const height = round(36 + random() * 74);
    peaks += `<path d="M${round(px - width)} ${horizon} L${px} ${round(horizon - height)} L${round(px + width)} ${horizon} Z" fill="${c.ink}" opacity="${(0.3 + random() * 0.32).toFixed(2)}"/>`;
  }

  let lanes = "";
  for (let index = 0; index < laneCount; index += 1) {
    const t = index / laneCount;
    const y = round(horizon + 14 + t * (300 - horizon - 14));
    const width = round(4 + t * 14);
    lanes += `<rect x="${round(centerX - width / 2)}" y="${y}" width="${width}" height="${round(9 + t * 20)}" rx="2" fill="${c.gold}" opacity="${(0.9 - t * 0.25).toFixed(2)}"/>`;
  }

  const carY = round(238 + random() * 24);
  const carX = round(centerX + random() * 26 - 13);
  const car =
    random() > 0.4
      ? `<g opacity=".9">
        <rect x="${round(carX - 33)}" y="${round(carY - 6)}" width="66" height="24" rx="8" fill="${c.cool}"/>
        <rect x="${round(carX - 21)}" y="${round(carY - 20)}" width="42" height="18" rx="7" fill="${c.cool}"/>
        <rect x="${round(carX - 17)}" y="${round(carY - 16)}" width="34" height="11" rx="4" fill="${c.ink}" opacity=".5"/>
        <circle cx="${round(carX - 19)}" cy="${round(carY + 19)}" r="7" fill="${c.ink}"/>
        <circle cx="${round(carX + 19)}" cy="${round(carY + 19)}" r="7" fill="${c.ink}"/>
      </g>`
      : "";

  return `
    <circle cx="${sunX}" cy="${sunY}" r="${sunR}" fill="${c.gold}" opacity=".95"/>
    <circle cx="${sunX}" cy="${sunY}" r="${round(sunR * 1.4)}" fill="none" stroke="${c.gold}" stroke-width="3" opacity=".26"/>
    ${peaks}
    <path d="M${round(centerX - bottomHalf)} 300 L${round(centerX + bottomHalf)} 300 L${round(centerX + topHalf)} ${horizon} L${round(centerX - topHalf)} ${horizon} Z" fill="${c.ink}" opacity=".9"/>
    ${lanes}
    <path d="M${round(centerX - topHalf)} ${horizon} L${round(centerX - bottomHalf)} 300" stroke="${c.accent}" stroke-width="4" opacity=".8"/>
    <path d="M${round(centerX + topHalf)} ${horizon} L${round(centerX + bottomHalf)} 300" stroke="${c.accent}" stroke-width="4" opacity=".8"/>
    ${car}
    ${speedLines(c.cool, random)}
  `;
}

function arenaCover(c, random) {
  const ry = round(84 + random() * 28);
  const tilt = round(random() * 34 - 17);
  const startX = round(54 + random() * 26);
  const carAngle = Math.floor(random() * 360);
  const rad = (carAngle * Math.PI) / 180;
  const carX = round(200 + Math.cos(rad) * 152);
  const carY = round(150 + Math.sin(rad) * ry);

  let checks = "";
  for (let index = 0; index < 10; index += 1) {
    checks += `<rect x="${startX + (index % 2) * 9}" y="${round(150 - ry + 4 + index * 8)}" width="9" height="8" fill="#ffffff" opacity="${index % 2 ? 0.12 : 0.34}"/>`;
  }

  return `
    <g transform="rotate(${tilt} 200 150)">
      <ellipse cx="200" cy="150" rx="152" ry="${ry}" fill="none" stroke="${c.ink}" stroke-width="70" opacity=".62"/>
      <ellipse cx="200" cy="150" rx="152" ry="${ry}" fill="none" stroke="${c.accent}" stroke-width="44"/>
      <ellipse cx="200" cy="150" rx="152" ry="${ry}" fill="none" stroke="#ffffff" stroke-width="3" stroke-dasharray="20 18" opacity=".5"/>
      <ellipse cx="200" cy="150" rx="178" ry="${round(ry + 26)}" fill="none" stroke="#ffffff" stroke-width="5" stroke-dasharray="12 14" opacity=".22"/>
      <ellipse cx="200" cy="150" rx="86" ry="${round(ry - 50)}" fill="${c.deep}" opacity=".5"/>
      ${checks}
      <g transform="translate(${carX} ${carY}) rotate(${carAngle + 90})">
        <rect x="-14" y="-21" width="28" height="42" rx="9" fill="${c.cool}"/>
        <rect x="-8" y="-13" width="16" height="13" rx="4" fill="${c.ink}" opacity=".5"/>
        <rect x="-11" y="14" width="22" height="5" rx="2" fill="${c.gold}" opacity=".85"/>
      </g>
    </g>
    ${speedLines(c.cool, random)}
    <circle cx="${round(300 + random() * 50)}" cy="${round(40 + random() * 36)}" r="26" fill="${c.gold}" opacity=".8"/>
  `;
}

function trackCover(c, random) {
  const path = `M-30 ${round(238 + random() * 44)} C ${round(70 + random() * 60)} ${round(120 + random() * 60)}, ${round(180 + random() * 80)} ${round(60 + random() * 60)}, ${round(400 + random() * 40)} ${round(240 + random() * 50)}`;
  return `
    <circle cx="288" cy="86" r="80" fill="${c.cool}" opacity=".24"/>
    <circle cx="288" cy="86" r="52" fill="${c.warm}" opacity=".85"/>
    <path d="${path}" fill="none" stroke="${c.ink}" stroke-width="72" opacity=".65"/>
    <path d="${path}" fill="none" stroke="${c.accent}" stroke-width="58"/>
    <path d="${path}" fill="none" stroke="#ffffff" stroke-width="5" stroke-dasharray="26 24" opacity=".6"/>
    ${[0, 1, 2, 3]
      .map(
        (index) =>
          `<circle cx="${round(40 + random() * 320)}" cy="${round(30 + random() * 90)}" r="${round(2 + random() * 3)}" fill="#fff" opacity=".45"/>`
      )
      .join("")}
    <polygon points="400,0 400,52 236,0" fill="${c.warm}" opacity=".22"/>
  `;
}

function drivingMotif(c, random, seed, game, index) {
  const variant = variantOf(seed, index, 3);
  if (variant === 0) return roadCover(c, random);
  if (variant === 1) return trackCover(c, random);
  return arenaCover(c, random);
}

// --- action --------------------------------------------------------------

function burstCover(c, random) {
  return `
    <polygon points="${starPoints(292, 106, 14, 116, 58)}" fill="${c.warm}" opacity=".95"/>
    <polygon points="${starPoints(292, 106, 14, 70, 34)}" fill="${c.accent}"/>
    <polygon points="${starPoints(292, 106, 10, 34, 16)}" fill="#ffffff" opacity=".55"/>
    <g transform="rotate(-25 150 226)">
      <rect x="-50" y="188" width="330" height="32" rx="16" fill="${c.cool}" opacity=".78"/>
      <rect x="-16" y="238" width="280" height="18" rx="9" fill="${c.cool}" opacity=".45"/>
    </g>
    <path d="M132 262 L156 206 L178 262 Z" fill="${c.ink}" opacity=".7"/>
    ${ground(c.ink, 0.9)}
    ${confetti(c, random, 6)}
  `;
}

function clashCover(c, random) {
  return `
    <g transform="rotate(34 200 140)">
      <rect x="-60" y="118" width="330" height="44" rx="10" fill="${c.accent}" opacity=".92"/>
      <rect x="-60" y="130" width="330" height="12" rx="6" fill="#ffffff" opacity=".22"/>
    </g>
    <g transform="rotate(-34 200 140)">
      <rect x="130" y="18" width="330" height="44" rx="10" fill="${c.cool}" opacity=".92"/>
      <rect x="130" y="30" width="330" height="12" rx="6" fill="#ffffff" opacity=".2"/>
    </g>
    <polygon points="${starPoints(198, 140, 9, 52, 22)}" fill="${c.gold}"/>
    <polygon points="${starPoints(198, 140, 9, 24, 9)}" fill="#ffffff" opacity=".8"/>
    ${[[86, 244, 24], [286, 232, 18], [338, 66, 14]]
      .map(
        ([x, y, size]) =>
          `<polygon points="${starPoints(x, y, 6, size, size * 0.4)}" fill="${c.warm}" opacity=".55"/>`
      )
      .join("")}
    ${ground(c.ink, 0.8)}
  `;
}

function rayCover(c, random) {
  const cx = round(176 + random() * 64);
  const cy = round(112 + random() * 34);
  return `
    <polygon points="${starPoints(cx, cy, 18, 232, 104)}" fill="${c.accent}" opacity=".26"/>
    <polygon points="${starPoints(cx, cy, 11, 128, 54)}" fill="${c.warm}" opacity=".45"/>
    <path d="M${cx + 46} ${cy - 76} L${cx - 44} ${cy + 6} L${cx + 2} ${cy + 6} L${cx - 32} ${cy + 92} L${cx + 68} ${cy - 12} L${cx + 22} ${cy - 12} Z" fill="${c.gold}"/>
    ${[[64, 54, 18], [330, 132, 22], [96, 226, 14]]
      .map(
        ([x, y, size]) =>
          `<polygon points="${starPoints(x, y, 6, size, size * 0.38)}" fill="${c.cool}" opacity=".55"/>`
      )
      .join("")}
    ${ground(c.ink, 0.8)}
    ${confetti(c, random, 6)}
  `;
}

function actionMotif(c, random, seed, game, index) {
  const variant = variantOf(seed, index, 3);
  if (variant === 0) return burstCover(c, random);
  if (variant === 1) return clashCover(c, random);
  return rayCover(c, random);
}

// --- arcade --------------------------------------------------------------

function chevronCover(c, random) {
  let pixels = "";
  for (let row = 0; row < 5; row += 1) {
    for (let column = 0; column < 7; column += 1) {
      if (random() > 0.55) {
        const color = random() > 0.5 ? c.accent : c.warm;
        pixels += `<rect x="${round(24 + column * 30)}" y="${round(20 + row * 30)}" width="24" height="24" rx="4" fill="${color}" opacity="${(0.16 + random() * 0.18).toFixed(2)}"/>`;
      }
    }
  }
  return `
    ${pixels}
    <path d="M196 88 L266 152 L196 216" fill="none" stroke="${c.cool}" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>
    <path d="M264 88 L334 152 L264 216" fill="none" stroke="${c.warm}" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" opacity=".82"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7]
      .map((index) => `<rect x="0" y="${round(index * 38 + 6)}" width="400" height="2" fill="#000" opacity=".24"/>`)
      .join("")}
    ${confetti(c, random, 5)}
  `;
}

function tetrisCover(c, random) {
  const baseX = 118;
  const baseY = 104;
  const unit = 30;
  const shapes = [
    { cells: [[0, 0], [1, 0], [2, 0], [2, 1]], fill: c.accent, rotate: -6 },
    { cells: [[0, 2], [1, 2], [2, 2], [1, 1]], fill: c.warm, rotate: 4 },
    { cells: [[0, 4], [1, 4], [1, 3], [2, 4]], fill: c.cool, rotate: 0 }
  ];
  let blocks = "";
  for (const shape of shapes) {
    for (const [column, row] of shape.cells) {
      const x = baseX + column * unit;
      const y = baseY + row * unit;
      blocks += `<g transform="rotate(${shape.rotate + round(random() * 4 - 2)} ${x + unit / 2} ${y + unit / 2})">
        <rect x="${x}" y="${y}" width="${unit - 4}" height="${unit - 4}" rx="6" fill="${shape.fill}" opacity=".95"/>
        <rect x="${x + 4}" y="${y + 4}" width="${unit - 12}" height="7" rx="3" fill="#fff" opacity=".3"/>
      </g>`;
    }
  }
  return `
    ${[0, 1, 2, 3, 4, 5]
      .map(
        (index) =>
          `<rect x="${round(20 + random() * 350)}" y="${round(16 + random() * 220)}" width="18" height="18" rx="3" fill="${index % 2 ? c.cool : c.warm}" opacity="${(0.18 + random() * 0.25).toFixed(2)}"/>`
      )
      .join("")}
    ${blocks}
    <path d="M0 300 L0 268 L400 252 L400 300 Z" fill="${c.ink}" opacity=".6"/>
  `;
}

function pixelCover(c, random) {
  const unit = 21 + Math.floor(random() * 5);
  const ox = round(112 + random() * 52);
  const oy = round(66 + random() * 34);
  const shape = [".###.", "#####", "#####", ".###."];
  let blocks = "";
  shape.forEach((line, row) => {
    [...line].forEach((cell, column) => {
      if (cell !== "#") return;
      const x = ox + column * unit;
      const y = oy + row * unit;
      const isEye = row === 1 && (column === 1 || column === 3);
      const isMouth = row === 2 && column === 2;
      const fill = isEye ? "#ffffff" : isMouth ? c.ink : c.warm;
      blocks += `<rect x="${x}" y="${y}" width="${unit - 3}" height="${unit - 3}" rx="3" fill="${fill}" opacity=".96"/>`;
    });
  });
  return `
    ${dotField("#ffffff", random, 0.1, 34, 2)}
    ${blocks}
    ${[0, 1, 2, 3, 4]
      .map(
        (index) =>
          `<rect x="${round(26 + random() * 340)}" y="${round(22 + random() * 190)}" width="14" height="14" rx="2" fill="${index % 2 ? c.cool : c.accent}" opacity="${(0.2 + random() * 0.3).toFixed(2)}"/>`
      )
      .join("")}
    ${ground(c.ink, 0.7)}
  `;
}

function arcadeMotif(c, random, seed, game, index) {
  const variant = variantOf(seed, index, 3);
  if (variant === 0) return chevronCover(c, random);
  if (variant === 1) return tetrisCover(c, random);
  return pixelCover(c, random);
}

// --- puzzle --------------------------------------------------------------

function blockCover(c, random) {
  const blocks = [
    { x: 122, y: 88, size: 78, fill: c.accent, rotate: round(random() * 10 - 13) },
    { x: 198, y: 128, size: 96, fill: c.warm, rotate: round(random() * 10 + 2) },
    { x: 106, y: 172, size: 60, fill: c.cool, rotate: round(random() * 8 - 6) }
  ];
  return `
    ${dotField("#ffffff", random, 0.1, 34, 2)}
    ${blocks
      .map((block) => {
        const cx = block.x + block.size / 2;
        const cy = block.y + block.size / 2;
        return `<g transform="rotate(${block.rotate} ${round(cx)} ${round(cy)})">
          <rect x="${block.x}" y="${block.y}" width="${block.size}" height="${block.size}" rx="16" fill="${block.fill}" opacity=".96"/>
          <rect x="${round(block.x + block.size * 0.14)}" y="${round(block.y + block.size * 0.12)}" width="${round(block.size * 0.72)}" height="${round(block.size * 0.2)}" rx="6" fill="#fff" opacity=".32"/>
        </g>`;
      })
      .join("")}
    <circle cx="330" cy="66" r="40" fill="none" stroke="${c.gold}" stroke-width="9" opacity=".4"/>
    ${ground(c.ink, 0.55)}
  `;
}

function ringCover(c, random) {
  return `
    <circle cx="272" cy="128" r="92" fill="none" stroke="${c.warm}" stroke-width="22" opacity=".9"/>
    <circle cx="272" cy="128" r="60" fill="none" stroke="${c.accent}" stroke-width="16" opacity=".95"/>
    <circle cx="272" cy="128" r="28" fill="${c.cool}" opacity=".95"/>
    <circle cx="272" cy="128" r="10" fill="#ffffff" opacity=".8"/>
    <polygon points="70,150 148,110 148,190" fill="${c.gold}" opacity=".9"/>
    ${dotField("#ffffff", random, 0.12, 44, 2.2)}
    ${ground(c.ink, 0.6)}
  `;
}

function puzzleMotif(c, random, seed, game, index) {
  return pick(seed, index) === 0 ? blockCover(c, random) : ringCover(c, random);
}

// --- sports --------------------------------------------------------------

function footballCover(c, random) {
  return `
    ${[0, 1, 2, 3]
      .map((index) => `<rect x="0" y="${round(190 + index * 28)}" width="400" height="2" fill="#ffffff" opacity=".16"/>`)
      .join("")}
    <circle cx="316" cy="86" r="52" fill="${c.gold}" opacity=".8"/>
    <g transform="rotate(-22 196 156)">
      <ellipse cx="196" cy="156" rx="104" ry="62" fill="${c.warm}"/>
      <ellipse cx="196" cy="156" rx="104" ry="62" fill="none" stroke="${c.ink}" stroke-width="5" opacity=".6"/>
      <rect x="176" y="132" width="40" height="7" rx="3.5" fill="#ffffff" opacity=".92"/>
      <rect x="176" y="150" width="40" height="7" rx="3.5" fill="#ffffff" opacity=".92"/>
      <rect x="176" y="168" width="40" height="7" rx="3.5" fill="#ffffff" opacity=".92"/>
      <rect x="190" y="126" width="6" height="54" rx="3" fill="#ffffff" opacity=".7"/>
    </g>
    <path d="M44 258 q60 -22 120 0" fill="none" stroke="${c.cool}" stroke-width="4" stroke-dasharray="10 10" opacity=".5"/>
    ${confetti(c, random, 8)}
  `;
}

function hoopCover(c, random) {
  return `
    <rect x="238" y="34" width="126" height="112" rx="10" fill="${c.ink}" opacity=".55"/>
    <rect x="256" y="50" width="90" height="62" rx="6" fill="none" stroke="#ffffff" stroke-width="6" opacity=".55"/>
    <rect x="286" y="64" width="30" height="22" rx="4" fill="none" stroke="#ffffff" stroke-width="5" opacity=".7"/>
    <ellipse cx="298" cy="150" rx="44" ry="13" fill="none" stroke="${c.gold}" stroke-width="8"/>
    ${[0, 1, 2, 3, 4]
      .map(
        (index) =>
          `<path d="M${272 + index * 13} 152 l${round(index * 1.6 - 3)} 44" stroke="#ffffff" stroke-width="2" opacity=".4"/>`
      )
      .join("")}
    <path d="M228 300 q46 -170 70 -140" fill="none" stroke="#ffffff" stroke-width="4" stroke-dasharray="9 11" opacity=".5"/>
    <circle cx="128" cy="206" r="56" fill="${c.warm}"/>
    <path d="M72 206 q56 -30 112 0" fill="none" stroke="${c.ink}" stroke-width="5" opacity=".55"/>
    <path d="M128 150 q-26 56 0 112" fill="none" stroke="${c.ink}" stroke-width="5" opacity=".5"/>
    ${ground(c.ink, 0.75)}
  `;
}

function sportsMotif(c, random, seed, game, index) {
  const name = String(game && game.name ? game.name : "").toLowerCase();
  if (/basket|hoop/.test(name)) return hoopCover(c, random);
  if (/bowl|football|soccer|golf/.test(name)) return footballCover(c, random);
  return pick(seed, index) === 0 ? footballCover(c, random) : hoopCover(c, random);
}

// --- casual --------------------------------------------------------------

function blobCover(c, random) {
  const heroX = round(206 + random() * 26);
  const heroY = round(148 + random() * 14);
  const heroR = round(92 + random() * 10);
  return `
    <circle cx="${round(96 + random() * 40)}" cy="${round(66 + random() * 24)}" r="${round(70 + random() * 16)}" fill="${c.accent}" opacity=".9"/>
    <circle cx="${heroX}" cy="${heroY}" r="${heroR}" fill="${c.warm}" opacity=".9"/>
    <circle cx="${round(heroX - heroR * 0.34)}" cy="${round(heroY - heroR * 0.42)}" r="${round(heroR * 0.22)}" fill="#ffffff" opacity=".22"/>
    ${face(heroX, heroY, heroR * 0.72, c.ink)}
    <circle cx="${round(310 + random() * 20)}" cy="${round(64 + random() * 20)}" r="${round(48 + random() * 14)}" fill="${c.cool}" opacity=".9"/>
    <circle cx="${round(268 + random() * 30)}" cy="${round(196 + random() * 14)}" r="28" fill="none" stroke="#ffffff" stroke-width="5" opacity=".38"/>
    <circle cx="${round(56 + random() * 30)}" cy="${round(206 + random() * 16)}" r="17" fill="none" stroke="#ffffff" stroke-width="4" opacity=".32"/>
    ${sparkle(334, 154, 19, "#ffffff", 0.9)}
    ${sparkle(84, 148, 11, "#ffffff", 0.65)}
    ${dotField("#ffffff", random, 0.12, 42, 2.4)}
  `;
}

function bubbleCover(c, random) {
  const cx = round(180 + random() * 30);
  const cy = round(134 + random() * 22);
  const r = round(86 + random() * 18);
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${c.accent}" opacity=".55"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c.accent}" stroke-width="4" opacity=".7"/>
    <circle cx="${round(cx - r * 0.3)}" cy="${round(cy - r * 0.38)}" r="${round(r * 0.3)}" fill="#ffffff" opacity=".24"/>
    ${face(cx, cy, r * 0.66, c.ink)}
    <circle cx="${round(300 + random() * 20)}" cy="${round(72 + random() * 20)}" r="${round(38 + random() * 16)}" fill="${c.warm}" opacity=".85"/>
    <circle cx="${round(296 + random() * 16)}" cy="${round(62 + random() * 10)}" r="12" fill="#ffffff" opacity=".35"/>
    <circle cx="${round(78 + random() * 24)}" cy="${round(206 + random() * 20)}" r="${round(30 + random() * 20)}" fill="none" stroke="${c.cool}" stroke-width="6" opacity=".7"/>
    ${sparkle(320, 202, 16, "#ffffff", 0.85)}
    ${dotField("#ffffff", random, 0.1, 46, 2.2)}
    ${ground(c.ink, 0.5)}
  `;
}

function casualMotif(c, random, seed, game, index) {
  return pick(seed, index) === 0 ? blobCover(c, random) : bubbleCover(c, random);
}


// --- adventure -----------------------------------------------------------

function mountainCover(c, random) {
  return `
    <circle cx="302" cy="80" r="${round(44 + random() * 12)}" fill="${c.gold}" opacity=".95"/>
    <circle cx="302" cy="80" r="72" fill="none" stroke="${c.gold}" stroke-width="3" opacity=".3"/>
    <path d="M118 300 L268 116 L420 300 Z" fill="${c.mid}" opacity=".95"/>
    <path d="M-40 300 L96 134 L232 300 Z" fill="${c.ink}" opacity=".9"/>
    <path d="M186 300 L302 164 L400 300 Z" fill="${c.ink}" opacity=".72"/>
    <path d="M268 116 L246 146 L262 142 L276 168 L286 140 L300 146 Z" fill="#ffffff" opacity=".55"/>
    ${[0, 1, 2]
      .map(
        (index) =>
          `<g opacity=".2" fill="#ffffff"><circle cx="${round(52 + index * 34)}" cy="${round(52 + (index % 2) * 26)}" r="${round(14 + (index % 3) * 5)}"/><circle cx="${round(76 + index * 34)}" cy="${round(58 + (index % 2) * 26)}" r="${round(11 + (index % 2) * 6)}"/></g>`
      )
      .join("")}
    ${[0, 1, 2]
      .map(
        (index) =>
          `<path d="M${round(70 + random() * 180)} ${round(26 + random() * 58)} q6 -7 12 0" fill="none" stroke="${c.ink}" stroke-width="3" opacity=".45"/>`
      )
      .join("")}
  `;
}

function flagCover(c, random) {
  return `
    <circle cx="86" cy="78" r="46" fill="${c.gold}" opacity=".9"/>
    <path d="M-30 300 L120 186 L268 300 Z" fill="${c.mid}" opacity=".95"/>
    <path d="M150 300 L286 200 L420 300 Z" fill="${c.ink}" opacity=".8"/>
    <rect x="212" y="72" width="10" height="176" rx="5" fill="${c.pale}" opacity=".95"/>
    <path d="M222 84 L330 112 L222 142 Z" fill="${c.accent}"/>
    <path d="M222 88 L300 108 L222 132 Z" fill="#ffffff" opacity=".22"/>
    ${[0, 1, 2]
      .map(
        (index) =>
          `<g opacity=".22" fill="#ffffff"><circle cx="${round(48 + index * 30)}" cy="${round(168 + (index % 2) * 20)}" r="${round(12 + index * 2)}"/><circle cx="${round(70 + index * 30)}" cy="${round(172 + (index % 2) * 20)}" r="${round(9 + index)}"/></g>`
      )
      .join("")}
    ${confetti(c, random, 5)}
  `;
}

function adventureMotif(c, random, seed, game, index) {
  return pick(seed, index) === 0 ? mountainCover(c, random) : flagCover(c, random);
}

// --- strategy ------------------------------------------------------------

function hexCover(c, random) {
  const radius = 27;
  const horizontal = radius * 1.5;
  const vertical = radius * Math.sqrt(3);
  let grid = "";
  for (let row = 0; row < 8; row += 1) {
    for (let column = -1; column < 11; column += 1) {
      const cx = column * horizontal + (row % 2 ? horizontal / 2 : 0) - 10;
      const cy = row * vertical * 0.86 + 4;
      if (cx < -40 || cx > WIDTH + 40 || cy > HEIGHT + 20) continue;
      const roll = random();
      if (roll > 0.72) {
        grid += `<polygon points="${hexagon(cx, cy, radius - 3)}" fill="${roll > 0.88 ? c.warm : c.accent}" opacity=".55"/>`;
      } else {
        grid += `<polygon points="${hexagon(cx, cy, radius - 3)}" fill="none" stroke="#ffffff" stroke-width="1.4" opacity=".15"/>`;
      }
    }
  }
  return `
    ${grid}
    <path d="M56 92 L56 216" stroke="${c.cool}" stroke-width="9" stroke-linecap="round" opacity=".85"/>
    <path d="M60 96 L152 126 L60 158 Z" fill="${c.gold}" opacity=".95"/>
    ${ground(c.ink, 0.35)}
  `;
}

function shieldCover(c, random) {
  return `
    ${dotField("#ffffff", random, 0.1, 40, 2)}
    <path d="M200 56 L304 92 L288 204 Q258 252 200 272 Q142 252 112 204 L96 92 Z" fill="${c.accent}" opacity=".95"/>
    <path d="M200 56 L304 92 L288 204 Q258 252 200 272 Z" fill="${c.ink}" opacity=".24"/>
    <path d="M200 96 L262 118 L252 194 Q232 224 200 236 Q168 224 148 194 L138 118 Z" fill="${c.ink}" opacity=".45"/>
    <path d="M200 118 L236 132 L200 150 L164 132 Z" fill="${c.gold}" opacity=".95"/>
    <rect x="188" y="146" width="24" height="58" rx="10" fill="${c.gold}" opacity=".8"/>
    ${[0, 1, 2]
      .map(
        (index) =>
          `<path d="M${round(24 + index * 26)} ${round(88 + index * 44)} l48 -18 l-6 36 Z" fill="${c.warm}" opacity="${(0.4 - index * 0.08).toFixed(2)}"/>`
      )
      .join("")}
  `;
}

function strategyMotif(c, random, seed, game, index) {
  return pick(seed, index) === 0 ? hexCover(c, random) : shieldCover(c, random);
}

// --- skill ---------------------------------------------------------------

function spikeCover(c, random) {
  let stripes = "";
  for (let index = 0; index < 7; index += 1) {
    stripes += `<rect x="${-60 + index * 62}" y="150" width="26" height="220" fill="${c.accent}" opacity=".16"/>`;
  }
  let spikes = "";
  for (let index = 0; index < 9; index += 1) {
    spikes += `<path d="M${index * 46 - 20} 300 L${index * 46 + 3} 236 L${index * 46 + 26} 300 Z" fill="${c.ink}" opacity=".85"/>`;
  }
  return `
    ${dotField("#ffffff", random, 0.1, 36, 2)}
    <g transform="rotate(-16 200 240)">${stripes}</g>
    <circle cx="300" cy="92" r="62" fill="none" stroke="${c.cool}" stroke-width="12" opacity=".75"/>
    <circle cx="300" cy="92" r="30" fill="${c.warm}" opacity=".9"/>
    <circle cx="300" cy="92" r="8" fill="#ffffff" opacity=".9"/>
    ${spikes}
  `;
}

function targetCover(c, random) {
  return `
    <circle cx="272" cy="118" r="96" fill="none" stroke="${c.warm}" stroke-width="3" opacity=".5"/>
    <circle cx="272" cy="118" r="70" fill="none" stroke="${c.warm}" stroke-width="3" opacity=".6"/>
    <circle cx="272" cy="118" r="44" fill="${c.accent}" opacity=".85"/>
    <circle cx="272" cy="118" r="16" fill="#ffffff" opacity=".9"/>
    <path d="M150 118 L226 118" stroke="${c.cool}" stroke-width="8" stroke-linecap="round" opacity=".8"/>
    <path d="M272 22 L272 60" stroke="${c.cool}" stroke-width="8" stroke-linecap="round" opacity=".8"/>
    ${[0, 1, 2, 3, 4]
      .map(
        (index) =>
          `<path d="M${round(40 + index * 44)} -10 l16 44 l-32 0 Z" fill="${c.gold}" opacity="${(0.32 + random() * 0.2).toFixed(2)}"/>`
      )
      .join("")}
    ${ground(c.ink, 0.7)}
  `;
}

function skillMotif(c, random, seed, game, index) {
  return pick(seed, index) === 0 ? spikeCover(c, random) : targetCover(c, random);
}

const MOTIFS = {
  driving: drivingMotif,
  action: actionMotif,
  arcade: arcadeMotif,
  puzzle: puzzleMotif,
  sports: sportsMotif,
  casual: casualMotif,
  adventure: adventureMotif,
  strategy: strategyMotif,
  skill: skillMotif
};

/** Return a self-contained cover illustration for a catalog entry. */
export function coverSvg(game, index = 0) {
  uid += 1;
  const seed = hashString(`${game.name || ""}|${game.category || ""}|${game.url || ""}`);
  const random = makeRandom(seed);
  const colors = paletteFor(game, seed, index);
  const category = String(game.category || "").toLowerCase();
  const motif = MOTIFS[category] || casualMotif;
  const id = `cover-${seed.toString(36)}-${uid}`;

  const glowX = round(170 + random() * 150);
  const glowY = round(50 + random() * 100);
  // Small shifts keep two games with the same motif from framing identically.
  const shiftX = round(random() * 34 - 17);
  const shiftY = round(random() * 24 - 12);
  const scale = (0.96 + random() * 0.08).toFixed(3);
  // Mirroring turns each motif into a second composition for free.
  const flipX = (seed >>> 17) % 2 === 1 ? `-${scale}` : scale;

  return `<svg viewBox="0 0 ${WIDTH} ${HEIGHT}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="presentation" focusable="false">
    <defs>
      <linearGradient id="${id}-bg" x1="0" y1="0" x2=".85" y2="1">
        <stop offset="0" stop-color="${colors.mid}"/>
        <stop offset=".52" stop-color="${colors.deep}"/>
        <stop offset="1" stop-color="${colors.ink}"/>
      </linearGradient>
      <radialGradient id="${id}-glow" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="${colors.accent}" stop-opacity=".85"/>
        <stop offset="1" stop-color="${colors.accent}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="${id}-vignette" cx=".5" cy=".46" r=".72">
        <stop offset=".55" stop-color="#000000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000000" stop-opacity=".42"/>
      </radialGradient>
    </defs>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#${id}-bg)"/>
    <ellipse cx="${glowX}" cy="${glowY}" rx="238" ry="196" fill="url(#${id}-glow)" opacity=".5"/>
    <g transform="translate(${shiftX} ${shiftY}) translate(200 150) scale(${flipX} ${scale}) translate(-200 -150)">
      ${motif(colors, random, seed, game, index)}
    </g>
    ${stickers(colors, random)}
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#${id}-vignette)"/>
    <polygon points="0,0 128,0 24,300 0,300" fill="#ffffff" opacity=".05"/>
    <polygon points="400,0 400,64 168,300 96,300" fill="#ffffff" opacity=".045"/>
  </svg>`;
}
