import { getAllPosts } from "@/lib/blog";

// Matches the canonical host used in app/sitemap.js — thefinancialbuddy.com
// redirects to www, and www is what's verified in Search Console.
const SITE_URL = "https://www.thefinancialbuddy.com";

// Google News only wants articles from roughly the last 48 hours in this
// sitemap — older articles belong in the regular sitemap.xml instead. This
// is what actually gets registered as the "News sitemap" in Google
// Publisher Center / Search Console, separate from the general sitemap.
const MAX_AGE_HOURS = 48;

function escapeXml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const revalidate = 300;

export async function GET() {
  const cutoff = Date.now() - MAX_AGE_HOURS * 60 * 60 * 1000;

  const recentPosts = getAllPosts().filter((post) => {
    const d = post.date ? new Date(post.date).getTime() : NaN;
    return !Number.isNaN(d) && d >= cutoff;
  });

  const urls = recentPosts
    .map((post) => {
      const loc = `${SITE_URL}/blog/${post.slug}`;
      return `
  <url>
    <loc>${loc}</loc>
    <news:news>
      <news:publication>
        <news:name>The Financial Buddy</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${post.date}</news:publication_date>
      <news:title>${escapeXml(post.title)}</news:title>
    </news:news>
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
