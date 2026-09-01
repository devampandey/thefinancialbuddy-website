import Link from "next/link";
import { getAllPosts, getAllCategories } from "@/lib/blog";
import { getPostUrl, CATEGORY_LINKS } from "@/lib/categories";
import { SITE_URL } from "@/lib/articleMeta";

// /blog?category=Business shows essentially the same list as the dedicated
// /business page — without this, Search Console flags it as a duplicate
// with no canonical hint. Pointing the filtered view's canonical at the
// matching category page (instead of at itself) tells Google which one is
// authoritative, same as any other filter-view/canonical-page pair.
export function generateMetadata({ searchParams }) {
  const activeCategory = searchParams?.category;
  const dedicated = activeCategory && CATEGORY_LINKS[activeCategory];
  return {
    title: "Latest News",
    description: "The latest articles from The Financial Buddy — finance, markets, AI, and more.",
    alternates: {
      canonical: `${SITE_URL}${dedicated ? dedicated.href : "/blog"}`,
    },
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

export default function LatestNewsPage({ searchParams }) {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const activeCategory = searchParams?.category || "All";

  const filtered =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-black dark:text-white">Latest News</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={cat === "All" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "border-navy bg-navy text-white dark:border-white dark:bg-white dark:text-navy"
                : "border-gray-300 text-gray-600 hover:border-brand hover:text-brand dark:border-gray-700 dark:text-gray-400"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      <div className="mt-8 divide-y divide-gray-200 dark:divide-gray-800">
        {filtered.map((post) => (
          <Link
            key={post.slug}
            href={getPostUrl(post)}
            className="group flex items-start justify-between gap-5 py-6 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-brand dark:bg-gray-800">
                  {post.category}
                </span>
                <span>{formatDate(post.date)}</span>
                {post.author && <span>By {post.author}</span>}
              </div>
              <h2 className="mt-2 text-lg font-semibold text-black group-hover:text-navy dark:text-white dark:group-hover:text-navy-light">
                {post.title}
              </h2>
              <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                {post.description}
              </p>
            </div>
            {post.image && (
              <img
                src={post.image}
                alt=""
                className="h-20 w-28 shrink-0 rounded-lg border border-gray-200 object-cover dark:border-gray-700"
              />
            )}
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="py-6 text-gray-500 dark:text-gray-400">No articles in this category yet.</p>
        )}
      </div>
    </div>
  );
}
