import fs from "fs";
import path from "path";
import { marked } from "marked";
import { parseFrontmatter } from "./frontmatter";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

function slugFromFilename(filename) {
  return filename.replace(/\.md$/, "");
}

// Pulls the first Markdown image (if any) out of a post's body so it can be
// used as a thumbnail in story grids without re-rendering the whole post.
function firstImage(content) {
  const match = /!\[[^\]]*\]\(([^)\s]+)/.exec(content);
  return match ? match[1] : "";
}

// Returns metadata only (no HTML rendering) for every post, sorted newest first.
export function getAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map((filename) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
    const { data, content } = parseFrontmatter(raw);
    return {
      slug: slugFromFilename(filename),
      title: data.title || slugFromFilename(filename),
      date: data.date || "",
      category: data.category || "General",
      description: data.description || "",
      author: data.author || "",
      image: firstImage(content),
    };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllCategories() {
  const posts = getAllPosts();
  const set = new Set(posts.map((p) => p.category));
  return ["All", ...Array.from(set)];
}

export function getPostsByCategory(category) {
  return getAllPosts().filter((p) => p.category === category);
}

// Returns full post including rendered HTML body.
export function getPostBySlug(slug) {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = parseFrontmatter(raw);
  return {
    slug,
    title: data.title || slug,
    date: data.date || "",
    category: data.category || "General",
    description: data.description || "",
    author: data.author || "",
    image: firstImage(content),
    html: marked.parse(content),
  };
}
