import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { CATEGORY_LINKS } from "@/lib/categories";
import BookmarkButton from "@/components/reader/BookmarkButton";
import CommentsSection from "@/components/reader/CommentsSection";

// Matches the canonical host used in sitemap.js/robots.js (the site
// redirects non-www to www).
const SITE_URL = "https://www.thefinancialbuddy.com";

function absoluteImageUrl(image) {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
}

// Frontmatter dates are plain "YYYY-MM-DD" strings. Google's structured-data
// validator wants a full ISO 8601 datetime with a timezone offset for
// datePublished/dateModified, so this pins publish time to midnight IST
// (the site's audience) rather than leaving it ambiguous.
function toIsoWithTimezone(dateStr) {
  if (!dateStr) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return `${dateStr}T00:00:00+05:30`;
  return dateStr;
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPostPage({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const imageUrl = absoluteImageUrl(post.image);

  // Tells Google (and any other consumer) the headline, author, publish
  // date, and publisher for this article directly — a standard signal
  // used for Top Stories / Google News eligibility and general article
  // rich results, not something visible on the page itself.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.description,
    ...(imageUrl ? { image: [imageUrl] } : {}),
    datePublished: toIsoWithTimezone(post.date),
    dateModified: toIsoWithTimezone(post.date),
    author: post.author
      ? { "@type": "Person", name: post.author, url: `${SITE_URL}/about` }
      : { "@type": "Organization", name: "The Financial Buddy", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "The Financial Buddy",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo-icon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  };

  const categoryMeta = CATEGORY_LINKS[post.category] || { href: "/blog", label: post.category };

  // A second, standard structured-data signal alongside NewsArticle — this
  // one tells Google the page's place in the site hierarchy, which is what
  // powers the breadcrumb trail Google sometimes shows in search results
  // instead of the raw URL.
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryMeta.label,
        item: `${SITE_URL}${categoryMeta.href}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE_URL}/blog/${post.slug}`,
      },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav
        aria-label="Breadcrumb"
        className="mb-5 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <Link href="/" className="text-brand hover:underline">
          Home
        </Link>
        <span className="text-gray-400 dark:text-gray-600">/</span>
        <Link href={categoryMeta.href} className="text-brand hover:underline">
          {categoryMeta.label}
        </Link>
        <span className="text-gray-400 dark:text-gray-600">/</span>
        <span className="min-w-0 truncate text-gray-500 dark:text-gray-400">{post.title}</span>
      </nav>

      <div className="flex items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-brand dark:bg-gray-800">
          {post.category}
        </span>
        <span>{formatDate(post.date)}</span>
        {post.author && <span>By {post.author}</span>}
      </div>
      <h1 className="mt-3 text-3xl font-bold text-navy dark:text-white">{post.title}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <BookmarkButton slug={post.slug} title={post.title} />
        {post.pdf && (
          <a
            href={post.pdf}
            download
            className="inline-flex items-center gap-1.5 rounded-lg border border-navy px-3 py-1.5 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-navy"
          >
            Download PDF
          </a>
        )}
      </div>

      <div
        className="prose-financial mt-8 text-gray-700 dark:text-gray-300"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      <CommentsSection slug={post.slug} />
    </article>
  );
}
