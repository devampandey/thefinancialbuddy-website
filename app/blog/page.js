import Link from "next/link";
import { getAllPosts, getAllCategories } from "@/lib/blog";

export const metadata = {
  title: "Blog",
  description: "Articles on finance, AI, and more from The Financial Buddy.",
};

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

export default function BlogIndexPage({ searchParams }) {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const activeCategory = searchParams?.category || "All";

  const filtered =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy dark:text-white">Blog</h1>
      <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-400">
        Articles on finance, AI, and other topics — published regularly.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
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

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {filtered.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="rounded-xl border border-gray-200 p-6 transition-shadow hover:shadow-md dark:border-gray-800 dark:hover:bg-gray-800/40"
          >
            <div className="flex items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-brand dark:bg-gray-800">
                {post.category}
              </span>
              <span>{formatDate(post.date)}</span>
              {post.author && <span>By {post.author}</span>}
            </div>
            <h2 className="mt-3 text-lg font-semibold text-navy dark:text-white">{post.title}</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{post.description}</p>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">No posts in this category yet.</p>
        )}
      </div>
    </div>
  );
}
