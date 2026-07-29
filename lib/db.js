// Postgres-backed storage for reader accounts, bookmarks, and comments —
// separate from the GitHub-file storage used for the staff CMS, since
// reader signups need to scale past a handful of accounts. Uses Vercel
// Postgres via @vercel/postgres, which reads its connection string from
// the POSTGRES_URL env var automatically (set by linking a Postgres
// database to this project in the Vercel dashboard).
//
// Node-runtime only — only call from Route Handlers, never from middleware.

import { sql } from "@vercel/postgres";

let schemaReady = false;

// Creates the tables on first use if they don't already exist. Safe to
// call on every request — IF NOT EXISTS makes it a no-op after the first
// successful run within a given serverless instance.
export async function ensureSchema() {
  if (schemaReady) return;

  await sql`
    CREATE TABLE IF NOT EXISTS reader_users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES reader_users(id) ON DELETE CASCADE,
      post_slug TEXT NOT NULL,
      post_title TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (user_id, post_slug)
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES reader_users(id) ON DELETE CASCADE,
      post_slug TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx ON bookmarks(user_id);`;
  await sql`CREATE INDEX IF NOT EXISTS comments_post_slug_idx ON comments(post_slug);`;

  schemaReady = true;
}

export { sql };
