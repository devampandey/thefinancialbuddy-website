import { getPostsByCategory } from "@/lib/blog";
import HeadlineList from "@/components/HeadlineList";

export const metadata = {
  title: "AI",
  description: "AI coverage from The Financial Buddy.",
};

export default function AiPage() {
  const posts = getPostsByCategory("AI");

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy dark:text-white">AI</h1>
      <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-400">
        How AI tools and trends intersect with everyday life and money.
      </p>
      <div className="mt-8">
        <HeadlineList posts={posts} emptyMessage="No AI posts yet — first one is coming soon." />
      </div>
    </div>
  );
}
