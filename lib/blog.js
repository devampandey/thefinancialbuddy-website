import fs from "fs";
import path from "path";
import { marked } from "marked";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

function parseFrontmatter(raw) {
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, content: raw };
  const [, fm, content] = match;
  const data = {};
  fm.split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    value = value.replace(/^"(.*)"$/, "$1");
    data[key] = value;
  });
  return { data, content: content.trim() };
}

function slugFromFilename(filename) {
  return filename.replace(/\.md$/, "");
}

// Returns metadata only (no HTML rendering) for every post, sorted newest first.
export function getAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map((filename) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
    const { data } = parseFrontmatter(raw);
    return {
      slug: slugFromFilename(filename),
      title: data.title || slugFromFilename(filename),
      date: data.date || "",
      category: data.category || "General",
      description: data.description || "",
    };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllCategories() {
  const posts = getAllPosts();
  const set = new Set(posts.map((p) => p.category));
  return ["All", ...Array.from(set)];
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
    html: marked.parse(content),
  };
}
