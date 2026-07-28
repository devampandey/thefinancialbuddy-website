"use client";

import { useMemo, useState } from "react";

const currency = (n) =>
  n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

function Field({ label, value, onChange, hint }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-[#1a1a1a] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
      />
      {hint && <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">{hint}</span>}
    </label>
  );
}

export default function BudgetCalculator() {
  const [income, setIncome] = useState(80000);
  const [needs, setNeeds] = useState(36000);
  const [wants, setWants] = useState(18000);
  const [savings, setSavings] = useState(16000);

  const totals = useMemo(() => {
    const monthlyIncome = Number(income) || 0;
    const spent = (Number(needs) || 0) + (Number(wants) || 0) + (Number(savings) || 0);
    const remaining = monthlyIncome - spent;

    const target = {
      needs: monthlyIncome * 0.5,
      wants: monthlyIncome * 0.3,
      savings: monthlyIncome * 0.2,
    };

    return { monthlyIncome, spent, remaining, target };
  }, [income, needs, wants, savings]);

  return (
    <div className="grid gap-8 rounded-2xl border border-gray-200 p-6 dark:border-gray-800 sm:grid-cols-2 sm:p-8">
      <div className="space-y-5">
        <Field label="Monthly take-home income" value={income} onChange={setIncome} />
        <Field
          label="Needs (rent, utilities, groceries, insurance)"
          value={needs}
          onChange={setNeeds}
          hint={`50/30/20 target: ${currency(totals.target.needs)}`}
        />
        <Field
          label="Wants (dining out, entertainment, subscriptions)"
          value={wants}
          onChange={setWants}
          hint={`50/30/20 target: ${currency(totals.target.wants)}`}
        />
        <Field
          label="Savings & debt payoff"
          value={savings}
          onChange={setSavings}
          hint={`50/30/20 target: ${currency(totals.target.savings)}`}
        />
      </div>

      <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-navy dark:text-white">Your breakdown</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-600 dark:text-gray-400">Total income</dt>
            <dd className="font-medium dark:text-gray-100">{currency(totals.monthlyIncome)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600 dark:text-gray-400">Total allocated</dt>
            <dd className="font-medium dark:text-gray-100">{currency(totals.spent)}</dd>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
            <dt className="font-semibold text-gray-800 dark:text-gray-200">
              {totals.remaining >= 0 ? "Unallocated" : "Over budget by"}
            </dt>
            <dd
              className={`font-bold ${
                totals.remaining >= 0 ? "text-brand" : "text-red-600"
              }`}
            >
              {currency(Math.abs(totals.remaining))}
            </dd>
          </div>
        </dl>
        <p className="mt-5 text-xs text-gray-500 dark:text-gray-400">
          The 50/30/20 rule is a starting guideline, not a rule you must hit
          exactly — use it to spot categories that are meaningfully out of
          line with your goals.
        </p>
      </div>
    </div>
  );
}
