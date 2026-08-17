import { getPostsByCategory } from "@/lib/blog";
import HeadlineList from "@/components/HeadlineList";
import { SITE_URL } from "@/lib/articleMeta";

export const metadata = {
  title: "Lifestyle",
  description: "Sales, deals, travel, and lifestyle coverage from The Financial Buddy.",
  alternates: { canonical: `${SITE_URL}/lifestyle` },
};

export default function LifestylePage() {
  const posts = getPostsByCategory("Lifestyle");

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-black dark:text-white">Lifestyle</h1>
      <div className="mt-8">
        <HeadlineList posts={posts} emptyMessage="No lifestyle posts yet — first one is coming soon." />
      </div>
    </div>
  );
}
