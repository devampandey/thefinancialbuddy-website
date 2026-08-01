import { getPostsByCategory } from "@/lib/blog";
import HeadlineList from "@/components/HeadlineList";

export const metadata = {
  title: "IPO",
  description: "IPO news and coverage from The Financial Buddy.",
};

export default function IpoPage() {
  const posts = getPostsByCategory("IPO");

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy dark:text-white">IPO</h1>
      <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-400">
        New listings, IPO news, and what they mean for everyday investors.
      </p>
      <div className="mt-8">
        <HeadlineList posts={posts} emptyMessage="No IPO posts yet — first one is coming soon." />
      </div>
    </div>
  );
}
