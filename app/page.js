import Link from "next/link";
import { getPostsByCategory } from "@/lib/blog";
import HeadlineList from "@/components/HeadlineList";
import MarketTicker from "@/components/MarketTicker";

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

export default function HomePage() {
  return (
    <div>
      <MarketTicker />
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h1 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
            Money guidance you can actually use.
          </h1>
          <p className="mt-4 max-w-xl text-gray-200">
            Free calculators plus timely coverage on news, politics, and AI —
            no jargon, no sales pitch.
          </p>
          <div className="mt-6 flex gap-4">
            <Link
              href="/tools"
              className="rounded-lg bg-brand px-6 py-2.5 font-semibold text-white transition-colors hover:bg-brand-light"
            >
              Explore Tools
            </Link>
            <Link
              href="/news"
              className="rounded-lg border border-white/40 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Latest News
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          {columns.map((col) => {
            const posts = getPostsByCategory(col.key).slice(0, 4);
            return (
              <div key={col.key}>
                <div className="flex items-center justify-between border-b-2 border-navy pb-2">
                  <h2 className="text-lg font-bold text-navy">{col.key}</h2>
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
          <h2 className="text-2xl font-bold text-navy">Free tools</h2>
          <Link href="/tools" className="text-sm font-medium text-brand hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-xl border border-gray-200 p-6 transition-shadow hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-navy">{tool.title}</h3>
              <p className="mt-2 text-gray-600">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
