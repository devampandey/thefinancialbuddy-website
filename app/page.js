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
      {featured && (
        <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          <Link href={`/blog/${featured.slug}`} className="group block">
            {featured.image ? (
              <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                <img
                  src={featured.image}
                  alt=""
                  className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] sm:aspect-[21/9]"
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-brand px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  {featured.category}
                </span>
              </div>
            ) : (
              <span className="inline-block rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-brand dark:bg-gray-800">
                {featured.category}
              </span>
            )}
            <div className="mt-3 flex items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400 sm:mt-4">
              <span>{formatDate(featured.date)}</span>
              {featured.author && <span>By {featured.author}</span>}
            </div>
            <h1 className="mt-2 max-w-3xl text-2xl font-bold leading-tight tracking-tight text-navy group-hover:underline dark:text-white sm:text-3xl md:text-4xl">
              {featured.title}
            </h1>
            {featured.description && (
              <p className="mt-2 max-w-2xl text-base text-gray-600 dark:text-gray-400 sm:mt-3 sm:text-lg">
                {featured.description}
              </p>
            )}
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand sm:mt-4">
              Continue reading
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>

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
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
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
                    <h3 className="mt-1 text-sm font-semibold leading-snug text-navy group-hover:underline dark:text-white">
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
