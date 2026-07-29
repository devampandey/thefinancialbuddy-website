import { getFile, listDir } from "./github";
import { parseFrontmatter } from "./frontmatter";

export const DRAFTS_DIR = "content/drafts";
export const POSTS_DIR = "content/blog";

// Metadata for every pending draft, newest submission first. Shared by the
// GET /api/admin/drafts route, the writer dashboard, and the admin review
// queue so the listing logic only lives in one place.
export async function listDrafts() {
  const files = await listDir(DRAFTS_DIR);

  const drafts = await Promise.all(
    files
      .filter((f) => f.name.endsWith(".md"))
      .map(async (f) => {
        const file = await getFile(f.path);
        if (!file) return null;
        const { data } = parseFrontmatter(file.content);
        const slug = f.name.replace(/\.md$/, "");
        return {
          slug,
          title: data.title || slug,
          category: data.category || "General",
          description: data.description || "",
          author: data.author || "",
          submittedAt: data.submittedAt || "",
        };
      })
  );

  return drafts
    .filter(Boolean)
    .sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));
}
