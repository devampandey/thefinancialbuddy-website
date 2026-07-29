import { sql, ensureSchema } from "./db";

export async function listBookmarks(userId) {
  await ensureSchema();
  const result = await sql`
    SELECT post_slug, post_title, created_at
    FROM bookmarks
    WHERE user_id = ${userId}
    ORDER BY created_at DESC;
  `;
  return result.rows.map((r) => ({
    slug: r.post_slug,
    title: r.post_title,
    createdAt: r.created_at,
  }));
}

export async function addBookmark(userId, slug, title) {
  await ensureSchema();
  await sql`
    INSERT INTO bookmarks (user_id, post_slug, post_title)
    VALUES (${userId}, ${slug}, ${title})
    ON CONFLICT (user_id, post_slug) DO NOTHING;
  `;
}

export async function removeBookmark(userId, slug) {
  await ensureSchema();
  await sql`DELETE FROM bookmarks WHERE user_id = ${userId} AND post_slug = ${slug};`;
}
