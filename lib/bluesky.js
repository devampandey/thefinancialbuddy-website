// Auto-posts a link to Bluesky whenever an article is approved and
// published. Best-effort only — a Bluesky failure (missing credentials,
// API hiccup, etc.) must never block or fail the actual publish, so every
// call in here is designed to be wrapped in try/catch by the caller and
// just quietly skip on any problem.
//
// Uses the AT Protocol directly (no SDK) with an "app password" — generate
// one at bsky.app → Settings → Privacy and Security → App Passwords. That's
// a scoped credential separate from the account's real login password, and
// it's free (no developer account or API billing, unlike X).

import { getPostUrl } from "@/lib/categories";

const BSKY_API = "https://bsky.social/xrpc";
const SITE_URL = "https://www.thefinancialbuddy.com";
const MAX_GRAPHEMES = 300;

const encoder = new TextEncoder();
function byteLength(str) {
  return encoder.encode(str).length;
}

async function createSession() {
  const identifier = process.env.BLUESKY_IDENTIFIER;
  const password = process.env.BLUESKY_APP_PASSWORD;
  if (!identifier || !password) return null;

  const res = await fetch(`${BSKY_API}/com.atproto.server.createSession`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });
  if (!res.ok) return null;
  return res.json(); // { accessJwt, did, ... }
}

// Truncates the title (not the URL) so "title\n\nurl" stays under Bluesky's
// 300-character post limit, leaving a little headroom for the ellipsis and
// spacing.
function buildPostText(title, url) {
  const suffix = `\n\n${url}`;
  const budget = MAX_GRAPHEMES - suffix.length;
  const trimmedTitle = title.length > budget ? `${title.slice(0, budget - 1).trim()}…` : title;
  return { text: `${trimmedTitle}${suffix}`, url, urlStartsAt: trimmedTitle.length + 2 };
}

export async function postArticleToBluesky({ title, slug, category }) {
  const session = await createSession();
  if (!session) return; // not configured, or auth failed — skip silently

  const url = `${SITE_URL}${getPostUrl({ slug, category })}`;
  const { text, urlStartsAt } = buildPostText(title, url);

  const byteStart = byteLength(text.slice(0, urlStartsAt));
  const byteEnd = byteLength(text);

  const record = {
    $type: "app.bsky.feed.post",
    text,
    createdAt: new Date().toISOString(),
    langs: ["en"],
    facets: [
      {
        index: { byteStart, byteEnd },
        features: [{ $type: "app.bsky.richtext.facet#link", uri: url }],
      },
    ],
  };

  await fetch(`${BSKY_API}/com.atproto.repo.createRecord`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessJwt}`,
    },
    body: JSON.stringify({
      repo: session.did,
      collection: "app.bsky.feed.post",
      record,
    }),
  });
}
