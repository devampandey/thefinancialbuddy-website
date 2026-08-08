import DebtPayoffCalculator from "@/components/DebtPayoffCalculator";

export const metadata = {
  title: "Debt Payoff Calculator — Snowball vs. Avalanche",
  description:
    "Enter your debts and see exactly how long payoff takes under the snowball and avalanche methods, plus total interest paid.",
};

export default function DebtPayoffPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold text-black dark:text-white">Debt Payoff Calculator</h1>
      <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-400">
        List each debt with its balance, interest rate, and minimum payment.
        Add any extra amount you can put toward debt each month to compare
        payoff timelines.
      </p>

      <div className="mt-10">
        <DebtPayoffCalculator />
      </div>

      <div className="prose-financial mt-12 max-w-2xl text-gray-700 dark:text-gray-300">
        <h2>Snowball vs. avalanche</h2>
        <p>
          The snowball method pays off your smallest balance first regardless
          of interest rate — it builds momentum through quick wins. The
          avalanche method targets your highest interest rate first, which
          minimizes total interest paid over time. Avalanche is
          mathematically cheaper; snowball tends to have better real-world
          adherence for people who need motivation to stay consistent.
        </p>
      </div>
    </div>
  );
}
