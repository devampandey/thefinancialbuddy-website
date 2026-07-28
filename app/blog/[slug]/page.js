import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

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

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-brand dark:bg-gray-800">
          {post.category}
        </span>
        <span>{formatDate(post.date)}</span>
      </div>
      <h1 className="mt-3 text-3xl font-bold text-navy dark:text-white">{post.title}</h1>

      <div
        className="prose-financial mt-8 text-gray-700 dark:text-gray-300"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </article>
  );
}
