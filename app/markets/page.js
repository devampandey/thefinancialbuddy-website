import { getPostsByCategory } from "@/lib/blog";
import HeadlineList from "@/components/HeadlineList";
import { SITE_URL } from "@/lib/articleMeta";

export const metadata = {
  title: "Markets",
  description: "Stock market and investing news from The Financial Buddy.",
  alternates: { canonical: `${SITE_URL}/markets` },
};

export default function MarketsPage() {
  const posts = getPostsByCategory("Markets");

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-black dark:text-white">Markets</h1>
      <div className="mt-8">
        <HeadlineList posts={posts} emptyMessage="No markets posts yet — first one is coming soon." />
      </div>
    </div>
  );
}
