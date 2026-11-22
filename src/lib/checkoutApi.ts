const HUB_API = "/api/hub";
const WORKER_ORIGIN = "https://polytrack-hub-api.sawyerbobk563.workers.dev";
const TOKEN_KEY = "polytrack_checkout_token";

export interface CheckoutUser {
  id: string;
  name: string;
  email: string;
}

export interface CheckoutPayment {
  method: "card" | "paypal" | "apple";
  cardName: string;
  cardLast4: string;
}

export interface CheckoutOrder {
  id: string;
  createdAt: string;
  method: string;
  amountCents: number;
  cardName: string;
  cardLast4: string;
}

export interface CheckoutOrderRecord {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  method: string;
  amountCents: number;
  cardName: string;
  cardLast4: string;
  status: string;
}

export interface CheckoutOrdersPage {
  total: number;
  users: number;
  items: CheckoutOrderRecord[];
}

function readToken(): string {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

function saveToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
}

function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

/** The proxy answers a missing route with an empty 404, not the Worker's JSON. */
function isMissingProxyRoute(response: Response) {
  if (response.status !== 404 && response.status !== 405) return false;
  const type = response.headers.get("content-type") || "";
  return !type.includes("json");
}

async function checkoutRequest(path: string, init: RequestInit = {}): Promise<any> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  const token = readToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const options: RequestInit = { ...init, headers, cache: "no-store" };
  let response = await fetch(`${HUB_API}${path}`, options);
  // Mirrors without the /api/hub proxy talk to the Worker directly.
  if (isMissingProxyRoute(response)) {
    response = await fetch(`${WORKER_ORIGIN}/api${path}`, options);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    throw new Error(data.error || "The checkout service is unavailable right now.");
  }
  return data;
}

export async function signUpCheckout(input: {
  name: string;
  email: string;
  password: string;
}): Promise<CheckoutUser> {
  const data = await checkoutRequest("/checkout/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  saveToken(String(data.token || ""));
  return data.user as CheckoutUser;
}

export async function signInCheckout(input: {
  email: string;
  password: string;
}): Promise<CheckoutUser> {
  const data = await checkoutRequest("/checkout/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  saveToken(String(data.token || ""));
  return data.user as CheckoutUser;
}

/** Restores the signed-in account on this device, when there still is one. */
export async function loadCheckoutSession(): Promise<CheckoutUser | null> {
  if (!readToken()) return null;
  try {
    const data = await checkoutRequest("/checkout/session");
    return data.user as CheckoutUser;
  } catch {
    clearToken();
    return null;
  }
}

export async function signOutCheckout(): Promise<void> {
  try {
    await checkoutRequest("/checkout/signout", { method: "POST" });
  } catch {
    // Clearing the local token is enough even if the Worker is unreachable.
  } finally {
    clearToken();
  }
}

export async function placeCheckoutOrder(payment: CheckoutPayment): Promise<CheckoutOrder> {
  const data = await checkoutRequest("/checkout/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payment),
  });
  return data.order as CheckoutOrder;
}

export async function loadCheckoutOrdersForAdmin(
  password: string
): Promise<CheckoutOrdersPage> {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Admin-Password": password,
    },
    body: JSON.stringify({ action: "list", password }),
    cache: "no-store",
  };

  let response = await fetch(`${HUB_API}/admin/checkout-orders`, options);
  if (isMissingProxyRoute(response)) {
    response = await fetch(`${WORKER_ORIGIN}/api/admin/checkout-orders`, options);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    throw new Error(data.error || "Could not load checkout orders.");
  }

  return {
    total: Number(data.total || 0),
    users: Number(data.users || 0),
    items: Array.isArray(data.items) ? data.items : [],
  };
}
