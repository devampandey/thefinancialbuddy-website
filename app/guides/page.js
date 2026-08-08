import Link from "next/link";

export const metadata = {
  title: "Guides",
  description: "Plain-English guides on budgeting, debt, and saving.",
};

const guides = [
  {
    href: "/guides/emergency-fund",
    title: "How to Build an Emergency Fund",
    description:
      "A step-by-step plan for saving 3–6 months of expenses, even on a tight budget.",
  },
];

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold text-black dark:text-white">Guides</h1>
      <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-400">
        New guides are added weekly. Each one is written around a single,
        specific question you can act on immediately.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {guides.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="rounded-xl border border-gray-200 p-6 transition-shadow hover:shadow-md dark:border-gray-800 dark:hover:bg-gray-800/40"
          >
            <h2 className="text-lg font-semibold text-black dark:text-white">{guide.title}</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{guide.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
