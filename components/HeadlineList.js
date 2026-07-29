import Link from "next/link";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function HeadlineList({ posts, showCategory = false, emptyMessage }) {
  if (!posts || posts.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 px-5 py-8 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
        {emptyMessage || "No articles here yet — check back soon."}
      </p>
    );
  }

  return (
    <div className="divide-y divide-gray-200 border-t border-gray-200 dark:divide-gray-800 dark:border-gray-800">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="block py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60"
        >
          {showCategory && (
            <span className="mr-2 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-brand dark:bg-gray-800">
              {post.category}
            </span>
          )}
          <span className="font-semibold text-navy dark:text-white">{post.title}</span>
          {post.description && (
            <p className="mt-0.5 truncate text-sm text-gray-500 dark:text-gray-400">{post.description}</p>
          )}
          <span className="mt-1 block text-xs text-gray-400 dark:text-gray-500">
            {formatDate(post.date)}
            {post.author ? ` · By ${post.author}` : ""}
          </span>
        </Link>
      ))}
    </div>
  );
}
