"use client";

import { useEffect, useMemo, useState } from "react";

function formatNumber(n) {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Groups ~12-13 months of daily closes into per-calendar-month summaries —
// opening/closing rate for the month, high/low with dates, and the overall
// trend — rendered as a collapsible list (native <details>, no extra
// dependency) with the current month expanded by default.
export default function MonthlyRateHistory({ metal, unit }) {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/market/history?metal=${metal}&range=1y`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setRows(data.rows || []);
      })
      .catch(() => {
        if (!cancelled) setRows([]);
      });
    return () => {
      cancelled = true;
    };
  }, [metal]);

  const months = useMemo(() => {
    if (!rows || rows.length === 0) return [];

    const groups = new Map();
    rows.forEach((r) => {
      const d = new Date(r.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({ ...r, dateObj: d });
    });

    const summaries = [];
    groups.forEach((entries, key) => {
      entries.sort((a, b) => a.date - b.date);
      const [year, monthIdx] = key.split("-").map(Number);
      const first = entries[0];
      const last = entries[entries.length - 1];
      const highest = entries.reduce((max, e) => (e.price > max.price ? e : max), entries[0]);
      const lowest = entries.reduce((min, e) => (e.price < min.price ? e : min), entries[0]);
      const trendPct = first.price ? ((last.price - first.price) / first.price) * 100 : 0;

      summaries.push({
        key,
        year,
        monthIdx,
        label: `${MONTH_NAMES[monthIdx]} ${year}`,
        first,
        last,
        highest,
        lowest,
        trendPct,
      });
    });

    return summaries.sort((a, b) => b.year - a.year || b.monthIdx - a.monthIdx);
  }, [rows]);

  if (rows === null) {
    return <p className="text-sm text-gray-400">Loading…</p>;
  }
  if (months.length === 0) {
    return <p className="text-sm text-gray-400">Monthly history isn&apos;t available right now.</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
      {months.map((m, i) => {
        const rising = m.trendPct >= 0;
        return (
          <details
            key={m.key}
            open={i === 0}
            className="group border-b border-gray-200 last:border-b-0 dark:border-gray-800"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-navy hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800/60">
              <span>{m.label}</span>
              <span
                className={`text-xs font-medium ${
                  rising ? "text-brand" : "text-red-600 dark:text-red-400"
                }`}
              >
                {rising ? "▲" : "▼"} {Math.abs(m.trendPct).toFixed(2)}%
              </span>
            </summary>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <tr>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                    {m.first.dateObj.getDate()} {MONTH_NAMES[m.monthIdx]} rate
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-navy dark:text-white">
                    ₹{formatNumber(m.first.price)} <span className="text-gray-400">/ {unit}</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                    {m.last.dateObj.getDate()} {MONTH_NAMES[m.monthIdx]} rate
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-navy dark:text-white">
                    ₹{formatNumber(m.last.price)} <span className="text-gray-400">/ {unit}</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400">Highest rate</td>
                  <td className="px-4 py-2 text-right font-medium text-navy dark:text-white">
                    ₹{formatNumber(m.highest.price)}{" "}
                    <span className="text-gray-400">
                      ({m.highest.dateObj.getDate()} {MONTH_NAMES[m.monthIdx]})
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400">Lowest rate</td>
                  <td className="px-4 py-2 text-right font-medium text-navy dark:text-white">
                    ₹{formatNumber(m.lowest.price)}{" "}
                    <span className="text-gray-400">
                      ({m.lowest.dateObj.getDate()} {MONTH_NAMES[m.monthIdx]})
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400">Price trend</td>
                  <td
                    className={`px-4 py-2 text-right font-medium ${
                      rising ? "text-brand" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {rising ? "Rising" : "Falling"} ({rising ? "+" : "-"}
                    {Math.abs(m.trendPct).toFixed(2)}%)
                  </td>
                </tr>
              </tbody>
            </table>
          </details>
        );
      })}
    </div>
  );
}
