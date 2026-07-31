import RateCard from "@/components/RateCard";
import GoldBreakdown from "@/components/GoldBreakdown";
import CityRatesTable from "@/components/CityRatesTable";
import RateHistoryTable from "@/components/RateHistoryTable";

export const metadata = {
  title: "Gold Rate Today",
  description: "Live gold price in India, per 10 grams — updated regularly.",
};

export default function GoldRatePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy dark:text-white">Gold Rate Today</h1>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        Live international gold price, converted to Indian Rupees per 10 grams.
      </p>

      <div className="mt-8">
        <RateCard dataKey="gold" unit="per 10g (24K)" />
      </div>

      <h2 className="mt-10 text-lg font-bold text-navy dark:text-white">By purity and weight</h2>
      <div className="mt-3">
        <GoldBreakdown />
      </div>

      <h2 className="mt-10 text-lg font-bold text-navy dark:text-white">By city (per 10g, 24K)</h2>
      <div className="mt-3">
        <CityRatesTable dataKey="gold" unit="10g" />
      </div>

      <h2 className="mt-10 text-lg font-bold text-navy dark:text-white">Last 7 days</h2>
      <div className="mt-3">
        <RateHistoryTable metal="gold" unit="10g" />
      </div>

      <p className="mt-6 text-xs text-gray-400">
        This tracks the international spot price converted to INR — it won&apos;t exactly match
        Indian retail or MCX gold rates, which include import duty, GST, and dealer premiums on
        top of the raw international price. The 22K/24K split uses the standard 22/24 purity
        ratio.
      </p>
    </div>
  );
}
