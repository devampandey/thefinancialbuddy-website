import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
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
    datePublished: post.date || undefined,
    dateModified: post.date || undefined,
    author: post.author
      ? { "@type": "Person", name: post.author }
      : { "@type": "Organization", name: "The Financial Buddy" },
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

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-brand dark:bg-gray-800">
          {post.category}
        </span>
        <span>{formatDate(post.date)}</span>
        {post.author && <span>By {post.author}</span>}
      </div>
      <h1 className="mt-3 text-3xl font-bold text-navy dark:text-white">{post.title}</h1>

      <div className="mt-4">
        <BookmarkButton slug={post.slug} title={post.title} />
      </div>

      <div
        className="prose-financial mt-8 text-gray-700 dark:text-gray-300"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      <CommentsSection slug={post.slug} />
    </article>
  );
}
