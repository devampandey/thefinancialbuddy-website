// Shared frontmatter parsing/serialization for markdown content files.
// Used both by the public site (lib/blog.js, reading from the local
// filesystem) and by the admin API routes (reading/writing via the GitHub
// Contents API), so the format must stay in sync in exactly one place.

export function parseFrontmatter(raw) {
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

// Escapes a value for safe use inside a double-quoted frontmatter field.
function escapeValue(value) {
  return String(value ?? "").replace(/"/g, '\\"').replace(/\r?\n/g, " ");
}

export function stringifyFrontmatter(data, content) {
  const lines = Object.entries(data)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${key}: "${escapeValue(value)}"`);
  return `---\n${lines.join("\n")}\n---\n\n${content.trim()}\n`;
}

export function slugify(title) {
  return String(title)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
