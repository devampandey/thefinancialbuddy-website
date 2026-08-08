import { listPublishedPosts } from "@/lib/posts";
import PostRow from "@/components/admin/PostRow";

export default async function ManagePostsPage() {
  let posts = [];
  let loadError = "";
  try {
    posts = await listPublishedPosts();
  } catch (err) {
    // Surface the real error instead of quietly showing "no articles" —
    // that used to mask GitHub API failures (bad token, wrong repo, etc.)
    // as if the site simply had nothing published.
    loadError = err.message || "Something went wrong loading articles.";
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-medium text-brand">Admin</p>
      <h1 className="mt-1 text-3xl font-bold text-black dark:text-white">Manage articles</h1>

      {loadError ? (
        <p className="mt-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          Couldn't load articles: {loadError}
        </p>
      ) : (
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {posts.length === 0
            ? "No published articles yet."
            : `${posts.length} published article${posts.length === 1 ? "" : "s"}. Edits and deletes go live immediately, no review step.`}
        </p>
      )}

      <div className="mt-8 space-y-4">
        {posts.map((post) => (
          <PostRow key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
