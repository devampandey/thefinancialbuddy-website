"use client";

import { useMemo, useState } from "react";

const currency = (n) =>
  n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function EmiCalculator() {
  const [principal, setPrincipal] = useState(2500000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const result = useMemo(() => {
    const P = Number(principal) || 0;
    const annualRate = Number(rate) || 0;
    const n = (Number(years) || 0) * 12;
    const r = annualRate / 12 / 100;

    if (P <= 0 || n <= 0) {
      return { emi: 0, totalPayment: 0, totalInterest: 0 };
    }

    let emi;
    if (r === 0) {
      emi = P / n;
    } else {
      const factor = Math.pow(1 + r, n);
      emi = (P * r * factor) / (factor - 1);
    }

    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return { emi, totalPayment, totalInterest };
  }, [principal, rate, years]);

  const Field = ({ label, value, onChange, step }) => (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        type="number"
        min="0"
        step={step || "1"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
      />
    </label>
  );

  return (
    <div className="grid gap-8 rounded-2xl border border-gray-200 p-6 sm:grid-cols-2 sm:p-8">
      <div className="space-y-5">
        <Field label="Loan amount (₹)" value={principal} onChange={setPrincipal} step="10000" />
        <Field label="Annual interest rate (%)" value={rate} onChange={setRate} step="0.1" />
        <Field label="Loan tenure (years)" value={years} onChange={setYears} step="1" />
      </div>

      <div className="rounded-xl bg-gray-50 p-6">
        <h3 className="text-lg font-semibold text-navy">Your EMI</h3>
        <p className="mt-2 text-3xl font-bold text-brand">{currency(result.emi)}</p>
        <p className="text-xs text-gray-500">per month</p>

        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between border-t border-gray-200 pt-3">
            <dt className="text-gray-600">Total payment</dt>
            <dd className="font-medium">{currency(result.totalPayment)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Total interest</dt>
            <dd className="font-medium">{currency(result.totalInterest)}</dd>
          </div>
        </dl>
        <p className="mt-5 text-xs text-gray-500">
          EMI = fixed monthly payment that fully pays off the loan (principal
          + interest) over the chosen tenure, assuming the rate stays fixed.
        </p>
        <p className="mt-3 text-xs text-gray-500">
          This is an indicative estimate only. Under RBI's digital lending
          rules, your actual lender must give you a Key Fact Statement
          showing the real Annual Percentage Rate (APR) and total cost of
          credit, including all fees, before you accept any loan — always
          check that against this estimate.
        </p>
      </div>
    </div>
  );
}
