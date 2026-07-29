// Self-service writer accounts, stored as a JSON file in the site's GitHub
// repo (there's no database) — the same "GitHub as the datastore" pattern
// already used for drafts and published posts. Signups always get the
// "writer" role; the single admin account stays env-var-only.
//
// Node-runtime only (uses Node's crypto module + lib/github.js's Buffer
// usage) — only call this from Route Handlers, never from middleware.

import { getFile, putFile } from "./github";
import { hashPassword, verifyPasswordHash } from "./password";

const USERS_PATH = "content/staff/users.json";

function reservedUsernames() {
  const reserved = [];
  if (process.env.ADMIN_USERNAME) reserved.push(process.env.ADMIN_USERNAME);
  for (let i = 1; i <= 4; i++) {
    const u = process.env[`WRITER_USERNAME_${i}`];
    if (u) reserved.push(u);
  }
  return reserved.map((u) => u.toLowerCase());
}

// Returns { users, sha } — sha is null if the file doesn't exist yet (no
// one has signed up before).
async function readUsersFile() {
  const file = await getFile(USERS_PATH);
  if (!file) return { users: [], sha: null };
  try {
    const users = JSON.parse(file.content);
    return { users: Array.isArray(users) ? users : [], sha: file.sha };
  } catch {
    return { users: [], sha: file.sha };
  }
}

export async function isUsernameTaken(username) {
  const normalized = username.toLowerCase();
  if (reservedUsernames().includes(normalized)) return true;
  const { users } = await readUsersFile();
  return users.some((u) => u.username.toLowerCase() === normalized);
}

// Creates a new self-service writer account. Throws if the username is
// already taken by an env-configured account or an existing signup.
export async function createUser({ username, password, name }) {
  const { users, sha } = await readUsersFile();
  const normalized = username.toLowerCase();
  if (
    reservedUsernames().includes(normalized) ||
    users.some((u) => u.username.toLowerCase() === normalized)
  ) {
    throw new Error("That username is already taken.");
  }

  const record = {
    username,
    name,
    passwordHash: hashPassword(password),
    role: "writer",
    createdAt: new Date().toISOString(),
  };
  const next = [...users, record];
  await putFile(
    USERS_PATH,
    JSON.stringify(next, null, 2) + "\n",
    `Add staff account: ${username}`,
    sha || undefined
  );
  return { role: record.role, username: record.username, name: record.name };
}

// Checks a submitted username/password against self-service signup
// accounts (separate from the env-configured accounts in lib/auth.js).
export async function verifyFileUser(username, password) {
  if (!username || !password) return null;
  const { users } = await readUsersFile();
  const match = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  if (!match) return null;
  if (!verifyPasswordHash(password, match.passwordHash)) return null;
  return { role: match.role || "writer", username: match.username, name: match.name || match.username };
}
