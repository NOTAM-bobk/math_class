import test from "node:test";
import assert from "node:assert/strict";
import { cachedCatalog, isGameList } from "./catalog";

const CACHE_KEY = "polytrack_catalog_cache";

function installStorage(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial));
  (globalThis as { localStorage?: unknown }).localStorage = {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  };
  return store;
}

test("isGameList accepts only arrays of games with an id", () => {
  assert.equal(isGameList([]), true);
  assert.equal(isGameList([{ id: "pong", name: "Pong" }]), true);
  assert.equal(isGameList([{ id: "pong" }, { name: "Pong" }]), false);
  assert.equal(isGameList([null]), false);
  assert.equal(isGameList({ games: [] }), false);
  assert.equal(isGameList("[]"), false);
  assert.equal(isGameList(undefined), false);
});

test("cachedCatalog is empty on a device that never loaded the list", () => {
  installStorage();
  assert.deepEqual(cachedCatalog(), []);
});

test("cachedCatalog returns the copy this device saved", () => {
  installStorage({
    [CACHE_KEY]: JSON.stringify([
      { id: "pong", name: "Pong" },
      { id: "snake", name: "Snake" },
    ]),
  });
  assert.deepEqual(
    cachedCatalog().map((game) => game.id),
    ["pong", "snake"]
  );
});

test("cachedCatalog survives a corrupt cache", () => {
  installStorage({ [CACHE_KEY]: "{not json" });
  assert.deepEqual(cachedCatalog(), []);
  installStorage({ [CACHE_KEY]: JSON.stringify({ games: [{ id: "pong" }] }) });
  assert.deepEqual(cachedCatalog(), []);
});

test("cachedCatalog drops entries that are not games", () => {
  installStorage({
    [CACHE_KEY]: JSON.stringify([{ id: "pong", name: "Pong" }, { name: "No id" }, null, "x"]),
  });
  assert.deepEqual(
    cachedCatalog().map((game) => game.id),
    ["pong"]
  );
});
