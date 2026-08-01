import { getPostsByCategory } from "@/lib/blog";
import HeadlineList from "@/components/HeadlineList";

export const metadata = {
  title: "News",
  description: "The latest news coverage from The Financial Buddy.",
};

export default function NewsPage() {
  const posts = getPostsByCategory("News");

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy dark:text-white">News</h1>
      <div className="mt-8">
        <HeadlineList posts={posts} emptyMessage="No news posts yet — first one is coming soon." />
      </div>
    </div>
  );
}
