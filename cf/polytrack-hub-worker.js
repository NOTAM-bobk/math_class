const ALLOWED = [
  "http://localhost:3002",
  "http://127.0.0.1:3002",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
];
const HUB = /^https:\/\/([a-z0-9-]+\.)?benlaunches\.icu$/;
// The site's own mirrors and previews call the Worker directly when their host
// has no /api/hub proxy, so chat and reactions keep saving to Cloudflare there.
const MIRROR =
  /^https:\/\/([a-z0-9-]+\.)*(workers\.dev|deno\.net|snapdeploy\.app|style\.dev)$/i;
const LOCAL = /^http:\/\/(localhost|127\.0\.0\.1)(:\d{2,5})?$/;
const CHAT_IMAGE_PATH = /^\/api\/chat\/images\/([a-zA-Z0-9-]{8,64})$/;
const CHAT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
// Chat photos are kept in D1 in fixed-size pieces: one phone photo is bigger
// than a single bound value, and the worker only has a database binding.
const CHAT_IMAGE_MAX_BYTES = 500 * 1024;
const CHAT_IMAGE_CHUNK_BYTES = 48 * 1024;
// Photos are kept for a month. The deployment has no scheduled trigger, so the
// sweep runs when the chat is used, at most once an hour.
const CHAT_IMAGE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const CHAT_IMAGE_SWEEP_MS = 60 * 60 * 1000;
// "Online now" counts the browser tabs that sent a heartbeat in the last minute
// and a half, so a closed tab drops out on its own without a sign-out call.
const PRESENCE_TTL_MS = 90 * 1000;
const PRESENCE_MAX_SESSIONS = 20_000;
let ready;

const cors = (r) => {
  const o = r.headers.get("Origin") || "";
  const h = {
    Vary: "Origin",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, authorization, x-admin-password, x-vercel-admin-verified, x-hub-internal-key",
    "Access-Control-Max-Age": "86400",
  };
  if (ALLOWED.includes(o) || HUB.test(o) || MIRROR.test(o) || LOCAL.test(o)) {
    h["Access-Control-Allow-Origin"] = o;
  }
  return h;
};

const json = (r, d, s = 200) => {
  const h = cors(r);
  h["content-type"] = "application/json; charset=utf-8";
  h["cache-control"] = "no-store";
  return new Response(JSON.stringify(d), { status: s, headers: h });
};

const fail = (r, e, s = 400, extra = {}) => json(r, { ok: false, error: e, ...extra }, s);

const read = async (r) => {
  try {
    const b = await r.json();
    return b && typeof b === "object" ? b : null;
  } catch {
    return null;
  }
};

const clean = (v, n, f = "") => String(v == null ? "" : v).trim().slice(0, n) || f;

const ip = (r) => r.headers.get("cf-connecting-ip") || r.headers.get("x-forwarded-for") || "unknown";

const digest = async (v) => {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(v));
  return Array.from(new Uint8Array(d))
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
};

// Header-only claims are not authentication: anyone can send them. The Vercel
// proxy proves itself with a shared key that only the two deployments know.
const isTrustedProxy = (r, e) => {
  const key = e.HUB_INTERNAL_KEY;
  if (!key) return false;
  if (r.headers.get("x-vercel-admin-verified") !== "1") return false;
  return equal(r.headers.get("x-hub-internal-key") || "", key);
};

const equal = (a, b) => {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let n = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) n |= (x[i] || 0) ^ (y[i] || 0);
  return n === 0;
};

// CHECKOUT (temporary until a payment provider is connected)
const CHECKOUT_PRICE_CENTS = 100;
const CHECKOUT_SESSION_DAYS = 7;
const CHECKOUT_PASSWORD_ITERATIONS = 100000;
const CHECKOUT_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const hex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

const unhex = (value) => {
  const bytes = new Uint8Array(value.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(value.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
};

const randomHex = (bytes = 32) => {
  const buffer = new Uint8Array(bytes);
  crypto.getRandomValues(buffer);
  return hex(buffer);
};

async function deriveCheckoutPassword(password, salt) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: unhex(salt),
      iterations: CHECKOUT_PASSWORD_ITERATIONS,
      hash: "SHA-256",
    },
    key,
    256
  );
  return hex(bits);
}

const checkoutBearer = (r) => {
  const match = (r.headers.get("authorization") || "").match(/^Bearer\s+([a-f0-9]{64})$/i);
  return match ? match[1].toLowerCase() : "";
};

async function currentCheckoutUser(r, e) {
  const token = checkoutBearer(r);
  if (!token) return null;
  const tokenHash = await digest(token);
  const row = await e.DB.prepare(
    "SELECT u.id,u.name,u.email,s.expires_at FROM checkout_sessions s JOIN checkout_users u ON u.id = s.user_id WHERE s.token_hash = ?"
  )
    .bind(tokenHash)
    .first();
  if (!row) return null;
  if (Date.parse(row.expires_at) <= Date.now()) {
    await e.DB.prepare("DELETE FROM checkout_sessions WHERE token_hash = ?").bind(tokenHash).run();
    return null;
  }
  return { id: row.id, name: row.name, email: row.email };
}

async function openCheckoutSession(e, userId) {
  const token = randomHex(32);
  const now = new Date();
  const expires = new Date(now.getTime() + CHECKOUT_SESSION_DAYS * 86400000).toISOString();
  await e.DB.prepare(
    "INSERT INTO checkout_sessions(token_hash,user_id,created_at,expires_at) VALUES(?,?,?,?)"
  )
    .bind(await digest(token), userId, now.toISOString(), expires)
    .run();
  return token;
}

async function checkoutSignup(r, e) {
  if (r.method !== "POST") return fail(r, "Use POST to create an account.", 405);
  const limit = await checkRateLimit(e.DB, "checkout_signup:" + (await digest(ip(r))), 5, 3600);
  if (!limit.allowed) return fail(r, "Too many accounts from this connection. Try again later.", 429);

  const b = await read(r);
  const name = clean(b?.name, 60);
  const email = clean(b?.email, 200).toLowerCase();
  const password = typeof b?.password === "string" ? b.password : "";
  if (name.length < 2) return fail(r, "Enter the name for the account.", 422);
  if (name.length > 60) return fail(r, "Keep the name under 60 characters.", 422);
  if (!CHECKOUT_EMAIL.test(email)) return fail(r, "Enter a valid email address.", 422);
  if (password.length < 8) return fail(r, "Use at least 8 characters for the password.", 422);
  if (password.length > 200) return fail(r, "That password is too long.", 422);

  const existing = await e.DB.prepare("SELECT id FROM checkout_users WHERE email = ?")
    .bind(email)
    .first();
  if (existing) return fail(r, "An account with that email already exists. Sign in instead.", 409);

  const id = crypto.randomUUID();
  const salt = randomHex(16);
  const hash = await deriveCheckoutPassword(password, salt);
  try {
    await e.DB.prepare(
      "INSERT INTO checkout_users(id,created_at,name,email,password_hash,password_salt) VALUES(?,?,?,?,?,?)"
    )
      .bind(id, new Date().toISOString(), name, email, hash, salt)
      .run();
  } catch {
    return fail(r, "An account with that email already exists. Sign in instead.", 409);
  }

  const token = await openCheckoutSession(e, id);
  return json(r, { ok: true, user: { id, name, email }, token }, 201);
}

async function checkoutSignin(r, e) {
  if (r.method !== "POST") return fail(r, "Use POST to sign in.", 405);
  const limit = await checkRateLimit(e.DB, "checkout_signin:" + (await digest(ip(r))), 15, 600);
  if (!limit.allowed) {
    return fail(r, `Too many sign-in attempts. Try again in ${Math.ceil(limit.resetIn / 60)} minute(s).`, 429);
  }

  const b = await read(r);
  const email = clean(b?.email, 200).toLowerCase();
  const password = typeof b?.password === "string" ? b.password : "";
  if (!CHECKOUT_EMAIL.test(email) || !password) return fail(r, "Email or password is incorrect.", 401);

  const user = await e.DB.prepare(
    "SELECT id,name,email,password_hash,password_salt FROM checkout_users WHERE email = ?"
  )
    .bind(email)
    .first();
  const hash = user ? await deriveCheckoutPassword(password, user.password_salt) : "";
  if (!user || !equal(hash, user.password_hash)) {
    return fail(r, "Email or password is incorrect.", 401);
  }

  const token = await openCheckoutSession(e, user.id);
  return json(r, {
    ok: true,
    user: { id: user.id, name: user.name, email: user.email },
    token,
  });
}

async function checkoutSession(r, e) {
  if (r.method !== "GET") return fail(r, "Use GET for the current session.", 405);
  const user = await currentCheckoutUser(r, e);
  if (!user) return fail(r, "Sign in to continue.", 401);
  return json(r, { ok: true, user });
}

async function checkoutSignout(r, e) {
  if (r.method !== "POST") return fail(r, "Use POST to sign out.", 405);
  const token = checkoutBearer(r);
  if (token) {
    await e.DB.prepare("DELETE FROM checkout_sessions WHERE token_hash = ?")
      .bind(await digest(token))
      .run();
  }
  return json(r, { ok: true });
}

async function checkoutOrders(r, e) {
  if (r.method !== "POST") return fail(r, "Use POST to place an order.", 405);
  const user = await currentCheckoutUser(r, e);
  if (!user) return fail(r, "Sign in to finish the order.", 401);

  const limit = await checkRateLimit(e.DB, "checkout_order:" + user.id, 20, 3600);
  if (!limit.allowed) return fail(r, "Too many orders. Try again later.", 429);

  const b = await read(r);
  const method = clean(b?.method, 20);
  if (!["card", "paypal", "apple"].includes(method)) {
    return fail(r, "Choose a payment method.", 422);
  }
  const cardName = clean(b?.cardName, 80);
  let cardLast4 = clean(b?.cardLast4, 4);
  if (!/^\d{4}$/.test(cardLast4)) cardLast4 = "";
  if (method === "card" && !cardLast4) return fail(r, "That card number is incomplete.", 422);

  const id = `MC-${randomHex(4).toUpperCase()}`;
  const createdAt = new Date().toISOString();
  await e.DB.prepare(
    "INSERT INTO checkout_orders(id,created_at,user_id,name,email,method,amount_cents,card_name,card_last4,ip_hash,status) VALUES(?,?,?,?,?,?,?,?,?,?,'received')"
  )
    .bind(
      id,
      createdAt,
      user.id,
      user.name,
      user.email,
      method,
      CHECKOUT_PRICE_CENTS,
      cardName,
      cardLast4,
      await digest(ip(r))
    )
    .run();

  return json(
    r,
    {
      ok: true,
      order: {
        id,
        createdAt,
        method,
        amountCents: CHECKOUT_PRICE_CENTS,
        cardName,
        cardLast4,
      },
    },
    201
  );
}

async function adminCheckoutOrders(r, e) {
  const ipHash = await digest(ip(r));
  const b = await read(r);
  const given = r.headers.get("x-admin-password") || b?.password || "";

  let authorized = false;
  if (isTrustedProxy(r, e)) {
    authorized = true;
  } else if (e.ADMIN_PASSWORD && equal(given, e.ADMIN_PASSWORD)) {
    authorized = true;
  }

  if (!authorized) {
    const limit = await checkRateLimit(e.DB, "admin_orders_fail:" + ipHash, 5, 600);
    if (!limit.allowed) {
      return fail(
        r,
        `Too many admin attempts. Try again in ${Math.ceil(limit.resetIn / 60)} minute(s).`,
        429
      );
    }
    return fail(r, "Unauthorized. Incorrect admin password.", 401);
  }

  const q = await e.DB.prepare(
    "SELECT id,created_at,name,email,method,amount_cents,card_name,card_last4,status FROM checkout_orders ORDER BY created_at DESC LIMIT 200"
  ).all();
  const total = await e.DB.prepare("SELECT COUNT(*) AS n FROM checkout_orders").first();
  const accounts = await e.DB.prepare("SELECT COUNT(*) AS n FROM checkout_users").first();

  return json(r, {
    ok: true,
    total: Number(total?.n || 0),
    users: Number(accounts?.n || 0),
    items: (q.results || []).map((row) => ({
      id: row.id,
      createdAt: row.created_at,
      name: row.name,
      email: row.email,
      method: row.method,
      amountCents: Number(row.amount_cents || 0),
      cardName: row.card_name,
      cardLast4: row.card_last4,
      status: row.status,
    })),
  });
}

function schema(e) {
  if (!ready) {
    ready = e.DB.batch([
      e.DB.prepare(
        "CREATE TABLE IF NOT EXISTS chat_messages(id TEXT PRIMARY KEY,created_at TEXT NOT NULL,author TEXT NOT NULL,text TEXT NOT NULL,ip_hash TEXT NOT NULL DEFAULT '')"
      ),
      e.DB.prepare(
        "CREATE TABLE IF NOT EXISTS chat_reactions(message_id TEXT NOT NULL,emoji TEXT NOT NULL,author TEXT NOT NULL,created_at TEXT NOT NULL,PRIMARY KEY(message_id,emoji,author))"
      ),
      e.DB.prepare(
        "CREATE INDEX IF NOT EXISTS idx_chat_reactions_message ON chat_reactions(message_id)"
      ),
      e.DB.prepare(
        "CREATE TABLE IF NOT EXISTS page_views(id INTEGER PRIMARY KEY CHECK(id=1),total INTEGER NOT NULL DEFAULT 0,updated_at TEXT NOT NULL)"
      ),
      e.DB.prepare(
        "CREATE TABLE IF NOT EXISTS submissions(id INTEGER PRIMARY KEY AUTOINCREMENT,created_at TEXT NOT NULL,url TEXT NOT NULL DEFAULT '',message TEXT NOT NULL,ip_hash TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'new')"
      ),
      e.DB.prepare(
        "CREATE TABLE IF NOT EXISTS game_clicks(game_id TEXT PRIMARY KEY,game_name TEXT NOT NULL,game_url TEXT NOT NULL DEFAULT '',clicks INTEGER NOT NULL DEFAULT 0,updated_at TEXT NOT NULL)"
      ),
      e.DB.prepare(
        "CREATE TABLE IF NOT EXISTS bug_reports(id INTEGER PRIMARY KEY AUTOINCREMENT,created_at TEXT NOT NULL,title TEXT NOT NULL DEFAULT '',description TEXT NOT NULL,game_url TEXT NOT NULL DEFAULT '',page_url TEXT NOT NULL DEFAULT '',browser_info TEXT NOT NULL DEFAULT '',ip_hash TEXT NOT NULL DEFAULT '',ip TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'open')"
      ),
      e.DB.prepare(
        "CREATE TABLE IF NOT EXISTS rate_limits(key TEXT PRIMARY KEY,count INTEGER NOT NULL DEFAULT 1,first_seen INTEGER NOT NULL,last_seen INTEGER NOT NULL)"
      ),
      e.DB.prepare(
        "CREATE TABLE IF NOT EXISTS game_flags(game_id TEXT PRIMARY KEY,verified INTEGER NOT NULL DEFAULT 0,buggy INTEGER NOT NULL DEFAULT 0,not_mobile INTEGER NOT NULL DEFAULT 0,blocked INTEGER NOT NULL DEFAULT 0,updated_at TEXT NOT NULL)"
      ),
      e.DB.prepare(
        "CREATE TABLE IF NOT EXISTS admin_settings(key TEXT PRIMARY KEY,value TEXT NOT NULL,updated_at TEXT NOT NULL)"
      ),
      e.DB.prepare(
        "CREATE TABLE IF NOT EXISTS chat_images(id TEXT PRIMARY KEY,content_type TEXT NOT NULL,size INTEGER NOT NULL,created_at TEXT NOT NULL,ip_hash TEXT NOT NULL DEFAULT '')"
      ),
      e.DB.prepare(
        "CREATE TABLE IF NOT EXISTS chat_image_chunks(image_id TEXT NOT NULL,idx INTEGER NOT NULL,data BLOB NOT NULL,PRIMARY KEY(image_id,idx))"
      ),
      e.DB.prepare(
        "CREATE TABLE IF NOT EXISTS chat_maintenance(key TEXT PRIMARY KEY,ran_at TEXT NOT NULL)"
      ),
      e.DB.prepare(
        "CREATE TABLE IF NOT EXISTS presence_sessions(id TEXT PRIMARY KEY,last_seen INTEGER NOT NULL)"
      ),
      e.DB.prepare(
        "CREATE INDEX IF NOT EXISTS idx_presence_last_seen ON presence_sessions(last_seen)"
      ),
      // Temporary Ultra checkout accounts. Passwords are PBKDF2-SHA256 with a
      // per-account salt; sessions are random tokens stored as SHA-256 hashes.
      e.DB.prepare(
        "CREATE TABLE IF NOT EXISTS checkout_users(id TEXT PRIMARY KEY,created_at TEXT NOT NULL,name TEXT NOT NULL,email TEXT NOT NULL UNIQUE,password_hash TEXT NOT NULL,password_salt TEXT NOT NULL)"
      ),
      e.DB.prepare(
        "CREATE TABLE IF NOT EXISTS checkout_sessions(token_hash TEXT PRIMARY KEY,user_id TEXT NOT NULL,created_at TEXT NOT NULL,expires_at TEXT NOT NULL)"
      ),
      e.DB.prepare(
        "CREATE INDEX IF NOT EXISTS idx_checkout_sessions_user ON checkout_sessions(user_id)"
      ),
      // Card numbers and CVC never reach the Worker; orders keep only the
      // cardholder name and the last four digits for the admin receipt.
      e.DB.prepare(
        "CREATE TABLE IF NOT EXISTS checkout_orders(id TEXT PRIMARY KEY,created_at TEXT NOT NULL,user_id TEXT NOT NULL,name TEXT NOT NULL,email TEXT NOT NULL,method TEXT NOT NULL,amount_cents INTEGER NOT NULL,card_name TEXT NOT NULL DEFAULT '',card_last4 TEXT NOT NULL DEFAULT '',ip_hash TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'received')"
      ),
      e.DB.prepare(
        "CREATE INDEX IF NOT EXISTS idx_checkout_orders_user ON checkout_orders(user_id)"
      ),
    ])
      // Deployments created before the "not mobile optimized" tag have a game_flags
      // table without its column, so add it once instead of failing every flag read.
      .then(async () => {
        try {
          await e.DB.prepare("ALTER TABLE game_flags ADD COLUMN not_mobile INTEGER NOT NULL DEFAULT 0").run();
        } catch {}
        // Chats created before photos existed have no image column either.
        try {
          await e.DB.prepare("ALTER TABLE chat_messages ADD COLUMN image_url TEXT NOT NULL DEFAULT ''").run();
        } catch {}
        // Reports used to keep only a hash of the address, so add the column the
        // admin panel reads once instead of failing every report read.
        try {
          await e.DB.prepare("ALTER TABLE bug_reports ADD COLUMN ip TEXT NOT NULL DEFAULT ''").run();
        } catch {}
      })
      .catch((x) => {
        ready = null;
        return Promise.reject(x);
      });
  }
  return ready;
}

async function checkRateLimit(db, key, maxRequests, windowSeconds) {
  try {
    const now = Math.floor(Date.now() / 1000);
    const row = await db.prepare("SELECT count, first_seen FROM rate_limits WHERE key = ?").bind(key).first();
    if (!row) {
      await db.prepare("INSERT INTO rate_limits (key, count, first_seen, last_seen) VALUES (?, 1, ?, ?)").bind(key, now, now).run();
      return { allowed: true, remaining: maxRequests - 1, resetIn: windowSeconds };
    }

    if (now - row.first_seen > windowSeconds) {
      await db.prepare("UPDATE rate_limits SET count = 1, first_seen = ?, last_seen = ? WHERE key = ?").bind(now, now, key).run();
      return { allowed: true, remaining: maxRequests - 1, resetIn: windowSeconds };
    }

    if (row.count >= maxRequests) {
      const resetIn = Math.max(1, windowSeconds - (now - row.first_seen));
      return { allowed: false, remaining: 0, resetIn };
    }

    await db.prepare("UPDATE rate_limits SET count = count + 1, last_seen = ? WHERE key = ?").bind(now, key).run();
    return {
      allowed: true,
      remaining: maxRequests - (row.count + 1),
      resetIn: Math.max(1, windowSeconds - (now - row.first_seen)),
    };
  } catch {
    return { allowed: true, remaining: 1, resetIn: windowSeconds };
  }
}

// Expired photos are dropped before the chat reads or writes, throttled through
// the maintenance row so a busy chat still only sweeps once an hour.
async function sweepChatImages(e) {
  try {
    const now = Date.now();
    const last = await e.DB.prepare("SELECT ran_at FROM chat_maintenance WHERE key = 'image_sweep'").first();
    const lastRun = last ? Date.parse(last.ran_at) : 0;
    if (Number.isFinite(lastRun) && now - lastRun < CHAT_IMAGE_SWEEP_MS) return;

    const cutoff = new Date(now - CHAT_IMAGE_TTL_MS).toISOString();
    await e.DB.batch([
      // Chunks first, then the messages pointing at the photo, then the photo
      // row itself; the subquery still sees the expired rows at that point.
      e.DB.prepare(
        "DELETE FROM chat_image_chunks WHERE image_id IN (SELECT id FROM chat_images WHERE created_at < ?)"
      ).bind(cutoff),
      e.DB.prepare(
        "UPDATE chat_messages SET image_url = '' WHERE image_url IN (SELECT '/api/chat/images/' || id FROM chat_images WHERE created_at < ?)"
      ).bind(cutoff),
      e.DB.prepare("DELETE FROM chat_images WHERE created_at < ?").bind(cutoff),
      e.DB.prepare(
        "INSERT INTO chat_maintenance (key,ran_at) VALUES('image_sweep',?) ON CONFLICT(key) DO UPDATE SET ran_at = excluded.ran_at"
      ).bind(new Date(now).toISOString()),
    ]);
  } catch {
    // A failed sweep must never break the chat; the next visit tries again.
  }
}

async function messages(r, e) {
  if (r.method === "GET") {
    await sweepChatImages(e);
    const q = await e.DB.prepare(
      "SELECT id,created_at,author,text,image_url FROM chat_messages ORDER BY created_at DESC LIMIT 100"
    ).all();
    return json(r, {
      ok: true,
      messages: (q.results || []).reverse().map((x) => {
        const message = { id: x.id, createdAt: x.created_at, author: x.author, text: x.text };
        // Older rows have no photo, so only send the field when there is one.
        return x.image_url ? { ...message, image: chatImageUrl(r, x.image_url) } : message;
      }),
    });
  }
  const b = await read(r);
  const text = clean(b?.text, 280);
  const author = clean(b?.author, 32, "Guest");
  const image = await resolveChatImage(e, b?.image);
  if (!text && !image) return fail(r, "Write a message or add a photo first.", 422);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  await e.DB.prepare(
    "INSERT INTO chat_messages (id,created_at,author,text,ip_hash,image_url) VALUES(?,?,?,?,?,?)"
  )
    .bind(id, createdAt, author, text, await digest(ip(r)), image)
    .run();
  return json(r, { ok: true, message: { id, createdAt, author, text, ...(image ? { image: chatImageUrl(r, image) } : {}) } }, 201);
}

function chatImageUrl(r, path) {
  return new URL(path, r.url).toString();
}

// A message may only point at a photo this hub already stored, so nobody can
// paste an off-site picture into the chat.
async function resolveChatImage(e, value) {
  const raw = clean(value, 300);
  if (!raw) return "";
  let pathname = raw;
  try {
    pathname = new URL(raw, "https://hub.invalid").pathname;
  } catch {
    return "";
  }
  const match = pathname.match(CHAT_IMAGE_PATH);
  if (!match) return "";
  const found = await e.DB.prepare("SELECT id FROM chat_images WHERE id = ?").bind(match[1]).first();
  return found ? `/api/chat/images/${found.id}` : "";
}

async function uploadChatImage(r, e) {
  if (r.method !== "POST") return fail(r, "Use POST to upload a chat photo.", 405);
  await sweepChatImages(e);
  const ipHash = await digest(ip(r));
  const rl = await checkRateLimit(e.DB, "chat_image:" + ipHash, 8, 600);
  if (!rl.allowed) {
    return fail(r, `Too many photos. Try again in ${Math.ceil(rl.resetIn / 60)} minute(s).`, 429, {
      resetIn: rl.resetIn,
    });
  }
  const type = (r.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  if (!CHAT_IMAGE_TYPES.includes(type)) {
    return fail(r, "Only JPG, PNG, WebP or GIF photos can be sent.", 415);
  }
  const bytes = new Uint8Array(await r.arrayBuffer());
  if (bytes.byteLength === 0) return fail(r, "That photo is empty.", 422);
  if (bytes.byteLength > CHAT_IMAGE_MAX_BYTES) {
    return fail(r, "That photo is too large — keep it under 500 KB.", 413);
  }

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const statements = [
    e.DB.prepare("INSERT INTO chat_images (id,content_type,size,created_at,ip_hash) VALUES(?,?,?,?,?)").bind(
      id,
      type,
      bytes.byteLength,
      createdAt,
      ipHash
    ),
  ];
  for (let offset = 0, index = 0; offset < bytes.byteLength; offset += CHAT_IMAGE_CHUNK_BYTES, index += 1) {
    statements.push(
      e.DB.prepare("INSERT INTO chat_image_chunks (image_id,idx,data) VALUES(?,?,?)").bind(
        id,
        index,
        bytes.slice(offset, offset + CHAT_IMAGE_CHUNK_BYTES)
      )
    );
  }
  await e.DB.batch(statements);
  return json(r, { ok: true, id, path: `/api/chat/images/${id}` }, 201);
}

async function serveChatImage(r, e, id) {
  if (r.method !== "GET" && r.method !== "HEAD") return fail(r, "Use GET for chat photos.", 405);
  const meta = await e.DB.prepare("SELECT content_type FROM chat_images WHERE id = ?").bind(id).first();
  if (!meta) return fail(r, "That photo is gone.", 404);
  const q = await e.DB.prepare(
    "SELECT data FROM chat_image_chunks WHERE image_id = ? ORDER BY idx ASC"
  )
    .bind(id)
    .all();
  const parts = (q.results || []).map((row) => new Uint8Array(row.data));
  const body = new Uint8Array(parts.reduce((total, part) => total + part.byteLength, 0));
  let at = 0;
  for (const part of parts) {
    body.set(part, at);
    at += part.byteLength;
  }
  const headers = cors(r);
  headers["content-type"] = meta.content_type;
  headers["cache-control"] = "public, max-age=31536000, immutable";
  return new Response(body, { status: 200, headers });
}

function groupReactions(rows) {
  const grouped = {};
  for (const row of rows || []) {
    if (!grouped[row.message_id]) grouped[row.message_id] = {};
    if (!grouped[row.message_id][row.emoji]) grouped[row.message_id][row.emoji] = [];
    grouped[row.message_id][row.emoji].push(row.author);
  }
  return grouped;
}

async function reactions(r, e) {
  if (r.method === "GET") {
    const ids = clean(new URL(r.url).searchParams.get("ids"), 2000)
      .split(",")
      .map((id) => clean(id, 64))
      .filter(Boolean)
      .slice(0, 100);
    if (ids.length === 0) return json(r, { ok: true, reactions: {} });
    const marks = ids.map(() => "?").join(",");
    const q = await e.DB.prepare(
      `SELECT message_id,emoji,author FROM chat_reactions WHERE message_id IN (${marks}) ORDER BY created_at ASC LIMIT 2000`
    )
      .bind(...ids)
      .all();
    return json(r, { ok: true, reactions: groupReactions(q.results) });
  }

  if (r.method !== "POST") return fail(r, "Method not allowed.", 405);

  const b = await read(r);
  const messageId = clean(b?.messageId, 64);
  const emoji = clean(b?.emoji, 16);
  const author = clean(b?.author, 32, "Guest");
  if (!messageId || !emoji) return fail(r, "Pick a reaction first.", 422);

  const limit = await checkRateLimit(e.DB, `reaction:${await digest(ip(r))}`, 90, 60);
  if (!limit.allowed) return fail(r, "Slow down on reactions.", 429);

  // Reactions only attach to real messages, so a stale id cannot grow the table.
  const message = await e.DB.prepare("SELECT id FROM chat_messages WHERE id = ?")
    .bind(messageId)
    .first();
  if (!message) return fail(r, "That message is gone.", 404);

  const existing = await e.DB.prepare(
    "SELECT author FROM chat_reactions WHERE message_id = ? AND emoji = ? AND author = ?"
  )
    .bind(messageId, emoji, author)
    .first();

  if (existing) {
    await e.DB.prepare(
      "DELETE FROM chat_reactions WHERE message_id = ? AND emoji = ? AND author = ?"
    )
      .bind(messageId, emoji, author)
      .run();
  } else {
    const count = await e.DB.prepare(
      "SELECT COUNT(*) AS total FROM chat_reactions WHERE message_id = ?"
    )
      .bind(messageId)
      .first();
    if (Number(count?.total || 0) >= 400) {
      return fail(r, "This message has enough reactions.", 429);
    }
    await e.DB.prepare("INSERT INTO chat_reactions VALUES(?,?,?,?)")
      .bind(messageId, emoji, author, new Date().toISOString())
      .run();
  }

  const q = await e.DB.prepare(
    "SELECT emoji,author FROM chat_reactions WHERE message_id = ? ORDER BY created_at ASC LIMIT 500"
  )
    .bind(messageId)
    .all();
  const perEmoji = {};
  for (const row of q.results || []) {
    if (!perEmoji[row.emoji]) perEmoji[row.emoji] = [];
    perEmoji[row.emoji].push(row.author);
  }
  return json(r, { ok: true, messageId, reactions: perEmoji });
}

async function views(r, e) {
  if (r.method === "GET") {
    const q = await e.DB.prepare("SELECT total FROM page_views WHERE id=1").first();
    return json(r, { ok: true, total: Number(q?.total || 0) });
  }
  await e.DB.prepare(
    "INSERT INTO page_views VALUES(1,1,?) ON CONFLICT(id) DO UPDATE SET total=total+1,updated_at=excluded.updated_at"
  )
    .bind(new Date().toISOString())
    .run();
  const q = await e.DB.prepare("SELECT total FROM page_views WHERE id=1").first();
  return json(r, { ok: true, total: Number(q?.total || 1) });
}

// ONLINE NOW (live presence)
// A tab posts its session id every few seconds while it is open; the reply is
// the number of sessions seen inside the presence window.
async function presence(r, e) {
  const now = Date.now();
  const cutoff = now - PRESENCE_TTL_MS;

  if (r.method === "POST") {
    const b = await read(r);
    const id = clean(b?.id, 64);
    if (!id) return fail(r, "A session id is required.", 422);

    const limit = await checkRateLimit(e.DB, "presence:" + (await digest(ip(r))), 40, 60);
    if (!limit.allowed) return fail(r, "Slow down on heartbeats.", 429);

    // Stale sessions are dropped on every heartbeat, but a runaway table gets a
    // full sweep first so the delete always has something to reclaim.
    const total = await e.DB.prepare("SELECT COUNT(*) AS n FROM presence_sessions").first();
    if (Number(total?.n || 0) > PRESENCE_MAX_SESSIONS) {
      await e.DB.prepare("DELETE FROM presence_sessions").run();
    }
    await e.DB.prepare(
      "INSERT INTO presence_sessions(id,last_seen) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET last_seen=excluded.last_seen"
    )
      .bind(id, now)
      .run();
    await e.DB.prepare("DELETE FROM presence_sessions WHERE last_seen < ?").bind(cutoff).run();
  } else if (r.method !== "GET") {
    return fail(r, "Method not allowed.", 405);
  }

  const q = await e.DB.prepare(
    "SELECT COUNT(*) AS n FROM presence_sessions WHERE last_seen >= ?"
  )
    .bind(cutoff)
    .first();
  return json(r, { ok: true, online: Number(q?.n || 0), windowSeconds: PRESENCE_TTL_MS / 1000 });
}

async function games(r, e) {
  if (r.method === "GET") {
    const q = await e.DB.prepare("SELECT game_id,game_name,game_url,clicks FROM game_clicks ORDER BY clicks DESC,game_name ASC LIMIT 200").all();
    return json(r, {
      ok: true,
      games: (q.results || []).map((x) => ({
        id: x.game_id,
        name: x.game_name,
        url: x.game_url,
        clicks: Number(x.clicks || 0),
      })),
    });
  }
  const b = await read(r);
  const id = clean(b?.id, 120);
  const name = clean(b?.name, 160, "Game");
  const url = clean(b?.url, 500);
  if (!id) return fail(r, "A game id is required.", 422);
  await e.DB.prepare(
    "INSERT INTO game_clicks VALUES(?,?,?,1,?) ON CONFLICT(game_id) DO UPDATE SET game_name=excluded.game_name,game_url=excluded.game_url,clicks=game_clicks.clicks+1,updated_at=excluded.updated_at"
  )
    .bind(id, name, url, new Date().toISOString())
    .run();
  const q = await e.DB.prepare("SELECT game_id,game_name,game_url,clicks FROM game_clicks WHERE game_id=?").bind(id).first();
  return json(r, { ok: true, game: { id: q.game_id, name: q.game_name, url: q.game_url, clicks: Number(q.clicks || 0) } }, 201);
}

async function submit(r, e) {
  const b = await read(r);
  const message = clean(b?.message, 2000);
  const raw = clean(b?.url, 500);
  if (message.length < 3) return fail(r, "Write at least 3 characters so we know what to add.", 422);
  let url = "";
  if (raw) {
    try {
      const u = new URL(/^https?:\/\//i.test(raw) ? raw : "https://" + raw);
      if (!["http:", "https:"].includes(u.protocol) || !u.hostname.includes(".")) throw 0;
      url = u.toString();
    } catch {
      return fail(r, "That link is not valid.", 422);
    }
  }
  const q = await e.DB.prepare("INSERT INTO submissions(created_at,url,message,ip_hash) VALUES(?,?,?,?)")
    .bind(new Date().toISOString(), url, message, await digest(ip(r)))
    .run();
  return json(r, { ok: true, id: q.meta?.last_row_id || null }, 201);
}

async function admin(r, e) {
  if (!e.ADMIN_PASSWORD) return fail(r, "The admin password has not been set on this deployment yet.", 503);
  const b = await read(r);
  const given = r.headers.get("x-admin-password") || b?.password || "";
  if (!equal(given, e.ADMIN_PASSWORD)) return fail(r, "Wrong password.", 401);
  const q = await e.DB.prepare("SELECT id,created_at,url,message,status FROM submissions ORDER BY id DESC LIMIT 200").all();
  const t = await e.DB.prepare("SELECT COUNT(*) total FROM submissions").first();
  return json(r, {
    ok: true,
    total: Number(t?.total || 0),
    items: (q.results || []).map((x) => ({
      id: x.id,
      createdAt: x.created_at,
      url: x.url,
      message: x.message,
      status: x.status,
    })),
  });
}

// BUG REPORTING & ADMIN MANAGEMENT
async function bugs(r, e) {
  if (r.method !== "POST") return fail(r, "Use POST to submit bug reports.", 405);
  const clientIp = ip(r);
  const ipHash = await digest(clientIp);

  // Rate limit: 5 bug reports per 10 minutes (600s)
  const rl = await checkRateLimit(e.DB, "bug:" + ipHash, 5, 600);
  if (!rl.allowed) {
    return fail(
      r,
      `Rate limit reached. Please wait ${Math.ceil(rl.resetIn / 60)} minute(s) before submitting another report.`,
      429,
      { resetIn: rl.resetIn }
    );
  }

  const b = await read(r);
  const description = clean(b?.description, 3000);
  if (description.length < 3) {
    return fail(r, "Please describe the bug with at least 3 characters.", 422);
  }

  const title = clean(b?.title, 150, description.slice(0, 60) + (description.length > 60 ? "…" : ""));
  const gameUrl = clean(b?.gameUrl || b?.game_url, 500);
  const pageUrl = clean(b?.pageUrl || b?.page_url, 500);
  const browserInfo = clean(b?.browserInfo || b?.browser_info, 300);

  const createdAt = new Date().toISOString();
  const ipAddress = clean(clientIp, 100, "unknown");
  const q = await e.DB.prepare(
    "INSERT INTO bug_reports (created_at, title, description, game_url, page_url, browser_info, ip_hash, ip, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'open')"
  )
    .bind(createdAt, title, description, gameUrl, pageUrl, browserInfo, ipHash, ipAddress)
    .run();

  return json(
    r,
    {
      ok: true,
      id: q.meta?.last_row_id || null,
      message: "Bug report submitted successfully! Thank you for helping improve the site.",
    },
    201
  );
}

async function adminBugs(r, e) {
  const clientIp = ip(r);
  const ipHash = await digest(clientIp);

  // Rate limit on admin attempts: max 10 attempts per 10 minutes (600s)
  const rl = await checkRateLimit(e.DB, "admin_bugs_attempt:" + ipHash, 10, 600);
  if (!rl.allowed) {
    return fail(
      r,
      `Too many admin login attempts. Please wait ${Math.ceil(rl.resetIn / 60)} minute(s) before trying again.`,
      429,
      { resetIn: rl.resetIn }
    );
  }

  const b = await read(r);
  const given = r.headers.get("x-admin-password") || b?.password || "";

  let authorized = false;
  if (isTrustedProxy(r, e)) {
    authorized = true;
  } else if (e.ADMIN_PASSWORD && equal(given, e.ADMIN_PASSWORD)) {
    authorized = true;
  }

  if (!authorized) {
    await checkRateLimit(e.DB, "admin_bugs_fail:" + ipHash, 5, 600);
    return fail(r, "Unauthorized. Incorrect admin password.", 401);
  }

  // Handle status update or delete actions
  if (r.method === "POST" && b?.action) {
    if (b.action === "status" && b.id) {
      const nextStatus = clean(b.status, 30, "open");
      await e.DB.prepare("UPDATE bug_reports SET status = ? WHERE id = ?").bind(nextStatus, b.id).run();
      return json(r, { ok: true, updated: true });
    }
    if (b.action === "delete" && b.id) {
      await e.DB.prepare("DELETE FROM bug_reports WHERE id = ?").bind(b.id).run();
      return json(r, { ok: true, deleted: true });
    }
  }

  // Fetch bugs
  const q = await e.DB.prepare(
    "SELECT id, created_at, title, description, game_url, page_url, browser_info, ip, status FROM bug_reports ORDER BY id DESC LIMIT 200"
  ).all();
  const t = await e.DB.prepare("SELECT COUNT(*) as total FROM bug_reports").first();

  return json(r, {
    ok: true,
    total: Number(t?.total || 0),
    items: (q.results || []).map((x) => ({
      id: x.id,
      createdAt: x.created_at,
      title: x.title,
      description: x.description,
      gameUrl: x.game_url,
      pageUrl: x.page_url,
      browserInfo: x.browser_info,
      ip: x.ip || "",
      status: x.status,
    })),
  });
}


// GAME FLAGS (VERIFIED, BUG-TAGGED & NOT MOBILE OPTIMIZED)
async function gameFlags(r, e) {
  if (r.method === "GET") {
    try {
      const q = await e.DB.prepare(
        "SELECT game_id, verified, buggy, not_mobile, blocked FROM game_flags WHERE verified = 1 OR buggy = 1 OR not_mobile = 1 OR blocked = 1"
      ).all();
      const verified = [];
      const buggy = [];
      const notMobile = [];
      for (const row of q.results || []) {
        if (row.verified) verified.push(row.game_id);
        if (row.buggy) buggy.push(row.game_id);
        if (row.not_mobile) notMobile.push(row.game_id);
      }
      return json(r, { ok: true, verified, buggy, notMobile });
    } catch {
      return json(r, { ok: true, verified: [], buggy: [], notMobile: [], blocked: [] });
    }
  }
  return fail(r, "Use GET for game flags.", 405);
}

async function adminFlags(r, e) {
  const clientIp = ip(r);
  const ipHash = await digest(clientIp);

  const b = await read(r);
  const given = r.headers.get("x-admin-password") || b?.password || "";

  let authorized = false;
  if (isTrustedProxy(r, e)) {
    authorized = true;
  } else if (e.ADMIN_PASSWORD && equal(given, e.ADMIN_PASSWORD)) {
    authorized = true;
  }

  if (!authorized) {
    await checkRateLimit(e.DB, "admin_flags_fail:" + ipHash, 5, 600);
    return fail(r, "Unauthorized. Incorrect admin password.", 401);
  }

  const now = new Date().toISOString();
  const action = clean(b?.action, 50, "get");

  if (action === "toggle_verified") {
    const gameId = clean(b?.gameId || b?.id, 120);
    if (!gameId) return fail(r, "gameId is required", 422);
    const existing = await e.DB.prepare("SELECT verified FROM game_flags WHERE game_id = ?").bind(gameId).first();
    if (!existing) {
      await e.DB.prepare("INSERT INTO game_flags (game_id, verified, buggy, not_mobile, updated_at) VALUES (?, 1, 0, 0, ?)").bind(gameId, now).run();
    } else {
      const nextVer = existing.verified ? 0 : 1;
      await e.DB.prepare("UPDATE game_flags SET verified = ?, updated_at = ? WHERE game_id = ?").bind(nextVer, now, gameId).run();
    }
  } else if (action === "set_verified") {
    const gameId = clean(b?.gameId || b?.id, 120);
    const val = b?.verified ? 1 : 0;
    if (!gameId) return fail(r, "gameId is required", 422);
    await e.DB.prepare(
      "INSERT INTO game_flags (game_id, verified, buggy, not_mobile, updated_at) VALUES (?, ?, 0, 0, ?) ON CONFLICT(game_id) DO UPDATE SET verified = excluded.verified, updated_at = excluded.updated_at"
    ).bind(gameId, val, now).run();
  } else if (action === "clear_verified") {
    await e.DB.prepare("UPDATE game_flags SET verified = 0, updated_at = ?").bind(now).run();
  } else if (action === "toggle_buggy") {
    const gameId = clean(b?.gameId || b?.id, 120);
    if (!gameId) return fail(r, "gameId is required", 422);
    const existing = await e.DB.prepare("SELECT buggy FROM game_flags WHERE game_id = ?").bind(gameId).first();
    if (!existing) {
      await e.DB.prepare("INSERT INTO game_flags (game_id, verified, buggy, not_mobile, updated_at) VALUES (?, 0, 1, 0, ?)").bind(gameId, now).run();
    } else {
      const nextBuggy = existing.buggy ? 0 : 1;
      await e.DB.prepare("UPDATE game_flags SET buggy = ?, updated_at = ? WHERE game_id = ?").bind(nextBuggy, now, gameId).run();
    }
  } else if (action === "set_buggy") {
    const gameId = clean(b?.gameId || b?.id, 120);
    const val = b?.buggy ? 1 : 0;
    if (!gameId) return fail(r, "gameId is required", 422);
    await e.DB.prepare(
      "INSERT INTO game_flags (game_id, verified, buggy, not_mobile, updated_at) VALUES (?, 0, ?, 0, ?) ON CONFLICT(game_id) DO UPDATE SET buggy = excluded.buggy, updated_at = excluded.updated_at"
    ).bind(gameId, val, now).run();
  } else if (action === "clear_buggy") {
    await e.DB.prepare("UPDATE game_flags SET buggy = 0, updated_at = ?").bind(now).run();
  } else if (action === "toggle_not_mobile") {
    const gameId = clean(b?.gameId || b?.id, 120);
    if (!gameId) return fail(r, "gameId is required", 422);
    const existing = await e.DB.prepare("SELECT not_mobile FROM game_flags WHERE game_id = ?").bind(gameId).first();
    if (!existing) {
      await e.DB.prepare("INSERT INTO game_flags (game_id, verified, buggy, not_mobile, updated_at) VALUES (?, 0, 0, 1, ?)").bind(gameId, now).run();
    } else {
      const nextNotMobile = existing.not_mobile ? 0 : 1;
      await e.DB.prepare("UPDATE game_flags SET not_mobile = ?, updated_at = ? WHERE game_id = ?").bind(nextNotMobile, now, gameId).run();
    }
  } else if (action === "set_not_mobile") {
    const gameId = clean(b?.gameId || b?.id, 120);
    const val = b?.notMobile ? 1 : 0;
    if (!gameId) return fail(r, "gameId is required", 422);
    await e.DB.prepare(
      "INSERT INTO game_flags (game_id, verified, buggy, not_mobile, updated_at) VALUES (?, 0, 0, ?, ?) ON CONFLICT(game_id) DO UPDATE SET not_mobile = excluded.not_mobile, updated_at = excluded.updated_at"
    ).bind(gameId, val, now).run();
  } else if (action === "clear_not_mobile") {
    await e.DB.prepare("UPDATE game_flags SET not_mobile = 0, updated_at = ?").bind(now).run();
  } else if (action === "sync_all") {
    if (Array.isArray(b?.verified)) {
      await e.DB.prepare("UPDATE game_flags SET verified = 0, updated_at = ?").bind(now).run();
      for (const gid of b.verified) {
        const id = clean(gid, 120);
        if (id) {
          await e.DB.prepare(
            "INSERT INTO game_flags (game_id, verified, buggy, not_mobile, updated_at) VALUES (?, 1, 0, 0, ?) ON CONFLICT(game_id) DO UPDATE SET verified = 1, updated_at = excluded.updated_at"
          ).bind(id, now).run();
        }
      }
    }
    if (Array.isArray(b?.buggy)) {
      await e.DB.prepare("UPDATE game_flags SET buggy = 0, updated_at = ?").bind(now).run();
      for (const gid of b.buggy) {
        const id = clean(gid, 120);
        if (id) {
          await e.DB.prepare(
            "INSERT INTO game_flags (game_id, verified, buggy, not_mobile, updated_at) VALUES (?, 0, 1, 0, ?) ON CONFLICT(game_id) DO UPDATE SET buggy = 1, updated_at = excluded.updated_at"
          ).bind(id, now).run();
        }
      }
    }
    if (Array.isArray(b?.notMobile)) {
      await e.DB.prepare("UPDATE game_flags SET not_mobile = 0, updated_at = ?").bind(now).run();
      for (const gid of b.notMobile) {
        const id = clean(gid, 120);
        if (id) {
          await e.DB.prepare(
            "INSERT INTO game_flags (game_id, verified, buggy, not_mobile, updated_at) VALUES (?, 0, 0, 1, ?) ON CONFLICT(game_id) DO UPDATE SET not_mobile = 1, updated_at = excluded.updated_at"
          ).bind(id, now).run();
        }
      }
    }
  }

  // Fetch all active flags
  const q = await e.DB.prepare(
    "SELECT game_id, verified, buggy, not_mobile, blocked FROM game_flags WHERE verified = 1 OR buggy = 1 OR not_mobile = 1 OR blocked = 1"
  ).all();
  const verified = [];
  const buggy = [];
  const notMobile = [];
  for (const row of q.results || []) {
    if (row.verified) verified.push(row.game_id);
    if (row.buggy) buggy.push(row.game_id);
    if (row.not_mobile) notMobile.push(row.game_id);
  }
  return json(r, { ok: true, verified, buggy, notMobile });
}

export default {
  async fetch(r, e) {
    const p = new URL(r.url).pathname.replace(/\/+$/, "") || "/";
    if (r.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(r) });
    try {
      if (p === "/" || p === "/api/health") {
        return json(r, { ok: true, service: "polytrack-hub-api", adminConfigured: !!e.ADMIN_PASSWORD });
      }
      await schema(e);
      if (p === "/api/messages") return messages(r, e);
      if (p === "/api/chat/images") return uploadChatImage(r, e);
      const chatImage = p.match(CHAT_IMAGE_PATH);
      if (chatImage) return serveChatImage(r, e, chatImage[1]);
      if (p === "/api/reactions") return reactions(r, e);
      if (p === "/api/views") return views(r, e);
      if (p === "/api/presence") return presence(r, e);
      if (p === "/api/games/stats") return games(r, e);
      if (p === "/api/games/click") return games(r, e);
      if (p === "/api/submit") return submit(r, e);
      if (p === "/api/admin/list") return admin(r, e);
      if (p === "/api/bugs") return bugs(r, e);
      if (p === "/api/admin/bugs") return adminBugs(r, e);
      if (p === "/api/games/flags") return gameFlags(r, e);
      if (p === "/api/admin/flags") return adminFlags(r, e);
      if (p === "/api/checkout/signup") return checkoutSignup(r, e);
      if (p === "/api/checkout/signin") return checkoutSignin(r, e);
      if (p === "/api/checkout/session") return checkoutSession(r, e);
      if (p === "/api/checkout/signout") return checkoutSignout(r, e);
      if (p === "/api/checkout/orders") return checkoutOrders(r, e);
      if (p === "/api/admin/checkout-orders") return adminCheckoutOrders(r, e);
      return fail(r, "No such endpoint.", 404);
    } catch {
      return fail(r, "The hub API is unavailable right now.", 500);
    }
  },
};
