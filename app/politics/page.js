import { getPostsByCategory } from "@/lib/blog";
import HeadlineList from "@/components/HeadlineList";

export const metadata = {
  title: "Politics",
  description: "Politics coverage from The Financial Buddy — factual, non-partisan summaries.",
};

export default function PoliticsPage() {
  const posts = getPostsByCategory("Politics");

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy dark:text-white">Politics</h1>
      <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-400">
        Factual, non-partisan coverage of policy and events relevant to
        everyday finances.
      </p>
      <div className="mt-8">
        <HeadlineList posts={posts} emptyMessage="No politics posts yet — first one is coming soon." />
      </div>
    </div>
  );
}
