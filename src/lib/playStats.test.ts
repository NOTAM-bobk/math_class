import test from "node:test";
import assert from "node:assert/strict";
import { formatPlayTime, shouldCountTick } from "./playStats";

const FIVE_MINUTES_MS = 5 * 60 * 1000;

test("the hub counts time while it is on screen", () => {
  assert.equal(
    shouldCountTick({ elapsedMs: 1000, enabled: true, visible: true, hasSession: false }),
    true
  );
});

test("a hidden hub with no game open does not count", () => {
  assert.equal(
    shouldCountTick({ elapsedMs: 1000, enabled: true, visible: false, hasSession: false }),
    false
  );
});

test("a hidden hub still counts while an in-page game session is open", () => {
  assert.equal(
    shouldCountTick({ elapsedMs: 1000, enabled: true, visible: false, hasSession: true }),
    true
  );
});

test("the always-count switch stops every tick", () => {
  assert.equal(
    shouldCountTick({ elapsedMs: 1000, enabled: false, visible: true, hasSession: true }),
    false
  );
});

test("sleep and frozen tabs are skipped, a normal gap is not", () => {
  assert.equal(
    shouldCountTick({ elapsedMs: FIVE_MINUTES_MS, enabled: true, visible: true, hasSession: false }),
    true,
    "five minutes is still a normal background gap"
  );
  assert.equal(
    shouldCountTick({
      elapsedMs: FIVE_MINUTES_MS + 1,
      enabled: true,
      visible: true,
      hasSession: false,
    }),
    false,
    "anything longer means the device slept, so it must not be billed as play time"
  );
});

test("zero or backwards clock readings never add time", () => {
  assert.equal(shouldCountTick({ elapsedMs: 0, enabled: true, visible: true, hasSession: true }), false);
  assert.equal(shouldCountTick({ elapsedMs: -2500, enabled: true, visible: true, hasSession: true }), false);
});

test("formatPlayTime reads the way a person says it", () => {
  assert.equal(formatPlayTime(0), "0s");
  assert.equal(formatPlayTime(-1000), "0s");
  assert.equal(formatPlayTime(999), "0s");
  assert.equal(formatPlayTime(1500), "1s");
  assert.equal(formatPlayTime(61_000), "1m 01s");
  assert.equal(formatPlayTime(3_600_000), "1h 00m 00s");
  assert.equal(formatPlayTime(7_384_000), "2h 03m 04s");
});
