import { getPostsByCategory } from "@/lib/blog";
import HeadlineList from "@/components/HeadlineList";

export const metadata = {
  title: "Markets",
  description: "Stock market and investing news from The Financial Buddy.",
};

export default function MarketsPage() {
  const posts = getPostsByCategory("Markets");

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy dark:text-white">Markets</h1>
      <div className="mt-8">
        <HeadlineList posts={posts} emptyMessage="No markets posts yet — first one is coming soon." />
      </div>
    </div>
  );
}
