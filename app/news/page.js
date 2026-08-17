import { getAllPosts } from "@/lib/blog";
import HeadlineList from "@/components/HeadlineList";
import { SITE_URL } from "@/lib/articleMeta";

export const metadata = {
  title: "News",
  description: "The latest news coverage from The Financial Buddy.",
  alternates: { canonical: `${SITE_URL}/news` },
};

// "News" is an aggregate, newest-first feed of every article regardless of
// category — not a literal category tag (no article is ever tagged "News"
// itself), since getAllPosts() already sorts newest-first.
export default function NewsPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-black dark:text-white">News</h1>
      <div className="mt-8">
        <HeadlineList posts={posts} emptyMessage="No news posts yet — first one is coming soon." />
      </div>
    </div>
  );
}
