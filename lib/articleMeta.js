import { getPostBySlug } from "@/lib/blog";
import { getPostUrl } from "@/lib/categories";

// Matches the canonical host used in sitemap.js/robots.js (the site
// redirects non-www to www).
export const SITE_URL = "https://www.thefinancialbuddy.com";

export function absoluteImageUrl(image) {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
}

// Frontmatter dates are plain "YYYY-MM-DD" strings. Google's structured-data
// validator wants a full ISO 8601 datetime with a timezone offset for
// datePublished/dateModified, so this pins publish time to midnight IST
// (the site's audience) rather than leaving it ambiguous.
export function toIsoWithTimezone(dateStr) {
  if (!dateStr) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return `${dateStr}T00:00:00+05:30`;
  return dateStr;
}

// Shared by every per-category article route's generateMetadata export, so
// the Open Graph/Twitter Card logic only lives in one place regardless of
// which category folder (business/[slug], sports/[slug], etc.) rendered it.
export function buildArticleMetadata(slug) {
  const post = getPostBySlug(slug);
  if (!post) return {};
  const imageUrl = absoluteImageUrl(post.image);
  const pageUrl = `${SITE_URL}${getPostUrl(post)}`;

  // Without these, a shared link has nothing for Twitter/X, LinkedIn,
  // WhatsApp, etc. to build a preview card from — the page had a title and
  // description for search engines, but nothing telling social platforms
  // which image to use, so shared links rendered as plain text instead of
  // the headline + image card real news sites get.
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: post.title,
      description: post.description,
      url: pageUrl,
      siteName: "The Financial Buddy",
      type: "article",
      publishedTime: post.date || undefined,
      authors: post.author ? [post.author] : undefined,
      ...(imageUrl ? { images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }] } : {}),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: post.title,
      description: post.description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}
