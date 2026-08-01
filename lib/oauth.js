// Shared helpers for the "Continue with Google" / "Continue with Facebook"
// reader sign-in flows (app/api/reader/oauth/*). Hand-rolled OAuth 2.0
// Authorization Code flow rather than a library like NextAuth, so it can
// plug directly into the existing fb_reader_session cookie system used by
// email/password login — bookmarks and comments don't need to know or
// care how someone signed in.

export const SITE_URL = "https://www.thefinancialbuddy.com";
export const OAUTH_STATE_COOKIE = "fb_oauth_state";

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function randomNonce() {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
}

// Packs the CSRF nonce and the post-login redirect target into one cookie
// value so the callback route can verify the nonce and know where to send
// the user back to, without needing extra query params Google/Facebook
// might not round-trip cleanly.
export function encodeOAuthState(nonce, next) {
  return JSON.stringify({ nonce, next: next || "/account" });
}

export function decodeOAuthState(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.nonce) return null;
    return { nonce: parsed.nonce, next: parsed.next || "/account" };
  } catch {
    return null;
  }
}
