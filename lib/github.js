// Thin wrapper around the GitHub Contents API. This is how the admin
// publishing flow persists articles: instead of writing to the local
// filesystem (which doesn't survive on Vercel's serverless functions),
// it commits markdown files directly to the site's GitHub repo. Vercel is
// already connected to that repo, so every commit here triggers a normal
// deploy and the change goes live a minute or two later — no server, no
// database, no one touching git by hand.
//
// Node-runtime only (uses Buffer) — only call this from Route Handlers,
// never from middleware.

const GITHUB_API = "https://api.github.com";

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !owner || !repo) {
    throw new Error(
      "GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO environment variables are required for the admin publishing flow."
    );
  }
  return { token, owner, repo, branch };
}

function apiHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "thefinancialbuddy-admin",
  };
}

function encodePath(path) {
  return path.split("/").map(encodeURIComponent).join("/");
}

// Returns { content, sha } for a file, or null if it doesn't exist.
export async function getFile(path) {
  const { token, owner, repo, branch } = getConfig();
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${encodePath(path)}?ref=${branch}`,
    { headers: apiHeaders(token), cache: "no-store" }
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub getFile failed (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  if (Array.isArray(data)) {
    throw new Error(`Expected a file at "${path}" but found a directory.`);
  }
  return {
    content: Buffer.from(data.content, "base64").toString("utf8"),
    sha: data.sha,
  };
}

// Returns [{ name, path }] for every file directly inside a directory.
// Returns [] if the directory doesn't exist yet (nothing published/drafted).
export async function listDir(path) {
  const { token, owner, repo, branch } = getConfig();
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${encodePath(path)}?ref=${branch}`,
    { headers: apiHeaders(token), cache: "no-store" }
  );
  if (res.status === 404) return [];
  if (!res.ok) {
    throw new Error(`GitHub listDir failed (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data
    .filter((item) => item.type === "file")
    .map((item) => ({ name: item.name, path: item.path }));
}

// Creates or updates a file. Pass `sha` (from getFile) when updating an
// existing file — GitHub requires it to prevent accidental overwrites.
export async function putFile(path, content, message, sha) {
  const { token, owner, repo, branch } = getConfig();
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${encodePath(path)}`, {
    method: "PUT",
    headers: { ...apiHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf8").toString("base64"),
      branch,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) {
    throw new Error(`GitHub putFile failed (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

export async function deleteFile(path, message, sha) {
  const { token, owner, repo, branch } = getConfig();
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${encodePath(path)}`, {
    method: "DELETE",
    headers: { ...apiHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({ message, sha, branch }),
  });
  if (!res.ok) {
    throw new Error(`GitHub deleteFile failed (${res.status}): ${await res.text()}`);
  }
  return res.json();
}
