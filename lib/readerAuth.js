// Signed-cookie session auth for reader accounts (bookmarks, comments).
// Mirrors the pattern in lib/auth.js (staff sessions) but uses its own
// cookie name so a reader session can never be mistaken for /admin access,
// and vice versa. Built on Web Crypto so it works in any runtime.

export const READER_SESSION_COOKIE = "fb_reader_session";
export const READER_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

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
      "SESSION_SECRET environment variable is not set — required for reader accounts."
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

export async function createReaderSessionToken({ userId, email, name }) {
  const secret = requireSecret();
  const payload = {
    role: "reader",
    userId,
    email,
    name,
    exp: Date.now() + READER_SESSION_MAX_AGE_SECONDS * 1000,
  };
  const payloadB64 = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await hmacSign(payloadB64, secret);
  return `${payloadB64}.${sig}`;
}

// Returns the decoded session payload ({ role, userId, email, name, exp })
// if the token is validly signed and not expired, otherwise null.
export async function verifyReaderSessionToken(token) {
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
