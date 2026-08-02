"use client";

import { useEffect, useState } from "react";

const GST_RATE = 3; // Standard GST on gold/silver jewellery in India.

function formatNumber(n) {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-[#1a1a1a] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100";

// Weight → cost calculator (base value + making charges + GST) plus a small
// reverse calculator (amount → how many grams that buys). `referenceGrams`
// is how many grams the live /api/market price already represents — 10 for
// gold (price is per 10g), 1000 for silver (price is per kg) — so this
// component can work out a true per-gram rate for either metal.
export default function RateCalculator({ dataKey, referenceGrams, defaultMakingPct = 10 }) {
  const [perReference, setPerReference] = useState(null);
  const [weight, setWeight] = useState(10);
  const [makingPct, setMakingPct] = useState(defaultMakingPct);
  const [gstMode, setGstMode] = useState("incl");
  const [amount, setAmount] = useState(10000);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/market")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setPerReference(data?.[dataKey]?.price ?? null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [dataKey]);

  const perGram = perReference != null ? perReference / referenceGrams : null;

  const weightNum = Number(weight) || 0;
  const makingNum = Number(makingPct) || 0;
  const baseValue = perGram != null ? perGram * weightNum : null;
  const makingCharges = baseValue != null ? (baseValue * makingNum) / 100 : null;
  const subtotal = baseValue != null && makingCharges != null ? baseValue + makingCharges : null;
  const gstAmount = subtotal != null ? (subtotal * GST_RATE) / 100 : null;
  const total = subtotal != null && gstAmount != null ? subtotal + (gstMode === "incl" ? gstAmount : 0) : null;

  const amountNum = Number(amount) || 0;
  const effectiveRatePerGram =
    perGram != null
      ? perGram * (1 + makingNum / 100) * (gstMode === "incl" ? 1 + GST_RATE / 100 : 1)
      : null;
  const gramsForAmount =
    effectiveRatePerGram && effectiveRatePerGram > 0 ? amountNum / effectiveRatePerGram : null;

  return (
    <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
      <h3 className="text-sm font-semibold text-navy dark:text-white">Calculator</h3>

      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Weight (gm)</span>
          <input
            type="number"
            min="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Making (%)</span>
          <input
            type="number"
            min="0"
            value={makingPct}
            onChange={(e) => setMakingPct(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">GST</span>
          <select value={gstMode} onChange={(e) => setGstMode(e.target.value)} className={inputClass}>
            <option value="incl">Incl. {GST_RATE}%</option>
            <option value="excl">Excl. GST</option>
          </select>
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            <tr>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-400">Base value</td>
              <td className="px-4 py-2 text-right font-medium text-navy dark:text-white">
                {baseValue != null ? `₹${formatNumber(baseValue)}` : "—"}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-400">Making charges</td>
              <td className="px-4 py-2 text-right font-medium text-navy dark:text-white">
                {makingCharges != null ? `₹${formatNumber(makingCharges)}` : "—"}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-400">GST ({GST_RATE}%)</td>
              <td className="px-4 py-2 text-right font-medium text-navy dark:text-white">
                {gstAmount != null ? `₹${formatNumber(gstAmount)}` : "—"}
              </td>
            </tr>
            <tr className="bg-gray-50 dark:bg-gray-800/60">
              <td className="px-4 py-2.5 font-semibold text-navy dark:text-white">Total amount</td>
              <td className="px-4 py-2.5 text-right text-base font-bold text-brand">
                {total != null ? `₹${formatNumber(total)}` : "—"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-1.5 text-xs text-gray-400">
        {gstMode === "incl" ? "Includes all charges." : "Excludes GST — add it back to see the full amount."}
      </p>

      <div className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-800">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
          Know your money&apos;s worth — enter an amount to see how much you can get
        </span>
        <div className="mt-1.5 flex flex-wrap items-center gap-3">
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`${inputClass} mt-0 max-w-[160px]`}
          />
          <p className="text-sm text-gray-700 dark:text-gray-300">
            ≈{" "}
            <span className="font-semibold text-navy dark:text-white">
              {gramsForAmount != null ? `${gramsForAmount.toFixed(2)} g` : "—"}
            </span>{" "}
            at today&apos;s rate
          </p>
        </div>
      </div>
    </div>
  );
}
