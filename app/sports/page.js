import { getPostsByCategory } from "@/lib/blog";
import HeadlineList from "@/components/HeadlineList";

export const metadata = {
  title: "Sports",
  description: "Sports news and updates from The Financial Buddy.",
};

export default function SportsPage() {
  const posts = getPostsByCategory("Sports");

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-black dark:text-white">Sports</h1>
      <div className="mt-8">
        <HeadlineList posts={posts} emptyMessage="No sports posts yet — first one is coming soon." />
      </div>
    </div>
  );
}
