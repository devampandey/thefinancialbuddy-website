import { getPostsByCategory } from "@/lib/blog";
import HeadlineList from "@/components/HeadlineList";
import { SITE_URL } from "@/lib/articleMeta";

export const metadata = {
  title: "Insights",
  description:
    "Long-form explainers and analysis on history, economics, the AI landscape, and more — from The Financial Buddy.",
  alternates: { canonical: `${SITE_URL}/insights` },
};

export default function InsightsPage() {
  const posts = getPostsByCategory("Insights");

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-black dark:text-white">Insights</h1>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        Researched, long-form pieces on history, economics, the AI landscape, and other topics
        worth understanding in depth — published roughly weekly.
      </p>
      <div className="mt-8">
        <HeadlineList posts={posts} emptyMessage="No Insights pieces yet — first one is coming soon." />
      </div>
    </div>
  );
}
