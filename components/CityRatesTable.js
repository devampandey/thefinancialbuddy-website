"use client";

import { useEffect, useState } from "react";

const CITIES = ["Delhi", "Mumbai", "Chennai", "Kolkata", "Bengaluru", "Hyderabad", "Pune", "Ahmedabad"];

function formatNumber(n) {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

// We don't have a genuine per-city rate feed — real city rates differ due
// to local bullion association pricing, taxes, and dealer premiums. This
// shows the same national (international-spot-converted) rate under each
// city, with a clear disclaimer, rather than implying real variation.
export default function CityRatesTable({ dataKey, unit }) {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/market")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setPrice(data?.[dataKey]?.price ?? null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [dataKey]);

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/60">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
                City
              </th>
              <th className="px-4 py-2 text-right font-medium text-gray-600 dark:text-gray-300">
                Price (per {unit})
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {CITIES.map((city) => (
              <tr key={city}>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{city}</td>
                <td className="px-4 py-2 text-right font-semibold text-navy dark:text-white">
                  {price != null ? `₹${formatNumber(price)}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-gray-400">
        We show one national rate based on the international spot price converted to INR — actual
        city rates vary slightly due to local bullion association pricing, taxes, and dealer
        premiums, which this feed doesn&apos;t capture.
      </p>
    </div>
  );
}
