"use client";

import { useEffect, useState } from "react";

function formatNumber(n) {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

const WEIGHTS = [1, 8, 10, 100];

// Splits the live 24K per-10g rate into 22K/24K columns across common
// jewellery weights, using the standard 22/24 purity ratio.
export default function GoldBreakdown() {
  const [per10g24k, setPer10g24k] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/market")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setPer10g24k(data?.gold?.price ?? null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const perGram24k = per10g24k != null ? per10g24k / 10 : null;
  const perGram22k = perGram24k != null ? perGram24k * (22 / 24) : null;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800/60">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
              Weight
            </th>
            <th className="px-4 py-2 text-right font-medium text-gray-600 dark:text-gray-300">
              22K
            </th>
            <th className="px-4 py-2 text-right font-medium text-gray-600 dark:text-gray-300">
              24K
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {WEIGHTS.map((g) => (
            <tr key={g}>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{g}g</td>
              <td className="px-4 py-2 text-right font-semibold text-navy dark:text-white">
                {perGram22k != null ? `₹${formatNumber(perGram22k * g)}` : "—"}
              </td>
              <td className="px-4 py-2 text-right font-semibold text-navy dark:text-white">
                {perGram24k != null ? `₹${formatNumber(perGram24k * g)}` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
