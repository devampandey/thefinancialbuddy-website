// Reader accounts (email + password), backed by Postgres — separate from
// lib/users.js which stores staff/writer accounts as a GitHub-committed
// file. Node-runtime only.

import { sql, ensureSchema } from "./db";
import { hashPassword, verifyPasswordHash } from "./password";

export async function createReader({ email, password, name }) {
  await ensureSchema();
  const normalizedEmail = email.toLowerCase();

  const existing = await sql`SELECT id FROM reader_users WHERE email = ${normalizedEmail}`;
  if (existing.rows.length > 0) {
    throw new Error("An account with that email already exists.");
  }

  const passwordHash = hashPassword(password);
  const result = await sql`
    INSERT INTO reader_users (email, name, password_hash)
    VALUES (${normalizedEmail}, ${name}, ${passwordHash})
    RETURNING id, email, name;
  `;
  const row = result.rows[0];
  return { userId: row.id, email: row.email, name: row.name };
}

export async function verifyReader(email, password) {
  await ensureSchema();
  const normalizedEmail = (email || "").toLowerCase();
  const result = await sql`
    SELECT id, email, name, password_hash FROM reader_users WHERE email = ${normalizedEmail}
  `;
  const row = result.rows[0];
  if (!row) return null;
  if (!verifyPasswordHash(password, row.password_hash)) return null;
  return { userId: row.id, email: row.email, name: row.name };
}

// Used by the Google/Facebook sign-in callbacks. If an account with this
// email already exists (however it was created), sign into that one —
// this lets someone who originally signed up with email/password also use
// "Continue with Google" later without ending up with two accounts.
// Otherwise, create a new password-less account tied to this provider.
export async function findOrCreateOAuthReader({ email, name, provider }) {
  await ensureSchema();
  const normalizedEmail = (email || "").toLowerCase();
  if (!normalizedEmail) {
    throw new Error("This provider didn't share an email address.");
  }

  const existing = await sql`
    SELECT id, email, name FROM reader_users WHERE email = ${normalizedEmail}
  `;
  if (existing.rows.length > 0) {
    const row = existing.rows[0];
    return { userId: row.id, email: row.email, name: row.name };
  }

  const result = await sql`
    INSERT INTO reader_users (email, name, password_hash, oauth_provider)
    VALUES (${normalizedEmail}, ${name || normalizedEmail}, NULL, ${provider})
    RETURNING id, email, name;
  `;
  const row = result.rows[0];
  return { userId: row.id, email: row.email, name: row.name };
}

export async function getReaderById(id) {
  await ensureSchema();
  const result = await sql`SELECT id, email, name FROM reader_users WHERE id = ${id}`;
  const row = result.rows[0];
  if (!row) return null;
  return { userId: row.id, email: row.email, name: row.name };
}
