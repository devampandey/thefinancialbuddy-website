import fs from "fs";
import path from "path";
import { marked } from "marked";
import { parseFrontmatter } from "./frontmatter";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

function slugFromFilename(filename) {
  return filename.replace(/\.md$/, "");
}

// Pulls the first image (if any) out of a post's body so it can be used as a
// thumbnail in story grids without re-rendering the whole post. Checks
// standard Markdown image syntax first, then falls back to a raw HTML <img>
// tag — articles hand-edited on GitHub sometimes end up with GitHub's own
// attachment markup instead of Markdown syntax.
export function firstImage(content) {
  const mdMatch = /!\[[^\]]*\]\(([^)\s]+)/.exec(content);
  if (mdMatch) return mdMatch[1];
  const htmlMatch = /<img[^>]*\ssrc=["']([^"']+)["']/i.exec(content);
  return htmlMatch ? htmlMatch[1] : "";
}

// Falls back to a plain-text excerpt of the article body when no description
// was written, so headline cards and story grids never render with an empty,
// awkward gap where a summary should be. Strips raw HTML tags as well as
// Markdown syntax, so a stray <img> or similar never leaks into the excerpt.
function excerptFrom(content, max = 160) {
  const plain = content
    .replace(/<[^>]+>/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#*_>`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!plain) return "";
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max).replace(/\s+\S*$/, "")}…`;
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
      description: data.description || excerptFrom(content),
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
    description: data.description || excerptFrom(content),
    author: data.author || "",
    image: firstImage(content),
    html: marked.parse(content),
  };
}
