"use client";

import { useMemo, useState } from "react";

const currency = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const defaultDebts = [
  { id: 1, name: "Credit Card", balance: 4500, apr: 22, minPayment: 120 },
  { id: 2, name: "Car Loan", balance: 9000, apr: 6, minPayment: 220 },
];

// Simulates payoff month-by-month using either snowball (smallest balance
// first) or avalanche (highest APR first) ordering.
function simulate(debts, extra, strategy) {
  let working = debts.map((d) => ({ ...d, balance: Number(d.balance) }));
  let months = 0;
  let totalInterest = 0;
  const maxMonths = 600;

  while (working.some((d) => d.balance > 0) && months < maxMonths) {
    months += 1;

    // interest accrual
    working.forEach((d) => {
      if (d.balance > 0) {
        const monthlyInterest = (d.balance * (d.apr / 100)) / 12;
        d.balance += monthlyInterest;
        totalInterest += monthlyInterest;
      }
    });

    // minimum payments
    working.forEach((d) => {
      if (d.balance > 0) {
        const pay = Math.min(d.minPayment, d.balance);
        d.balance -= pay;
      }
    });

    // extra payment goes to target debt
    let pool = Number(extra) || 0;
    const order = [...working]
      .filter((d) => d.balance > 0)
      .sort((a, b) =>
        strategy === "avalanche" ? b.apr - a.apr : a.balance - b.balance
      );

    for (const target of order) {
      if (pool <= 0) break;
      const debtRef = working.find((d) => d.id === target.id);
      const pay = Math.min(pool, debtRef.balance);
      debtRef.balance -= pay;
      pool -= pay;
    }
  }

  return { months, totalInterest };
}

export default function DebtPayoffCalculator() {
  const [debts, setDebts] = useState(defaultDebts);
  const [extra, setExtra] = useState(150);

  const results = useMemo(() => {
    if (debts.length === 0) return null;
    const snowball = simulate(debts, extra, "snowball");
    const avalanche = simulate(debts, extra, "avalanche");
    const noExtra = simulate(debts, 0, "avalanche");
    return { snowball, avalanche, noExtra };
  }, [debts, extra]);

  const updateDebt = (id, field, value) => {
    setDebts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const addDebt = () => {
    setDebts((prev) => [
      ...prev,
      { id: Date.now(), name: "New Debt", balance: 1000, apr: 15, minPayment: 25 },
    ]);
  };

  const removeDebt = (id) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="rounded-2xl border border-gray-200 p-6 sm:p-8">
      <div className="space-y-4">
        {debts.map((debt) => (
          <div
            key={debt.id}
            className="grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-4 sm:grid-cols-5 sm:items-end"
          >
            <label className="col-span-2 block sm:col-span-1">
              <span className="text-xs font-medium text-gray-600">Name</span>
              <input
                type="text"
                value={debt.name}
                onChange={(e) => updateDebt(debt.id, "name", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-600">Balance ($)</span>
              <input
                type="number"
                min="0"
                value={debt.balance}
                onChange={(e) => updateDebt(debt.id, "balance", Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-600">APR (%)</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={debt.apr}
                onChange={(e) => updateDebt(debt.id, "apr", Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-600">Min payment ($)</span>
              <input
                type="number"
                min="0"
                value={debt.minPayment}
                onChange={(e) => updateDebt(debt.id, "minPayment", Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
              />
            </label>
            <button
              onClick={() => removeDebt(debt.id)}
              className="text-xs font-medium text-red-600 hover:underline sm:mb-1.5"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addDebt}
          className="text-sm font-semibold text-brand hover:underline"
        >
          + Add another debt
        </button>
      </div>

      <div className="mt-6 max-w-xs">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            Extra monthly payment (beyond minimums)
          </span>
          <input
            type="number"
            min="0"
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </label>
      </div>

      {results && (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-xs font-medium uppercase text-gray-500">Minimums only</p>
            <p className="mt-2 text-2xl font-bold text-navy">
              {results.noExtra.months} mo
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {currency(results.noExtra.totalInterest)} total interest
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-xs font-medium uppercase text-gray-500">
              Snowball (smallest first)
            </p>
            <p className="mt-2 text-2xl font-bold text-brand">
              {results.snowball.months} mo
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {currency(results.snowball.totalInterest)} total interest
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-xs font-medium uppercase text-gray-500">
              Avalanche (highest APR first)
            </p>
            <p className="mt-2 text-2xl font-bold text-brand">
              {results.avalanche.months} mo
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {currency(results.avalanche.totalInterest)} total interest
            </p>
          </div>
        </div>
      )}
      <p className="mt-5 text-xs text-gray-500">
        Snowball pays off the smallest balance first for quick psychological
        wins; avalanche targets the highest interest rate first to minimize
        total interest paid. Avalanche is usually cheaper; snowball is often
        easier to stick with.
      </p>
    </div>
  );
}
