import { getPostsByCategory } from "@/lib/blog";
import HeadlineList from "@/components/HeadlineList";
import { SITE_URL } from "@/lib/articleMeta";

export const metadata = {
  title: "IPO",
  description: "IPO news and coverage from The Financial Buddy.",
  alternates: { canonical: `${SITE_URL}/ipo` },
};

export default function IpoPage() {
  const posts = getPostsByCategory("IPO");

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-black dark:text-white">IPO</h1>
      <div className="mt-8">
        <HeadlineList posts={posts} emptyMessage="No IPO posts yet — first one is coming soon." />
      </div>
    </div>
  );
}
