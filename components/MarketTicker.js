"use client";

import { useEffect, useState } from "react";

const REFRESH_MS = 60000;

function formatNumber(n, decimals = 2) {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function TickerItem({ label, data, prefix, decimals }) {
  const hasChange = data?.change != null && data?.changePercent != null;
  const up = hasChange && data.change >= 0;
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-[11px] sm:gap-2 sm:px-5 sm:py-2 sm:text-xs">
      <span className="font-semibold text-gray-300">{label}</span>
      <span className="font-bold text-white">
        {data ? `${prefix || ""}${formatNumber(data.price, decimals ?? 2)}` : "—"}
      </span>
      {hasChange ? (
        <span className={up ? "text-brand-light" : "text-red-400"}>
          {up ? "▲" : "▼"} {formatNumber(Math.abs(data.changePercent))}%
        </span>
      ) : (
        <span className="text-gray-500">—</span>
      )}
    </span>
  );
}

const ITEMS = [
  { key: "sensex", label: "SENSEX", decimals: 2 },
  { key: "nifty", label: "NIFTY 50", decimals: 2 },
  { key: "sp500", label: "S&P 500 (US)", decimals: 2 },
  { key: "nikkei", label: "NIKKEI 225 (JP)", decimals: 2 },
  { key: "ftse", label: "FTSE 100 (UK)", decimals: 2 },
  { key: "hangSeng", label: "HANG SENG (HK)", decimals: 2 },
  { key: "gold", label: "GOLD (₹/10g, incl. duty)", decimals: 0, prefix: "₹" },
  { key: "usdInr", label: "USD/INR", decimals: 2, prefix: "₹" },
];

export default function MarketTicker() {
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

  if (error && !data) {
    return null; // fail quietly rather than show a broken widget
  }

  // The item list is rendered twice, back to back, inside a single track
  // that animates from translateX(0%) to translateX(-50%) — since that's
  // exactly the width of one copy, the loop point is visually seamless.
  return (
    <div className="overflow-hidden border-b border-navy-light/40 bg-navy">
      <div className="flex w-max animate-marquee items-center hover:[animation-play-state:paused]">
        {ITEMS.map((item) => (
          <TickerItem
            key={`a-${item.key}`}
            label={item.label}
            data={data?.[item.key]}
            prefix={item.prefix}
            decimals={item.decimals}
          />
        ))}
        {ITEMS.map((item) => (
          <TickerItem
            key={`b-${item.key}`}
            label={item.label}
            data={data?.[item.key]}
            prefix={item.prefix}
            decimals={item.decimals}
          />
        ))}
      </div>
    </div>
  );
}
