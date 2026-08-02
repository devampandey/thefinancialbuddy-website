// India's customs duty on imported gold/silver bullion was hiked from 6% to
// 15% effective May 13, 2026 (cited by MMTC-PAMP and TaxGuru). We bake that
// into every gold/silver figure we show (live rate, chart, breakdown,
// calculator, city table) so the headline number is close to what Indian
// buyers actually see quoted, rather than the lower "pure spot" price.
// NOTE: if this rate changes again, update it here — it's a policy figure,
// not something derivable from market data.
//
// GST (3%) is deliberately NOT included here — it's applied on top of metal
// value + making charges in the calculator, matching how a jeweller's bill
// actually itemises it. Baking GST in here too would double-count it there.
//
// This still won't match retail/MCX exactly, since dealer premiums and
// local bullion-association pricing vary and aren't captured by any public
// international feed.
export const IMPORT_DUTY_PCT = 15;

export function withImportDuty(value) {
  if (value == null) return null;
  return value * (1 + IMPORT_DUTY_PCT / 100);
}

// How often we're willing to call the Metals.Dev "authority" endpoint (MCX
// rates), in seconds. Metals.Dev's free plan allows 100 requests/month, and
// this endpoint returns both gold and silver in a single call, so one call
// per revalidation window is all we need. 8 hours = 3 calls/day = ~90/month,
// leaving headroom under the 100/month cap. Lower this once on a paid plan
// (e.g. 1200 for the $1.79/mo Copper tier's 2,000/month allowance).
export const MCX_REVALIDATE_SECONDS = 28800;

// Live MCX (Multi Commodity Exchange, India) gold/silver rates via
// Metals.Dev — the same benchmark most Indian rate sites (goodreturns, etc.)
// ultimately reference, so this should land very close to what users expect
// rather than an estimate built from international spot + assumed duty.
// Requires METALS_DEV_API_KEY to be set; returns null (triggering the
// spot+duty fallback in the market route) if the key is missing, the call
// fails, or the monthly quota is exhausted.
export async function getMcxRates() {
  const apiKey = process.env.METALS_DEV_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://api.metals.dev/v1/metal/authority?api_key=${apiKey}&authority=mcx&currency=INR&unit=g`,
      { next: { revalidate: MCX_REVALIDATE_SECONDS } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (json?.status !== "success") return null;

    const goldPerGram = json?.rates?.mcx_gold;
    const silverPerGram = json?.rates?.mcx_silver;
    if (typeof goldPerGram !== "number" || typeof silverPerGram !== "number") return null;

    return { goldPerGram, silverPerGram };
  } catch {
    return null;
  }
}
