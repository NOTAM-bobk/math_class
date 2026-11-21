import test from "node:test";
import assert from "node:assert/strict";
import { computeVisit, dayKey, dayNumber, sanitizeStreak, type StreakData } from "./streak";

const EMPTY: StreakData = { current: 0, longest: 0, totalDays: 0, lastVisit: null, history: [] };

/** The local calendar key `days` before 21 November 2026. */
function daysBefore(days: number, from = new Date(2026, 10, 21, 12)): string {
  const date = new Date(from);
  date.setDate(date.getDate() - days);
  return dayKey(date);
}

test("dayKey reports the visitor's local calendar day", () => {
  assert.equal(dayKey(new Date(2026, 10, 21, 0, 0, 1)), "2026-11-21");
  assert.equal(dayKey(new Date(2026, 10, 21, 23, 59, 59)), "2026-11-21");
  assert.equal(dayKey(new Date(2026, 0, 5, 9)), "2026-01-05");
});

test("dayNumber counts whole calendar days, whatever the time of year", () => {
  const today = dayNumber("2026-11-21");
  const yesterday = dayNumber("2026-11-20");
  assert.ok(today !== null && yesterday !== null);
  assert.equal(today! - yesterday!, 1);
  // Across a month boundary and across a DST change in most zones.
  assert.equal(dayNumber("2026-11-01")! - dayNumber("2026-10-31")!, 1);
  assert.equal(dayNumber("2026-03-31")! - dayNumber("2026-03-30")!, 1);
});

test("dayNumber rejects impossible and malformed days", () => {
  assert.equal(dayNumber("2026-02-30"), null);
  assert.equal(dayNumber("2026-13-01"), null);
  assert.equal(dayNumber("21-11-2026"), null);
  assert.equal(dayNumber(""), null);
  assert.equal(dayNumber(null), null);
});

test("a first visit starts the run at one day", () => {
  const next = computeVisit(EMPTY, new Date(2026, 10, 21, 9, 30));
  assert.deepEqual(
    { current: next.current, longest: next.longest, totalDays: next.totalDays, lastVisit: next.lastVisit },
    { current: 1, longest: 1, totalDays: 1, lastVisit: "2026-11-21" }
  );
  assert.deepEqual(next.history, ["2026-11-21"]);
});

test("the same local day never counts twice, even on a reload", () => {
  const first = computeVisit(EMPTY, new Date(2026, 10, 21, 8));
  const again = computeVisit(first, new Date(2026, 10, 21, 22, 45));
  assert.equal(again, first, "an unchanged visit must return the stored data untouched");
});

test("visiting on consecutive days extends the run", () => {
  let data = computeVisit(EMPTY, new Date(2026, 10, 20, 12));
  data = computeVisit(data, new Date(2026, 10, 21, 12));
  assert.equal(data.current, 2);
  assert.equal(data.totalDays, 2);
  assert.deepEqual(data.history, ["2026-11-20", "2026-11-21"]);
});

test("missing a day starts a new run but keeps the longest", () => {
  let data = computeVisit(EMPTY, new Date(2026, 10, 18, 12));
  data = { ...data, longest: 9 };
  // No visit on the 19th or 20th.
  const after = computeVisit(data, new Date(2026, 10, 21, 12));
  assert.equal(after.current, 1);
  assert.equal(after.longest, 9);
  assert.equal(after.totalDays, 2);
});

test("a clock that moved backwards leaves the saved run alone", () => {
  const saved = computeVisit(EMPTY, new Date(2026, 10, 21, 12));
  const earlier = computeVisit(saved, new Date(2026, 10, 19, 12));
  assert.equal(earlier, saved);
});

test("history stays sorted, deduped and capped", () => {
  const history = Array.from({ length: 60 }, (_, index) => daysBefore(60 - index));
  const previous: StreakData = {
    current: 60,
    longest: 60,
    totalDays: 60,
    lastVisit: history[history.length - 1],
    history,
  };
  const next = computeVisit(previous, new Date(2026, 10, 21, 12));
  assert.equal(next.history.length, 60);
  assert.equal(next.history[59], "2026-11-21");
  assert.equal(next.current, 61);
});

test("sanitizeStreak repairs anything a device stored", () => {
  assert.deepEqual(sanitizeStreak(undefined), EMPTY);
  assert.deepEqual(sanitizeStreak("nonsense"), EMPTY);
  assert.deepEqual(sanitizeStreak({ history: "nope" }).history, []);

  const repaired = sanitizeStreak({
    current: 3.7,
    longest: 1,
    totalDays: 1,
    lastVisit: "2026-11-21",
    history: ["2026-11-21", "2026-11-19", "2026-11-21", "not-a-day"],
  });
  assert.deepEqual(repaired.history, ["2026-11-19", "2026-11-21"]);
  assert.equal(repaired.current, 3);
  assert.equal(repaired.longest, 3, "longest can never be below the current run");
  assert.equal(repaired.totalDays, 2, "totalDays can never be below the recorded days");

  const withoutLastVisit = sanitizeStreak({ history: ["2026-11-19", "2026-11-20"] });
  assert.equal(withoutLastVisit.lastVisit, "2026-11-20");
});

test("sanitizeStreak drops negative and non-finite counters", () => {
  const repaired = sanitizeStreak({
    current: -4,
    longest: Number.POSITIVE_INFINITY,
    totalDays: Number.NaN,
    lastVisit: "2026-11-21",
    history: ["2026-11-21"],
  });
  assert.equal(repaired.current, 0);
  assert.equal(repaired.longest, 0);
  assert.equal(repaired.totalDays, 1);
});
