"use client";

import { useEffect, useState } from "react";

function formatNumber(n) {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

function formatDate(ms) {
  return new Date(ms).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function RateHistoryTable({ metal, unit }) {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/market/history?metal=${metal}`)
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

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800/60">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
              Date
            </th>
            <th className="px-4 py-2 text-right font-medium text-gray-600 dark:text-gray-300">
              Price (per {unit})
            </th>
            <th className="px-4 py-2 text-right font-medium text-gray-600 dark:text-gray-300">
              Change
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {rows === null && (
            <tr>
              <td colSpan={3} className="px-4 py-3 text-center text-gray-400">
                Loading…
              </td>
            </tr>
          )}
          {rows?.length === 0 && (
            <tr>
              <td colSpan={3} className="px-4 py-3 text-center text-gray-400">
                History isn&apos;t available right now.
              </td>
            </tr>
          )}
          {rows?.map((r, i) => {
            const prev = rows[i - 1];
            const change = prev ? r.price - prev.price : null;
            const up = change != null && change >= 0;
            return (
              <tr key={r.date}>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{formatDate(r.date)}</td>
                <td className="px-4 py-2 text-right font-semibold text-navy dark:text-white">
                  ₹{formatNumber(r.price)}
                </td>
                <td
                  className={`px-4 py-2 text-right ${
                    change == null
                      ? "text-gray-400"
                      : up
                      ? "text-brand"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {change == null ? "—" : `${up ? "▲" : "▼"} ₹${formatNumber(Math.abs(change))}`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
