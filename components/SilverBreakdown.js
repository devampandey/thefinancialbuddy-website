"use client";

import { useEffect, useState } from "react";

function formatNumber(n) {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

const WEIGHTS = [
  { label: "1g", grams: 1 },
  { label: "100g", grams: 100 },
  { label: "1kg", grams: 1000 },
];

export default function SilverBreakdown() {
  const [perKg, setPerKg] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/market")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setPerKg(data?.silver?.price ?? null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const perGram = perKg != null ? perKg / 1000 : null;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800/60">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
              Weight
            </th>
            <th className="px-4 py-2 text-right font-medium text-gray-600 dark:text-gray-300">
              Price (999 fine)
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {WEIGHTS.map((w) => (
            <tr key={w.label}>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{w.label}</td>
              <td className="px-4 py-2 text-right font-semibold text-navy dark:text-white">
                {perGram != null ? `₹${formatNumber(perGram * w.grams)}` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
