import Link from "next/link";

const featuredTools = [
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
];

const featuredGuides = [
  {
    href: "/guides/emergency-fund",
    title: "How to Build an Emergency Fund",
    description: "A step-by-step plan for saving 3–6 months of expenses, even on a tight budget.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
            Money guidance you can actually use.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-gray-200">
            Free calculators and plain-English guides to help you budget,
            pay off debt, and start saving — no jargon, no sales pitch.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="/tools"
              className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-light"
            >
              Explore Tools
            </Link>
            <Link
              href="/guides"
              className="rounded-lg border border-white/40 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Read Guides
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold text-navy">Popular tools</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {featuredTools.map((tool) => (
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

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold text-navy">Latest guides</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {featuredGuides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="rounded-xl border border-gray-200 p-6 transition-shadow hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-navy">{guide.title}</h3>
              <p className="mt-2 text-gray-600">{guide.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
