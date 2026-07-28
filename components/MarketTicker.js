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

function ChangeBadge({ change, changePercent }) {
  if (change == null || changePercent == null) {
    return <span className="text-xs text-gray-400">—</span>;
  }
  const up = change >= 0;
  return (
    <span className={`text-xs font-medium ${up ? "text-brand" : "text-red-600"}`}>
      {up ? "▲" : "▼"} {formatNumber(Math.abs(change))} (
      {formatNumber(Math.abs(changePercent))}%)
    </span>
  );
}

function Stat({ label, data, prefix, decimals }) {
  return (
    <div className="min-w-[130px] px-4 py-2">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-sm font-bold text-navy">
        {data ? `${prefix || ""}${formatNumber(data.price, decimals ?? 2)}` : "—"}
      </p>
      <ChangeBadge change={data?.change} changePercent={data?.changePercent} />
    </div>
  );
}

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

  return (
    <div className="border-b border-gray-200 bg-gray-50">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center divide-x divide-gray-200 px-2">
        <Stat label="SENSEX" data={data?.sensex} decimals={2} />
        <Stat label="NIFTY 50" data={data?.nifty} decimals={2} />
        <Stat label="S&P 500 (US)" data={data?.sp500} decimals={2} />
        <Stat label="NIKKEI 225 (JP)" data={data?.nikkei} decimals={2} />
        <Stat label="GOLD (Intl., ₹/10g)" data={data?.gold} prefix="₹" decimals={0} />
        <Stat label="USD/INR" data={data?.usdInr} prefix="₹" decimals={2} />
        <span className="ml-auto px-4 py-2 text-xs text-gray-400">
          {data
            ? `Updated ${new Date(data.updatedAt).toLocaleTimeString("en-IN")}`
            : "Loading market data…"}
        </span>
      </div>
      <p className="mx-auto max-w-6xl px-4 pb-1.5 text-[11px] text-gray-400">
        Gold shown is the international spot price converted to INR — it will
        run below actual Indian retail/MCX rates, which include import duty,
        GST, and dealer premiums. Prices may be delayed and are not licensed
        exchange data.
      </p>
    </div>
  );
}
