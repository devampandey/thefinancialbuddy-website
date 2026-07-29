import { sql, ensureSchema } from "./db";

export async function listComments(slug) {
  await ensureSchema();
  const result = await sql`
    SELECT comments.id, comments.body, comments.created_at, reader_users.name AS author_name
    FROM comments
    JOIN reader_users ON reader_users.id = comments.user_id
    WHERE comments.post_slug = ${slug}
    ORDER BY comments.created_at ASC;
  `;
  return result.rows.map((r) => ({
    id: r.id,
    body: r.body,
    createdAt: r.created_at,
    authorName: r.author_name,
  }));
}

export async function addComment(userId, slug, body) {
  await ensureSchema();
  const trimmed = (body || "").trim();
  if (!trimmed) throw new Error("Comment can't be empty.");
  if (trimmed.length > 2000) throw new Error("Comment is too long (max 2000 characters).");
  await sql`
    INSERT INTO comments (user_id, post_slug, body)
    VALUES (${userId}, ${slug}, ${trimmed});
  `;
  return trimmed;
}
