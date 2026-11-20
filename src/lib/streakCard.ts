// Draws the daily streak as a 1200x630 image that can be shared from a phone
// or downloaded on a computer. Everything is painted locally, so no upload or
// backend is involved.

import {
  currentStreakMilestone,
  dayKey,
  nextStreakMilestone,
  type StreakData,
} from "./streak";

const WIDTH = 1200;
const HEIGHT = 630;
const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, 'Helvetica Neue', Arial, sans-serif";

// Same flame outline the top bar uses, scaled to any size.
const FLAME_PATH = new Path2D(
  "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
);

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawFlame(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 24, size / 24);
  ctx.fillStyle = color;
  ctx.fill(FLAME_PATH);
  ctx.restore();
}

function measure(ctx: CanvasRenderingContext2D, text: string): number {
  return ctx.measureText(text).width;
}

/** Visited days over the last 30 local days, oldest first. */
function lastThirtyDays(data: StreakData) {
  const visited = new Set(data.history);
  const today = dayKey();
  const days: { key: string; visited: boolean; today: boolean }[] = [];
  const now = new Date();
  for (let offset = 29; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset, 12);
    const key = dayKey(date);
    days.push({ key, visited: visited.has(key), today: key === today });
  }
  return days;
}

function drawCard(ctx: CanvasRenderingContext2D, data: StreakData) {
  // Background: near-black with a warm bloom behind the flame.
  const background = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  background.addColorStop(0, "#08080a");
  background.addColorStop(0.55, "#0d0b09");
  background.addColorStop(1, "#171006");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const glow = ctx.createRadialGradient(930, 270, 20, 930, 270, 420);
  glow.addColorStop(0, "rgba(251, 191, 36, 0.22)");
  glow.addColorStop(0.55, "rgba(249, 115, 22, 0.08)");
  glow.addColorStop(1, "rgba(249, 115, 22, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Faint grid keeps the flat background from looking empty.
  ctx.strokeStyle = "rgba(255, 255, 255, 0.028)";
  ctx.lineWidth = 1;
  for (let x = 60; x < WIDTH; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }
  for (let y = 60; y < HEIGHT; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }

  roundRect(ctx, 14, 14, WIDTH - 28, HEIGHT - 28, 34);
  ctx.strokeStyle = "rgba(251, 191, 36, 0.22)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Brand.
  drawFlame(ctx, 70, 56, 32, "#f59e0b");
  ctx.fillStyle = "#e4e4e7";
  ctx.font = `600 26px ${FONT}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillText("math_games", 114, 84);

  // Kicker.
  ctx.save();
  try {
    (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = "6px";
  } catch {}
  ctx.fillStyle = "#fbbf24";
  ctx.font = `700 21px ${FONT}`;
  ctx.fillText("DAILY STREAK", 70, 178);
  ctx.restore();

  // The number.
  const digits = String(data.current).length;
  const numberSize = digits >= 4 ? 150 : digits >= 3 ? 180 : 215;
  ctx.fillStyle = "#fafafa";
  ctx.font = `900 ${numberSize}px ${FONT}`;
  const numberWidth = measure(ctx, String(data.current));
  ctx.fillText(String(data.current), 66, 388);

  ctx.fillStyle = "#a1a1aa";
  ctx.font = `500 30px ${FONT}`;
  ctx.fillText(data.current === 1 ? "day in a row" : "days in a row", 74, 434);

  // Milestone badge.
  const reached = currentStreakMilestone(data.current);
  const next = nextStreakMilestone(data.current);
  const badgeText = reached ? `${reached.name} unlocked` : "First milestone: 3 days";
  ctx.font = `600 20px ${FONT}`;
  const badgeWidth = measure(ctx, badgeText) + 46;
  roundRect(ctx, 70, 466, badgeWidth, 42, 21);
  ctx.fillStyle = "rgba(251, 191, 36, 0.14)";
  ctx.fill();
  ctx.strokeStyle = "rgba(251, 191, 36, 0.35)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  drawFlame(ctx, 86, 476, 20, "#fbbf24");
  ctx.fillStyle = "#fde68a";
  ctx.font = `600 20px ${FONT}`;
  ctx.fillText(badgeText, 118, 494);

  // Stats.
  ctx.fillStyle = "#d4d4d8";
  ctx.font = `500 23px ${FONT}`;
  ctx.fillText(
    `Longest ${data.longest} ${data.longest === 1 ? "day" : "days"}`,
    70,
    574
  );
  ctx.fillStyle = "#52525b";
  ctx.fillText("·", 70 + measure(ctx, `Longest ${data.longest} ${data.longest === 1 ? "day" : "days"}`) + 16, 574);
  ctx.fillStyle = "#d4d4d8";
  ctx.font = `500 23px ${FONT}`;
  ctx.fillText(`Total ${data.totalDays} ${data.totalDays === 1 ? "day" : "days"}`, 70 + measure(ctx, `Longest ${data.longest} ${data.longest === 1 ? "day" : "days"}`) + 40, 574);

  // Big flame.
  const flameX = 820;
  const flameY = 74;
  const flameSize = 220;
  ctx.save();
  ctx.shadowColor = "rgba(245, 158, 11, 0.45)";
  ctx.shadowBlur = 60;
  drawFlame(ctx, flameX, flameY, flameSize, "#f59e0b");
  ctx.restore();
  drawFlame(ctx, flameX + 52, flameY + 62, 112, "#fde68a");

  // Last 30 days grid.
  const gridX = 758;
  const gridY = 438;
  const cell = 24;
  const gap = 7;

  ctx.save();
  ctx.fillStyle = "#a1a1aa";
  ctx.font = `600 17px ${FONT}`;
  try {
    (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = "3px";
  } catch {}
  ctx.fillText("LAST 30 DAYS", gridX, 400);
  ctx.restore();

  ctx.fillStyle = "#71717a";
  ctx.font = `500 17px ${FONT}`;
  const visitedCount = lastThirtyDays(data).filter((day) => day.visited).length;
  ctx.textAlign = "right";
  ctx.fillText(`${visitedCount} visited`, gridX + 10 * cell + 9 * gap, 400);
  ctx.textAlign = "left";

  lastThirtyDays(data).forEach((day, index) => {
    const column = index % 10;
    const row = Math.floor(index / 10);
    const x = gridX + column * (cell + gap);
    const y = gridY + row * (cell + gap);
    roundRect(ctx, x, y, cell, cell, 5);
    ctx.fillStyle = day.visited ? "rgba(251, 191, 36, 0.85)" : "rgba(255, 255, 255, 0.055)";
    ctx.fill();
    if (day.today) {
      roundRect(ctx, x + 1, y + 1, cell - 2, cell - 2, 4);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });

  // Footer.
  ctx.fillStyle = "#52525b";
  ctx.font = `500 18px ${FONT}`;
  ctx.textAlign = "right";
  ctx.fillText(next ? `Next: ${next.name} in ${next.days - data.current} days` : "Every milestone unlocked", 1130, 574);
  ctx.textAlign = "left";
  ctx.fillText("polytrack · base31.org", 70, 606);
}

export async function renderStreakCard(data: StreakData): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable");
  drawCard(ctx, data);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("The card could not be drawn"))),
      "image/png"
    );
  });
}

export type StreakShareResult = "shared" | "downloaded" | "cancelled";

/**
 * Uses the phone share sheet when it accepts files, otherwise downloads the
 * PNG. Cancelling the sheet is reported, not treated as an error.
 */
export async function shareStreakCard(data: StreakData): Promise<StreakShareResult> {
  const blob = await renderStreakCard(data);
  const fileName = `math-games-streak-${data.current}-${data.current === 1 ? "day" : "days"}.png`;
  const file = new File([blob], fileName, { type: "image/png" });
  const text = `I'm on a ${data.current}-day streak on math_games 🔥`;

  // Only phones and tablets get the native sheet: desktop Chrome exposes the
  // API but can hand off to a share dialog that never returns.
  const wantsShareSheet =
    typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;
  if (wantsShareSheet && typeof navigator.canShare === "function") {
    try {
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "My math_games streak", text });
        return "shared";
      }
    } catch (error) {
      if ((error as DOMException | undefined)?.name === "AbortError") return "cancelled";
    }
  }

  const url = URL.createObjectURL(blob);
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }
  return "downloaded";
}
