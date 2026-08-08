import { getPostsByCategory } from "@/lib/blog";
import HeadlineList from "@/components/HeadlineList";

export const metadata = {
  title: "World",
  description: "World news coverage from The Financial Buddy — global markets, business, and events beyond India.",
};

export default function WorldPage() {
  const posts = getPostsByCategory("World");

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy dark:text-white">World</h1>
      <div className="mt-8">
        <HeadlineList posts={posts} emptyMessage="No world news posts yet — first one is coming soon." />
      </div>
    </div>
  );
}
