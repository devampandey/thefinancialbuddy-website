import Link from "next/link";

const PILLS = [
  { href: "/tools/gold-rate", label: "Gold Rate" },
  { href: "/tools/silver-rate", label: "Silver Rate" },
  { href: "/tools/emi-calculator", label: "EMI Calculator" },
  { href: "/tools/debt-payoff", label: "Debt Payoff Calculator" },
];

// Styled as a thin, centered, pipe-separated utility row directly under the
// masthead — the broadsheet-style secondary link row (e.g. "Print Edition |
// Video | Audio | ...") rather than the old rounded pill buttons.
export default function CategoryPills() {
  return (
    <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex w-fit max-w-full items-center overflow-x-auto px-4 py-2 text-xs text-gray-500 dark:text-gray-400 sm:px-6 sm:text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PILLS.map((pill, i) => (
          <span key={pill.href} className="flex shrink-0 items-center">
            {i > 0 && <span className="mx-2 text-gray-300 dark:text-gray-700" aria-hidden="true">|</span>}
            <Link
              href={pill.href}
              className="whitespace-nowrap transition-colors hover:text-brand dark:hover:text-brand-light"
            >
              {pill.label}
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
}
