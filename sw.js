// Notification ad push worker.
//
// The offline copy lives in this same worker because only one service worker can
// own the "/" scope. The vendor script is optional: if the ad network's host is
// unreachable (or blocked on this network), the try/catch keeps the offline
// handlers below working.
const adkPushParams = {
	host: 'push.bvsrv.com',
	channelId: 128,
	pubKey: 'BPg5N2jQ21bJcPsMf4-dC0DsznLBXnjsf71qb8oqF2g2bA4RH_527Em0SF1Dy-YBxR2B8wp1Tp4qKtZ8ujOwrw4'
};

try {
	importScripts('//data.bvsrv.com/webpush/scripts/v1.1/sw.js');
} catch (error) {
	console.warn('Notification push script unavailable; offline caching still works.', error);
}

// ---------------------------------------------------------------------------
// Offline copy
// ---------------------------------------------------------------------------

const SW_VERSION = "1.7.3";
const OFFLINE_CACHE = "polytrack-offline-v1";
const OFFLINE_META_CACHE = "polytrack-offline-meta-v1";
// Per-game packs downloaded from Settings live in their own cache so one game
// can be removed without touching the full offline copy.
const GAME_PACK_CACHE = "polytrack-game-packs-v1";
const OFFLINE_CONFIG_URL = "/__polytrack_offline_config__";
const OFFLINE_MANIFEST_URL = "/offline-manifest.json";
const REMOTE_CACHE_HOSTS = ["cdn.tailwindcss.com", "fonts.googleapis.com", "fonts.gstatic.com"];

// The bundle changes on every deploy. Serving the cached copy first left
// returning visitors on an old build until a second page load, so these go to
// the network first and only fall back to the cached copy when it is offline.
const NETWORK_FIRST_PATHS = ["/dist/home.bundle.js", "/dist/styles.css", "/", "/index.html"];

const DEFAULT_CONFIG = {
	requested: false,
	scheduleEnabled: false,
	startTime: "08:00",
	endTime: "15:00",
};

let configPromise = null;

function isCacheable(response) {
	return !!response && response.status !== 206 && (response.ok || response.type === "opaque");
}

function isRemoteCacheHost(hostname) {
	return REMOTE_CACHE_HOSTS.includes(hostname);
}

async function getConfig() {
	if (!configPromise) {
		configPromise = (async () => {
			try {
				const meta = await caches.open(OFFLINE_META_CACHE);
				const response = await meta.match(OFFLINE_CONFIG_URL);
				if (!response) return { ...DEFAULT_CONFIG };
				const saved = await response.json();
				return { ...DEFAULT_CONFIG, ...saved };
			} catch (error) {
				return { ...DEFAULT_CONFIG };
			}
		})();
	}
	return configPromise;
}

async function saveConfig(config) {
	const next = { ...DEFAULT_CONFIG, ...(config || {}) };
	configPromise = Promise.resolve(next);
	try {
		const meta = await caches.open(OFFLINE_META_CACHE);
		await meta.put(
			OFFLINE_CONFIG_URL,
			new Response(JSON.stringify(next), {
				headers: { "Content-Type": "application/json" },
			}),
		);
	} catch (error) {
		// The in-memory config still applies for this worker lifetime.
	}
}

function isInScheduleWindow(config, now = new Date()) {
	if (!config || !config.scheduleEnabled) return false;
	const toMinutes = (value) => {
		const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(String(value || ""));
		if (!match) return null;
		return Number(match[1]) * 60 + Number(match[2]);
	};
	const start = toMinutes(config.startTime);
	const end = toMinutes(config.endTime);
	if (start === null || end === null) return false;
	// Equal times mean the whole day, so a visitor cannot accidentally create a window that never runs.
	if (start === end) return true;
	const current = now.getHours() * 60 + now.getMinutes();
	return start < end ? current >= start && current < end : current >= start || current < end;
}

async function refresh(cache, request) {
	try {
		const response = await fetch(request);
		if (isCacheable(response)) await cache.put(request, response.clone());
	} catch (error) {
		// Keeping the cached copy is the whole point when the network fails.
	}
}

async function offlinePage() {
	return new Response(
		`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline</title></head><body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#09090b;color:#fafafa;font-family:system-ui,sans-serif;text-align:center"><div><h1 style="font-size:1.1rem;margin:0 0 .4rem">This page is not in the offline copy</h1><p style="margin:0;color:#a1a1aa;font-size:.85rem">Open Settings while connected and choose &ldquo;Download for offline&rdquo; to include it.</p></div></body></html>`,
		{
			status: 200,
			headers: { "Content-Type": "text/html; charset=utf-8" },
		},
	);
}

async function handleSameOrigin(request) {
	const cache = await caches.open(OFFLINE_CACHE);
	const config = await getConfig();
	// A downloaded game pack is stored separately from the full offline copy; a
	// hit there must not be refreshed into the offline cache, or deleting the
	// pack would leave its files behind.
	const fromOfflineCache = request.cache === "reload" ? undefined : await cache.match(request);
	const fromPack =
		request.cache === "reload" ? undefined : await (await caches.open(GAME_PACK_CACHE)).match(request);
	const cached = fromOfflineCache || fromPack;
	const preferCache = config.requested && isInScheduleWindow(config);

	const url = new URL(request.url);
	const isCorePath = NETWORK_FIRST_PATHS.includes(url.pathname);

	// Inside the scheduled window the downloaded copy wins for games and assets,
	// but core application bundles and HTML navigation still hit the network first
	// when connected so updates are never blocked.
	if (preferCache && cached && !isCorePath && request.mode !== "navigate") {
		return cached;
	}

	if (isCorePath) {
		try {
			const response = await fetch(request);
			if (isCacheable(response)) void cache.put(request, response.clone());
			return response;
		} catch (error) {
			return cached || (await cache.match(request, { ignoreSearch: true })) || Response.error();
		}
	}

	if (request.mode === "navigate") {
		try {
			const response = await fetch(request);
			if (isCacheable(response)) void cache.put(request, response.clone());
			return response;
		} catch (error) {
			const pathname = new URL(request.url).pathname;
			const directoryIndex = pathname.endsWith("/")
				? `${pathname}index.html`
				: `${pathname}/index.html`;
			return (
				(await cache.match(request)) ||
				(await caches.match(request)) ||
				(await cache.match(directoryIndex)) ||
				(await caches.match(directoryIndex)) ||
				(await cache.match("/index.html")) ||
				(await cache.match("/")) ||
				(await offlinePage())
			);
		}
	}

	if (cached) {
		if (fromOfflineCache) void refresh(cache, request);
		return cached;
	}

	try {
		const response = await fetch(request);
		if (isCacheable(response)) void cache.put(request, response.clone());
		return response;
	} catch (error) {
		return (
			(await cache.match(request, { ignoreSearch: true })) ||
			(await caches.match(request, { ignoreSearch: true })) ||
			Response.error()
		);
	}
}

async function handleRemote(request) {
	const cache = await caches.open(OFFLINE_CACHE);
	const cached = request.cache === "reload" ? undefined : await cache.match(request);
	if (cached) {
		void refresh(cache, request);
		return cached;
	}
	try {
		const response = await fetch(request);
		if (isCacheable(response)) void cache.put(request, response.clone());
		return response;
	} catch (error) {
		return Response.error();
	}
}

self.addEventListener("install", (event) => {
	event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		(async () => {
			try {
				const names = await caches.keys();
				await Promise.all(
					names
						.filter(
							(name) =>
								name.startsWith("polytrack-offline-") &&
								name !== OFFLINE_CACHE &&
								name !== OFFLINE_META_CACHE,
						)
						.map((name) => caches.delete(name)),
				);
			} catch (error) {
				// Cache cleanup is best effort.
			}
			await self.clients.claim();
		})(),
	);
});

self.addEventListener("fetch", (event) => {
	const request = event.request;
	if (request.method !== "GET") return;
	if (request.cache === "only-if-cached" && request.mode !== "same-origin") return;

	const url = new URL(request.url);

	if (url.origin === self.location.origin) {
		if (url.pathname === "/sw.js" || url.pathname === OFFLINE_MANIFEST_URL || url.pathname === "/version.json") return;
		if (url.pathname.startsWith("/api/")) return;
		// A per-game pack fetch is stored by the page in its own cache; caching
		// it here too would keep it after the pack is removed.
		if (request.headers.get("X-Polytrack-Pack")) {
			event.respondWith(fetch(request));
			return;
		}
		event.respondWith(handleSameOrigin(request));
		return;
	}

	if (isRemoteCacheHost(url.hostname)) {
		event.respondWith(handleRemote(request));
	}
});

self.addEventListener("message", (event) => {
	const data = event.data || {};

	if (data.type === "OFFLINE_CONFIG") {
		event.waitUntil(saveConfig(data.config));
	} else if (data.type === "SKIP_WAITING") {
		self.skipWaiting();
	}
});
