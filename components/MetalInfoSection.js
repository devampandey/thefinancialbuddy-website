const CONTENT = {
  gold: {
    factors: `Gold prices in India track international bullion prices closely, since India imports the vast majority of the gold it consumes. When international prices move — driven by US interest rate expectations, dollar strength, and central bank buying — Indian prices follow within the same trading session. On top of the international price, Indian buyers pay import duty, GST, and a making charge that varies by jeweller and design. Festive and wedding-season demand also tends to firm up local premiums, even when the international price is flat.`,
    pricing: `Retail gold in India is quoted in two common purities: 24K (99.9% pure, used mainly for coins and bars) and 22K (91.6% pure, the more common purity for jewellery, since pure 24K gold is too soft to hold intricate designs). A 22K rate will always run lower than 24K for the same weight, roughly in the 22/24 ratio, before making charges and GST are added on top.`,
    whereToBuy: `Gold can be bought as jewellery or coins from a bank or jeweller, as digital gold through several fintech apps and payment platforms, as gold ETFs on the stock exchanges, or as Sovereign Gold Bonds when the government opens a fresh tranche. Jewellery carries the highest making charges of the four; ETFs and digital gold are usually the cheapest way to simply hold gold as an investment rather than as an ornament.`,
    trading: `Investors looking for price exposure without holding physical metal typically use gold ETFs, which trade on the NSE and BSE like any other stock and track the domestic gold price closely. Commodity traders can also take positions on MCX gold futures, which move in lockstep with the international price adjusted for the rupee exchange rate. Both routes avoid the making charges, storage, and resale-purity concerns that come with physical gold.`,
  },
  silver: {
    factors: `Silver prices in India are driven primarily by the international spot price, which itself is shaped by industrial demand — silver is a key input in electronics, solar panels, and electric vehicles — alongside the same macro forces that move gold, such as US interest rates and dollar strength. Because silver has this large industrial-demand component, its price can be more volatile than gold's on a day-to-day basis, reacting to manufacturing data as well as investment flows.`,
    whyCheaper: `Silver trades at a fraction of gold's price mainly because it's far more abundant and easier to mine and refine. Historically it has also been used more for industrial applications than as a store of value, keeping a larger share of global supply in active use rather than held as bullion. This supply-demand balance, not any difference in usefulness, is what keeps silver's per-gram price well below gold's.`,
    whereToBuy: `Silver can be bought as coins, bars, or jewellery from a bank or jeweller, or in dematerialised form through commodity exchanges. Physical silver purchases typically carry a making charge (for jewellery) and, on resale, a melting or purity-verification charge, both of which reduce effective returns compared to the quoted market price.`,
    trading: `The National Spot Exchange offers an E-Silver product that lets investors buy and hold silver in demat form at real-time domestic prices, without taking physical delivery — a minimum lot is usually required, and a separate demat account with a supporting depository is needed to trade it. Commodity traders can also use MCX silver futures for price exposure. Unlike gold, there is currently no dedicated silver ETF traded on Indian stock exchanges, so demat/futures routes are the main paper-silver options.`,
  },
};

// Original, independently written explainer copy for the Gold Rate / Silver
// Rate pages — not sourced or reproduced from any single external site.
export default function MetalInfoSection({ metal }) {
  const c = CONTENT[metal];
  const label = metal === "gold" ? "Gold" : "Silver";

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-navy dark:text-white">
          Factors determining {metal} price in India today
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{c.factors}</p>
      </div>

      {metal === "gold" && (
        <div>
          <h3 className="text-base font-bold text-navy dark:text-white">22K vs 24K — what&apos;s the difference?</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{c.pricing}</p>
        </div>
      )}

      {metal === "silver" && (
        <div>
          <h3 className="text-base font-bold text-navy dark:text-white">Why is silver cheaper than gold?</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{c.whyCheaper}</p>
        </div>
      )}

      <div>
        <h3 className="text-base font-bold text-navy dark:text-white">Where to buy {metal} in India</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{c.whereToBuy}</p>
      </div>

      <div>
        <h3 className="text-base font-bold text-navy dark:text-white">How to invest in {label} without buying physical metal</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{c.trading}</p>
      </div>
    </div>
  );
}
