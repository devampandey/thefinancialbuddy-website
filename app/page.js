import Link from "next/link";
import { getAllPosts, getPostsByCategory } from "@/lib/blog";
import HeadlineList from "@/components/HeadlineList";
import HeroCarousel from "@/components/HeroCarousel";
import Subscribe from "@/components/Subscribe";

// "absolute" bypasses the root layout's "%s | The Financial Buddy" title
// template so the homepage tab shows exactly this text, not a longer
// templated version.
export const metadata = {
  title: { absolute: "Home - Financial Buddy" },
};

const tools = [
  {
    href: "/tools/budget-calculator",
    title: "Budget Calculator",
    description: "See where your income should go using the 50/30/20 rule.",
  },
  {
    href: "/tools/debt-payoff",
    title: "Debt Payoff Calculator",
    description: "Compare the snowball vs. avalanche method and see your debt-free date.",
  },
  {
    href: "/tools/emi-calculator",
    title: "EMI Calculator",
    description: "Calculate your monthly loan payment, total payment, and total interest.",
  },
];

const columns = [
  { key: "News", href: "/news" },
  { key: "Politics", href: "/politics" },
  { key: "Technology", href: "/ai" },
];

export default function HomePage() {
  // Chai & Charts issues have their own dedicated page (/chai-charts) and
  // shouldn't compete with regular articles for the homepage hero, Latest
  // grid, or News column.
  const allPosts = getAllPosts().filter((post) => post.category !== "Newsletter");
  // The hero rotates through the most recent posts automatically instead of
  // pinning a single one until the next publish — see HeroCarousel. "Latest"
  // below picks up right after those so the same story doesn't appear twice.
  const heroPosts = allPosts.slice(0, 5);
  const latest = allPosts.slice(heroPosts.length, heroPosts.length + 6);

  return (
    <div>
      {heroPosts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          <HeroCarousel posts={heroPosts} />

          {latest.length > 0 && (
            <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800 sm:mt-10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-navy dark:text-white">Latest</h2>
                <Link href="/blog" className="text-xs font-medium text-brand hover:underline">
                  View all
                </Link>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                {latest.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group min-w-0">
                    {post.image && (
                      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                        <img
                          src={post.image}
                          alt=""
                          className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      </div>
                    )}
                    <span className="mt-2 block text-xs font-medium text-brand">
                      {post.category}
                    </span>
                    <h3 className="mt-1 break-words text-sm font-semibold leading-snug text-black group-hover:text-navy group-hover:underline dark:text-white dark:group-hover:text-navy-light">
                      {post.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid items-start gap-8 sm:grid-cols-3 sm:gap-10">
          {columns.map((col) => {
            // "News" is an aggregate feed of everything (newest first), not
            // a literal category tag — no article is ever tagged "News"
            // itself, so filtering by category here left this column
            // permanently empty.
            const posts =
              col.key === "News"
                ? allPosts.slice(0, 4)
                : getPostsByCategory(col.key).slice(0, 4);
            return (
              // min-w-0 overrides the browser default of min-width:auto on
              // grid items, which otherwise sizes a column to fit its
              // widest unbreakable content instead of the actual grid
              // track — that was letting headlines get cut off at the
              // viewport edge on mobile instead of wrapping.
              <div key={col.key} className="min-w-0">
                <div className="flex items-center justify-between border-b-2 border-navy pb-2 dark:border-white">
                  <h2 className="text-lg font-bold text-navy dark:text-white">{col.key}</h2>
                  <Link href={col.href} className="text-xs font-medium text-brand hover:underline">
                    View all
                  </Link>
                </div>
                <div className="mt-1">
                  <HeadlineList
                    posts={posts}
                    emptyMessage="Nothing here yet."
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-navy dark:text-white">Free tools</h2>
          <Link href="/tools" className="text-sm font-medium text-brand hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-xl border border-gray-200 p-6 transition-shadow hover:shadow-md dark:border-gray-800 dark:hover:bg-gray-800/40"
            >
              <h3 className="text-lg font-semibold text-navy dark:text-white">{tool.title}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <Subscribe />
    </div>
  );
}
