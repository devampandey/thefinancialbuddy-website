import Link from "next/link";

const PILLS = [
  { href: "/business", label: "Business" },
  { href: "/politics", label: "Politics" },
  { href: "/tools/gold-rate", label: "Gold Rate" },
  { href: "/tools/silver-rate", label: "Silver Rate" },
  { href: "/tools/emi-calculator", label: "EMI Calculator" },
  { href: "/tools/debt-payoff", label: "Debt Payoff Calculator" },
];

export default function CategoryPills() {
  return (
    <div className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/60">
      <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2 sm:px-6 sm:py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PILLS.map((pill) => (
          <Link
            key={pill.href}
            href={pill.href}
            className="shrink-0 rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-brand hover:text-brand dark:border-gray-700 dark:text-gray-300 sm:px-3.5"
          >
            {pill.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
