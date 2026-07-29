import Link from "next/link";
import { getAllPosts, getPostsByCategory } from "@/lib/blog";
import HeadlineList from "@/components/HeadlineList";
import Subscribe from "@/components/Subscribe";

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
  { key: "AI", href: "/ai" },
];

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

export default function HomePage() {
  const allPosts = getAllPosts();
  const [featured, ...rest] = allPosts;
  const latest = rest.slice(0, 6);

  return (
    <div>
      <section className="bg-navy text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <p className="text-sm font-medium text-gray-200 sm:text-base">
            Money guidance you can actually use — no jargon, no sales pitch.
          </p>
          <div className="flex shrink-0 gap-3">
            <Link
              href="/tools"
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-light"
            >
              Explore Tools
            </Link>
            <Link
              href="/news"
              className="rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Latest News
            </Link>
          </div>
        </div>
      </section>

      {featured && (
        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid gap-8 lg:grid-cols-3">
            <Link
              href={`/blog/${featured.slug}`}
              className="group lg:col-span-2"
            >
              {featured.image && (
                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                  <img
                    src={featured.image}
                    alt=""
                    className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
              )}
              <div className="mt-4 flex items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-brand dark:bg-gray-800">
                  {featured.category}
                </span>
                <span>{formatDate(featured.date)}</span>
                {featured.author && <span>By {featured.author}</span>}
              </div>
              <h1 className="mt-2 text-2xl font-bold leading-tight text-navy group-hover:underline dark:text-white sm:text-3xl">
                {featured.title}
              </h1>
              {featured.description && (
                <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
                  {featured.description}
                </p>
              )}
            </Link>

            <div>
              <div className="flex items-center justify-between border-b-2 border-navy pb-2 dark:border-white">
                <h2 className="text-lg font-bold text-navy dark:text-white">Latest</h2>
                <Link href="/blog" className="text-xs font-medium text-brand hover:underline">
                  View all
                </Link>
              </div>
              <div className="mt-1">
                <HeadlineList posts={latest} showCategory emptyMessage="More stories coming soon." />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          {columns.map((col) => {
            const posts = getPostsByCategory(col.key).slice(0, 4);
            return (
              <div key={col.key}>
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

      <section className="mx-auto max-w-6xl px-6 py-12">
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
