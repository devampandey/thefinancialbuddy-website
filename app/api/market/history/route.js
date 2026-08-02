import { NextResponse } from "next/server";
import { withImportDuty } from "@/lib/metals";

// Daily closes don't change intraday except for today's partial candle, so
// this is cheap to cache for an hour.
export const revalidate = 3600;

const YAHOO_BASE = "https://query1.finance.yahoo.com/v8/finance/chart/";
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
};

async function getYahooHistory(symbol, days) {
  try {
    const res = await fetch(
      `${YAHOO_BASE}${encodeURIComponent(symbol)}?interval=1d&range=${days}d`,
      { headers: HEADERS, next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    const result = json?.chart?.result?.[0];
    const timestamps = result?.timestamp || [];
    const closes = result?.indicators?.quote?.[0]?.close || [];
    return timestamps
      .map((t, i) => ({ date: t * 1000, priceUsdOz: closes[i] }))
      .filter((r) => r.priceUsdOz != null);
  } catch {
    return [];
  }
}

async function getUsdInr() {
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.rates?.INR ?? null;
  } catch {
    return null;
  }
}

// Maps the chart/table range buttons to a day count Yahoo's chart endpoint
// accepts as "<N>d". Capped at 10y for "ALL" — GC=F/SI=F continuous-contract
// history on Yahoo doesn't reliably go back further than that anyway, and an
// unbounded range would make the daily-interval response very large.
const RANGE_DAYS = {
  "10d": 10,
  "1w": 7,
  "1m": 30,
  "3m": 90,
  "6m": 180,
  "9m": 270,
  "1y": 365,
  "2y": 730,
  "3y": 1095,
  "5y": 1825,
  all: 3650,
};

// Returns daily closes for gold or silver, converted to INR at today's
// exchange rate (historical INR moves aren't factored in — this is a rough
// trend view, not a precise historical conversion). `range` selects how far
// back to go (see RANGE_DAYS); defaults to the original ~8-day window used
// by the compact "recent days" table.
export async function GET(request) {
  const metal = request.nextUrl.searchParams.get("metal") === "silver" ? "silver" : "gold";
  const rangeParam = (request.nextUrl.searchParams.get("range") || "10d").toLowerCase();
  const days = RANGE_DAYS[rangeParam] || 8;
  const symbol = metal === "silver" ? "SI=F" : "GC=F";
  const unitGrams = metal === "silver" ? 1000 : 10;

  const [history, usdInr] = await Promise.all([getYahooHistory(symbol, days), getUsdInr()]);

  const rows = history
    .map((r) => ({
      date: r.date,
      price: usdInr ? withImportDuty((r.priceUsdOz / 31.1035) * usdInr * unitGrams) : null,
    }))
    .filter((r) => r.price != null);

  return NextResponse.json({ rows });
}
