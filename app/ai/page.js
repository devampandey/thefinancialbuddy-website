import { getPostsByCategory } from "@/lib/blog";
import HeadlineList from "@/components/HeadlineList";
import { SITE_URL } from "@/lib/articleMeta";

export const metadata = {
  title: "Technology",
  description: "Technology and AI coverage from The Financial Buddy.",
  alternates: { canonical: `${SITE_URL}/ai` },
};

export default function AiPage() {
  const posts = getPostsByCategory("Technology");

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-black dark:text-white">Technology</h1>
      <div className="mt-8">
        <HeadlineList posts={posts} emptyMessage="No technology posts yet — first one is coming soon." />
      </div>
    </div>
  );
}
