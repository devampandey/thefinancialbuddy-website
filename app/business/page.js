import { getPostsByCategory } from "@/lib/blog";
import HeadlineList from "@/components/HeadlineList";

export const metadata = {
  title: "Business",
  description: "Business and personal finance coverage from The Financial Buddy.",
};

export default function BusinessPage() {
  const posts = getPostsByCategory("Business");

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-black dark:text-white">Business</h1>
      <div className="mt-8">
        <HeadlineList posts={posts} emptyMessage="No business posts yet — first one is coming soon." />
      </div>
    </div>
  );
}
