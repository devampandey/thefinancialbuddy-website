import { listPublishedPosts } from "@/lib/posts";
import PostRow from "@/components/admin/PostRow";

export default async function ManagePostsPage() {
  const posts = await listPublishedPosts().catch(() => []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-medium text-brand">Admin</p>
      <h1 className="mt-1 text-3xl font-bold text-navy dark:text-white">Manage articles</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        {posts.length === 0
          ? "No published articles yet."
          : `${posts.length} published article${posts.length === 1 ? "" : "s"}. Edits and deletes go live immediately, no review step.`}
      </p>

      <div className="mt-8 space-y-4">
        {posts.map((post) => (
          <PostRow key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
