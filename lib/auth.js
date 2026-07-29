// Lightweight signed-cookie session auth for the /admin area.
// No database, no third-party auth provider — just a handful of trusted
// staff accounts defined via environment variables (see .env.example).
//
// Built on the Web Crypto API (crypto.subtle) rather than Node's `crypto`
// module so the exact same code works both in middleware (Edge runtime)
// and in Route Handlers (Node runtime).

export const SESSION_COOKIE = "fb_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function bytesToBase64Url(bytes) {
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(b64url) {
  const padded = b64url + "===".slice((b64url.length + 3) % 4);
  const b64 = padded.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function requireSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET environment variable is not set — required for /admin login."
    );
  }
  return secret;
}

async function getHmacKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function hmacSign(payloadB64, secret) {
  const key = await getHmacKey(secret);
  const sigBuf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  return bytesToBase64Url(new Uint8Array(sigBuf));
}

export async function createSessionToken({ role, username, name }) {
  const secret = requireSecret();
  const payload = {
    role,
    username,
    name,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const payloadB64 = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await hmacSign(payloadB64, secret);
  return `${payloadB64}.${sig}`;
}

// Returns the decoded session payload ({ role, username, name, exp }) if the
// token is validly signed and not expired, otherwise null.
export async function verifySessionToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return null;

  let secret;
  try {
    secret = requireSecret();
  } catch {
    return null;
  }

  const expectedSig = await hmacSign(payloadB64, secret);
  if (expectedSig !== sig) return null;

  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payloadB64)));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// Checks a submitted username/password against the accounts configured via
// environment variables. Supports one admin account and up to four writer
// accounts (WRITER_USERNAME_1..4 / WRITER_PASSWORD_1..4 / WRITER_NAME_1..4).
export function checkCredentials(username, password) {
  if (!username || !password) return null;

  const candidates = [];

  if (process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
    candidates.push({
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
      name: process.env.ADMIN_NAME || process.env.ADMIN_USERNAME,
    });
  }

  for (let i = 1; i <= 4; i++) {
    const u = process.env[`WRITER_USERNAME_${i}`];
    const p = process.env[`WRITER_PASSWORD_${i}`];
    if (u && p) {
      candidates.push({
        username: u,
        password: p,
        role: "writer",
        name: process.env[`WRITER_NAME_${i}`] || u,
      });
    }
  }

  const match = candidates.find((c) => c.username === username && c.password === password);
  if (!match) return null;
  return { role: match.role, username: match.username, name: match.name };
}
