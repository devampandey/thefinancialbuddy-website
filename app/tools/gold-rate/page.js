import RateCard from "@/components/RateCard";
import RateChart from "@/components/RateChart";
import RateCalculator from "@/components/RateCalculator";
import GoldBreakdown from "@/components/GoldBreakdown";
import CityRatesTable from "@/components/CityRatesTable";
import RateHistoryTable from "@/components/RateHistoryTable";
import MonthlyRateHistory from "@/components/MonthlyRateHistory";
import MetalInfoSection from "@/components/MetalInfoSection";

export const metadata = {
  title: "Gold Rate Today",
  description: "Live gold price in India, per 10 grams — updated regularly.",
};

const CITY_WEIGHTS = [
  { label: "1g", grams: 1 },
  { label: "8g", grams: 8 },
  { label: "10g", grams: 10 },
  { label: "100g", grams: 100 },
];

export default function GoldRatePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy dark:text-white">Gold Rate Today</h1>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        Live international gold price, converted to Indian Rupees per 10 grams.
      </p>

      <div className="mt-8">
        <RateCard dataKey="gold" unit="per 10g (24K)" />
      </div>

      <h2 className="mt-10 text-lg font-bold text-navy dark:text-white">
        Weekly &amp; monthly graph of gold price in India
      </h2>
      <div className="mt-3">
        <RateChart metal="gold" unit="Price per 10g, 24K" />
      </div>

      <h2 className="mt-10 text-lg font-bold text-navy dark:text-white">Calculator</h2>
      <div className="mt-3">
        <RateCalculator dataKey="gold" referenceGrams={10} defaultMakingPct={10} />
      </div>

      <h2 className="mt-10 text-lg font-bold text-navy dark:text-white">By purity and weight</h2>
      <div className="mt-3">
        <GoldBreakdown />
      </div>

      <h2 className="mt-10 text-lg font-bold text-navy dark:text-white">By city (24K)</h2>
      <div className="mt-3">
        <CityRatesTable dataKey="gold" referenceGrams={10} weights={CITY_WEIGHTS} />
      </div>

      <h2 className="mt-10 text-lg font-bold text-navy dark:text-white">Last 10 days</h2>
      <div className="mt-3">
        <RateHistoryTable metal="gold" unit="10g" />
      </div>

      <h2 className="mt-10 text-lg font-bold text-navy dark:text-white">Historical price of gold</h2>
      <div className="mt-3">
        <MonthlyRateHistory metal="gold" unit="10g" />
      </div>

      <h2 className="mt-10 text-lg font-bold text-navy dark:text-white">About gold rates</h2>
      <div className="mt-3">
        <MetalInfoSection metal="gold" />
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
