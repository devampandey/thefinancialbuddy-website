import Link from "next/link";

export const metadata = {
  title: "Free Financial Calculators",
  description: "Budgeting, debt payoff, and savings calculators — free and easy to use.",
};

const tools = [
  {
    href: "/tools/budget-calculator",
    title: "Budget Calculator",
    description: "Enter your income and see a suggested 50/30/20 budget breakdown.",
  },
  {
    href: "/tools/debt-payoff",
    title: "Debt Payoff Calculator",
    description: "Add your debts and see how long payoff takes with extra payments.",
  },
  {
    href: "/tools/emi-calculator",
    title: "EMI Calculator",
    description: "Calculate your monthly loan payment, total payment, and total interest.",
  },
  {
    href: "/tools/gold-rate",
    title: "Gold Rate Today",
    description: "Live gold price in India, per 10 grams.",
  },
  {
    href: "/tools/silver-rate",
    title: "Silver Rate Today",
    description: "Live silver price in India, per kilogram.",
  },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold text-black dark:text-white">Free Financial Tools</h1>
      <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-400">
        Simple calculators to help you make decisions with real numbers instead
        of guesswork. More tools are added regularly.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-xl border border-gray-200 p-6 transition-shadow hover:shadow-md dark:border-gray-800 dark:hover:bg-gray-800/40"
          >
            <h2 className="text-lg font-semibold text-black dark:text-white">{tool.title}</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
