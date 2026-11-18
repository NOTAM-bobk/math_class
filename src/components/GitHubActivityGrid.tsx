import * as React from "react";
import { motion, useSpring, useMotionValue, useReducedMotion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ActivityDay } from "@/lib/updateHistory";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface GitHubActivityGridProps {
  days: ActivityDay[];
  maxCount?: number;
  cellSize?: number;
  cellGap?: number;
  className?: string;
  title?: string;
  subtitle?: string;
}

const LEVEL_BG = [
  "bg-white/[0.05] ring-1 ring-inset ring-white/[0.06] hover:bg-white/[0.1]",
  "bg-emerald-500/25 ring-1 ring-inset ring-emerald-400/20 hover:bg-emerald-500/35",
  "bg-emerald-500/50 ring-1 ring-inset ring-emerald-400/30 hover:bg-emerald-500/65",
  "bg-emerald-500/75 ring-1 ring-inset ring-emerald-400/40 hover:bg-emerald-500/90",
  "bg-emerald-400 ring-1 ring-inset ring-emerald-300/50 shadow-[0_0_8px_rgba(52,211,153,0.35)] hover:bg-emerald-300",
] as const;

const WEEKDAYS = ["", "Mon", "", "Wed", "", "Fri", ""] as const;
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const ACTIVITY_MATTE_NOISE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.65 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;
const WEEKDAY_LABEL_WIDTH = 22;
const WEEKDAY_LABEL_GAP = 4;

export function GitHubActivityGrid({
  days,
  maxCount,
  cellSize = 11,
  cellGap = 3,
  className,
  title,
  subtitle = "updates in the last year",
}: GitHubActivityGridProps) {
  const reduce = useReducedMotion();

  const max = React.useMemo(() => {
    if (typeof maxCount === "number" && maxCount > 0) return maxCount;
    return Math.max(1, ...days.map((d) => d.count));
  }, [days, maxCount]);

  function level(count: number) {
    if (count <= 0) return 0;
    const ratio = count / max;
    if (ratio < 0.25) return 1;
    if (ratio < 0.5) return 2;
    if (ratio < 0.75) return 3;
    return 4;
  }

  const grid = React.useMemo(() => {
    if (days.length === 0) {
      return {
        weeks: [] as (ActivityDay | null)[][],
        monthLabels: [] as { col: number; label: string }[],
      };
    }
    const first = new Date(days[0].date + "T00:00:00");
    const startWeekday = first.getDay(); // 0..6
    const flat: (ActivityDay | null)[] = [
      ...Array.from({ length: startWeekday }, () => null),
      ...days,
    ];
    while (flat.length % 7 !== 0) flat.push(null);

    const weeks: (ActivityDay | null)[][] = [];
    for (let i = 0; i < flat.length; i += 7) {
      weeks.push(flat.slice(i, i + 7));
    }

    const monthLabels: { col: number; label: string }[] = [];
    let lastMonth = -1;
    weeks.forEach((wk, col) => {
      const firstReal = wk.find(Boolean) as ActivityDay | undefined;
      if (!firstReal) return;
      const m = new Date(firstReal.date + "T00:00:00").getMonth();
      if (m !== lastMonth) {
        monthLabels.push({ col, label: MONTHS[m] });
        lastMonth = m;
      }
    });
    return { weeks, monthLabels };
  }, [days]);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const tooltipX = useMotionValue(0);
  const tooltipY = useMotionValue(0);
  const springX = useSpring(tooltipX, { stiffness: 480, damping: 40, mass: 0.5 });
  const springY = useSpring(tooltipY, { stiffness: 480, damping: 40, mass: 0.5 });
  const [hover, setHover] = React.useState<ActivityDay | null>(null);
  const gridViewportRef = React.useRef<HTMLDivElement | null>(null);
  const [gridViewportWidth, setGridViewportWidth] = React.useState(0);

  React.useEffect(() => {
    const node = gridViewportRef.current;
    if (!node) return;

    const measure = () => setGridViewportWidth(node.clientWidth);
    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function onCellEnter(e: React.PointerEvent<HTMLButtonElement>, day: ActivityDay) {
    const cont = containerRef.current;
    if (!cont) return;
    const r = e.currentTarget.getBoundingClientRect();
    const cr = cont.getBoundingClientRect();
    tooltipX.set(r.left - cr.left + r.width / 2);
    tooltipY.set(r.top - cr.top - 6);
    setHover(day);
  }

  function onLeave() {
    setHover(null);
  }

  const totalContributions = React.useMemo(
    () => days.reduce((s, d) => s + d.count, 0),
    [days]
  );

  const weekCount = grid.weeks.length;
  const baseGridWidth = weekCount * cellSize + Math.max(0, weekCount - 1) * cellGap;
  const availableGridWidth = Math.max(0, gridViewportWidth - WEEKDAY_LABEL_WIDTH - WEEKDAY_LABEL_GAP);
  const fitScale =
    gridViewportWidth > 0 && baseGridWidth > availableGridWidth
      ? availableGridWidth / baseGridWidth
      : 1;
  const fittedCellSize = Math.max(7, cellSize * fitScale);
  const fittedCellGap = Math.max(2, cellGap * fitScale);
  const fittedGridWidth =
    weekCount * fittedCellSize + Math.max(0, weekCount - 1) * fittedCellGap;

  return (
    <div
      className={cn(
        "relative isolate w-full overflow-hidden rounded-2xl border border-white/[0.08] p-4 sm:p-5",
        "bg-[radial-gradient(ellipse_90%_70%_at_50%_-10%,#1a1a24_0%,#111116_72%)]",
        "shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_12px_32px_-12px_rgba(0,0,0,0.7)]",
        className
      )}
      ref={containerRef}
      onPointerLeave={onLeave}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: ACTIVITY_MATTE_NOISE, backgroundSize: "240px 240px" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.025)_0%,transparent_30%,transparent_72%,rgba(0,0,0,0.3)_100%)]"
      />

      {/* Header */}
      <div className="relative z-10 mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <div className="text-[14.5px] font-semibold tracking-tight text-zinc-100">
            {title ? (
              <span>{title}</span>
            ) : (
              <>
                <span className="tabular-nums font-mono text-emerald-400">
                  {totalContributions.toLocaleString()}
                </span>
                <span className="ml-1.5 font-normal text-zinc-400">{subtitle}</span>
              </>
            )}
          </div>
        </div>
        <Legend />
      </div>

      {/* Grid */}
      <div ref={gridViewportRef} className="relative z-10 overflow-x-auto no-scrollbar pb-1">
        <div className="flex min-w-0 flex-col">
          {/* Month labels row */}
          <div
            className="relative ml-6 h-3.5 mb-1"
            style={{ width: fittedGridWidth }}
          >
            {grid.monthLabels.map((m) => (
              <span
                key={`${m.col}-${m.label}`}
                className="absolute top-0 text-[9px] font-medium uppercase tracking-[0.06em] text-zinc-400"
                style={{ left: m.col * (fittedCellSize + fittedCellGap) }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex">
            {/* Weekday labels */}
            <div className="mr-1.5 flex flex-col" style={{ gap: fittedCellGap }}>
              {WEEKDAYS.map((wd, i) => (
                <span
                  key={i}
                  className="flex items-center text-[9px] font-medium tracking-tight text-zinc-500"
                  style={{ height: fittedCellSize, width: WEEKDAY_LABEL_WIDTH }}
                >
                  {wd}
                </span>
              ))}
            </div>

            {/* Cells */}
            <div className="flex" style={{ gap: fittedCellGap }}>
              {grid.weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col" style={{ gap: fittedCellGap }}>
                  {week.map((day, dIdx) => {
                    if (!day) {
                      return (
                        <span
                          key={`pad-${wIdx}-${dIdx}`}
                          style={{
                            width: fittedCellSize,
                            height: fittedCellSize,
                          }}
                        />
                      );
                    }
                    const lvl = level(day.count);
                    const fromEnd = days.length - 1 - days.indexOf(day);
                    const delay = Math.min(0.25, fromEnd * 0.001);

                    return (
                      <motion.button
                        key={day.date}
                        type="button"
                        initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                        animate={reduce ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
                        transition={
                          reduce
                            ? { duration: 0 }
                            : {
                                delay,
                                type: "spring",
                                stiffness: 420,
                                damping: 28,
                                mass: 0.6,
                              }
                        }
                        onPointerEnter={(e) => onCellEnter(e, day)}
                        onFocus={(e) => {
                          const cont = containerRef.current;
                          if (!cont) return;
                          const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                          const cr = cont.getBoundingClientRect();
                          tooltipX.set(r.left - cr.left + r.width / 2);
                          tooltipY.set(r.top - cr.top - 6);
                          setHover(day);
                        }}
                        onBlur={onLeave}
                        aria-label={`${day.count} updates on ${day.date}`}
                        className={cn(
                          "block rounded-[3px] outline-none cursor-pointer transition-colors",
                          "focus-visible:ring-2 focus-visible:ring-emerald-400",
                          LEVEL_BG[lvl]
                        )}
                        style={{
                          width: fittedCellSize,
                          height: fittedCellSize,
                          willChange: "transform",
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spring Tooltip */}
      <motion.div
        aria-hidden={!hover}
        style={{
          x: springX,
          y: springY,
          opacity: hover ? 1 : 0,
          translateX: "-50%",
          translateY: "-100%",
          willChange: "transform",
        }}
        transition={{ opacity: { duration: 0.12 } }}
        className={cn(
          "pointer-events-none absolute left-0 top-0 z-30 select-none rounded-lg px-2.5 py-1 text-[11px] font-medium tracking-tight",
          "border border-white/10 bg-zinc-900/95 text-zinc-100 backdrop-blur-md",
          "shadow-[0_8px_24px_-4px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)]"
        )}
      >
        {hover ? (
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="tabular-nums font-semibold text-emerald-400">
              {hover.count}
            </span>
            <span>{hover.count === 1 ? "update" : "updates"}</span>
            <span className="text-zinc-500">·</span>
            <span className="text-zinc-400">{formatDate(hover.date)}</span>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
      <span>Less</span>
      {LEVEL_BG.map((bg, i) => (
        <span
          key={i}
          className={cn("h-[10px] w-[10px] rounded-[3px]", bg)}
        />
      ))}
      <span>More</span>
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
