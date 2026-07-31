import { NextResponse } from "next/server";

// Refresh the upstream data at most once every 60 seconds, regardless of how
// many visitors hit this route in that window.
export const revalidate = 60;

const YAHOO_BASE = "https://query1.finance.yahoo.com/v8/finance/chart/";
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
};

async function getYahooQuote(symbol) {
  try {
    const res = await fetch(
      `${YAHOO_BASE}${encodeURIComponent(symbol)}?interval=1d&range=1d`,
      { headers: HEADERS, next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta || typeof meta.regularMarketPrice !== "number") return null;
    const price = meta.regularMarketPrice;
    const prevClose = meta.previousClose ?? meta.chartPreviousClose;
    const change = prevClose ? price - prevClose : null;
    const changePercent = prevClose ? (change / prevClose) * 100 : null;
    return { price, change, changePercent };
  } catch {
    return null;
  }
}

async function getUsdInr() {
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD", {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const rate = json?.rates?.INR;
    return typeof rate === "number" ? { price: rate } : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const [sensex, nifty, sp500, nikkei, ftse, hangSeng, goldUsdOz, silverUsdOz, usdInr] =
    await Promise.all([
      getYahooQuote("^BSESN"),
      getYahooQuote("^NSEI"),
      getYahooQuote("^GSPC"),
      getYahooQuote("^N225"),
      getYahooQuote("^FTSE"),
      getYahooQuote("^HSI"),
      getYahooQuote("GC=F"),
      getYahooQuote("SI=F"),
      getUsdInr(),
    ]);

  // Approximate international gold/silver prices converted to INR. Note:
  // these will not exactly match Indian retail/MCX rates, which include
  // import duty, GST, and dealer premiums on top of the raw international
  // price.
  let goldInr10g = null;
  if (goldUsdOz?.price && usdInr?.price) {
    const pricePerGramUsd = goldUsdOz.price / 31.1035;
    goldInr10g = {
      price: pricePerGramUsd * usdInr.price * 10,
      change:
        goldUsdOz.change != null
          ? (goldUsdOz.change / 31.1035) * usdInr.price * 10
          : null,
      changePercent: goldUsdOz.changePercent,
    };
  }

  let silverInrKg = null;
  if (silverUsdOz?.price && usdInr?.price) {
    const pricePerGramUsd = silverUsdOz.price / 31.1035;
    silverInrKg = {
      price: pricePerGramUsd * usdInr.price * 1000,
      change:
        silverUsdOz.change != null
          ? (silverUsdOz.change / 31.1035) * usdInr.price * 1000
          : null,
      changePercent: silverUsdOz.changePercent,
    };
  }

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    sensex,
    nifty,
    sp500,
    nikkei,
    ftse,
    hangSeng,
    gold: goldInr10g,
    silver: silverInrKg,
    usdInr,
  });
}
