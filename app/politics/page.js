import { getPostsByCategory } from "@/lib/blog";
import HeadlineList from "@/components/HeadlineList";

export const metadata = {
  title: "Politics & Policy",
  description:
    "Politics and policy coverage from The Financial Buddy — factual, non-partisan summaries from India and around the world.",
};

export default function PoliticsPage() {
  const posts = getPostsByCategory("Politics");

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-black dark:text-white">Politics & Policy</h1>
      <div className="mt-8">
        <HeadlineList posts={posts} emptyMessage="No politics & policy posts yet — first one is coming soon." />
      </div>
    </div>
  );
}
