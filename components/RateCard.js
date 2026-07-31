"use client";

import { useEffect, useState } from "react";

const REFRESH_MS = 60000;

function formatNumber(n) {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

// Shared live-price display for the Gold Rate / Silver Rate pages — pulls
// from the same /api/market endpoint that powers the header ticker.
export default function RateCard({ dataKey, unit }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/market");
        if (!res.ok) throw new Error("bad response");
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    }

    load();
    const interval = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const rate = data?.[dataKey];
  const hasChange = rate?.change != null && rate?.changePercent != null;
  const up = hasChange && rate.change >= 0;

  return (
    <div className="rounded-xl border border-gray-200 p-8 dark:border-gray-800">
      {error && !data ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Couldn&apos;t load the live rate right now — try refreshing.
        </p>
      ) : (
        <>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-navy dark:text-white">
              {rate ? `₹${formatNumber(rate.price)}` : "—"}
            </span>
            <span className="text-gray-500 dark:text-gray-400">{unit}</span>
          </div>
          {hasChange && (
            <p
              className={`mt-2 text-sm font-medium ${
                up ? "text-brand" : "text-red-600 dark:text-red-400"
              }`}
            >
              {up ? "▲" : "▼"} {formatNumber(Math.abs(rate.changePercent))}% today
            </p>
          )}
          {data?.updatedAt && (
            <p className="mt-4 text-xs text-gray-400">
              Updated {new Date(data.updatedAt).toLocaleTimeString("en-IN")}
            </p>
          )}
        </>
      )}
    </div>
  );
}
