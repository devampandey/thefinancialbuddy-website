import Link from "next/link";

export const metadata = {
  title: "How to Build an Emergency Fund",
  description:
    "A step-by-step plan for saving 3-6 months of expenses, even on a tight budget.",
};

export default function EmergencyFundGuide() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium text-brand">Guide</p>
      <h1 className="mt-2 text-3xl font-bold text-navy dark:text-white">
        How to Build an Emergency Fund
      </h1>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Last updated July 2026</p>

      <div className="prose-financial mt-8 text-gray-700 dark:text-gray-300">
        <p>
          An emergency fund is money set aside specifically to cover
          unexpected expenses — a job loss, medical bill, or car repair —
          without going into debt. Most guidance lands on 3–6 months of
          essential expenses, but the right number depends on your job
          stability and household situation.
        </p>

        <h2>Step 1: Start with a starter fund, not the full target</h2>
        <p>
          If you have any high-interest debt, build a smaller starter fund
          first — commonly $1,000, though tighter budgets can start lower.
          This covers most small emergencies without derailing debt payoff.
        </p>

        <h2>Step 2: Calculate your real target</h2>
        <p>
          Add up essential monthly expenses only — housing, utilities,
          groceries, insurance, minimum debt payments, transportation. Skip
          discretionary spending. Multiply by 3 (more stable income, dual
          earners) to 6 (variable income, single earner, dependents).
        </p>
        <p>
          Use the{" "}
          <Link href="/tools/budget-calculator" className="text-brand hover:underline">
            budget calculator
          </Link>{" "}
          to identify your true essential spending if you haven&apos;t
          tracked it before.
        </p>

        <h2>Step 3: Automate a fixed transfer</h2>
        <p>
          Set up an automatic transfer to a separate high-yield savings
          account on payday, even if it&apos;s small. Consistency matters
          more than amount — $50/month reliably beats $200 sporadically.
        </p>

        <h2>Step 4: Keep it liquid and separate</h2>
        <p>
          Use a savings account that&apos;s easy to access but separate from
          your everyday checking account, so it doesn&apos;t blend into
          regular spending. Avoid investing emergency funds — the point is
          stability, not growth.
        </p>

        <h2>Step 5: Refill it after you use it</h2>
        <p>
          Treat withdrawals as temporary. After an emergency, redirect your
          automatic transfer amount back toward rebuilding the fund before
          resuming other savings goals.
        </p>
      </div>
    </article>
  );
}
