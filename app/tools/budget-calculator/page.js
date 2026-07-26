import BudgetCalculator from "@/components/BudgetCalculator";

export const metadata = {
  title: "Budget Calculator — 50/30/20 Rule",
  description:
    "Enter your income and expenses to see a suggested 50/30/20 budget breakdown, free and instant.",
};

export default function BudgetCalculatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy">Budget Calculator</h1>
      <p className="mt-3 max-w-2xl text-gray-600">
        This calculator uses the 50/30/20 rule — 50% of income to needs, 30%
        to wants, and 20% to savings and debt payoff — as a benchmark. Enter
        your real numbers below to see how your current budget compares.
      </p>

      <div className="mt-10">
        <BudgetCalculator />
      </div>

      <div className="prose-financial mt-12 max-w-2xl text-gray-700">
        <h2>How to use this calculator</h2>
        <p>
          Start with your monthly take-home pay (after taxes). Then total up
          what you actually spend in each category over a typical month —
          bank and credit card statements are the most reliable source. The
          goal isn&apos;t to hit 50/30/20 exactly; it&apos;s to see which
          category is furthest from target and start there.
        </p>
        <h2>What counts as a &quot;need&quot;?</h2>
        <p>
          Housing, utilities, groceries, insurance, minimum debt payments,
          and transportation to work. Subscriptions, dining out, and
          entertainment fall under &quot;wants&quot; — even ones that feel
          essential.
        </p>
      </div>
    </div>
  );
}
