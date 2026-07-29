import { getFile, listDir } from "./github";
import { parseFrontmatter } from "./frontmatter";
import { POSTS_DIR } from "./drafts";

// Metadata for every published article, newest first — used by the admin
// "Manage articles" list. Reads live from GitHub (not the local build) so a
// just-published or just-deleted article is reflected immediately, without
// waiting for the next deploy.
export async function listPublishedPosts() {
  const files = await listDir(POSTS_DIR);

  const posts = await Promise.all(
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
          date: data.date || "",
        };
      })
  );

  return posts.filter(Boolean).sort((a, b) => (a.date < b.date ? 1 : -1));
}
