import { getShortsPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/articleMeta";
import ShortsFeed from "@/components/ShortsFeed";

export const metadata = {
  title: "Shorts",
  description: "The Financial Buddy's news, in 60 words or less — swipe through today's top stories.",
  alternates: { canonical: `${SITE_URL}/shorts` },
};

// FinShorts: an Inshorts-style condensed feed. Only articles drafted after
// this feature shipped carry a shortSummary in frontmatter (see the
// scheduled draft tasks) — there's no backfill of older posts, so this
// feed starts small and grows as new articles get published.
export default function ShortsPage() {
  const posts = getShortsPosts();

  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-black dark:text-white">Shorts</h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Bite-sized stories are coming soon — check back after the next round of articles publishes.
        </p>
      </div>
    );
  }

  return <ShortsFeed posts={posts} />;
}
