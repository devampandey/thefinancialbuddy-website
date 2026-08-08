import RateCard from "@/components/RateCard";
import RateChart from "@/components/RateChart";
import RateCalculator from "@/components/RateCalculator";
import SilverBreakdown from "@/components/SilverBreakdown";
import CityRatesTable from "@/components/CityRatesTable";
import RateHistoryTable from "@/components/RateHistoryTable";
import MonthlyRateHistory from "@/components/MonthlyRateHistory";
import MetalInfoSection from "@/components/MetalInfoSection";

export const metadata = {
  title: "Silver Rate Today",
  description: "Live silver price in India, per kilogram — updated regularly.",
};

const CITY_WEIGHTS = [
  { label: "10g", grams: 10 },
  { label: "100g", grams: 100 },
  { label: "1kg", grams: 1000 },
];

export default function SilverRatePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-black dark:text-white">Silver Rate Today</h1>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        Live international silver price, converted to Indian Rupees per kilogram.
      </p>

      <div className="mt-8">
        <RateCard dataKey="silver" unit="per kg" />
      </div>

      <h2 className="mt-10 text-lg font-bold text-black dark:text-white">
        Weekly &amp; monthly graph of silver price in India
      </h2>
      <div className="mt-3">
        <RateChart metal="silver" unit="Price per kg" />
      </div>

      <h2 className="mt-10 text-lg font-bold text-black dark:text-white">Calculator</h2>
      <div className="mt-3">
        <RateCalculator dataKey="silver" referenceGrams={1000} defaultMakingPct={12} />
      </div>

      <h2 className="mt-10 text-lg font-bold text-black dark:text-white">By weight</h2>
      <div className="mt-3">
        <SilverBreakdown />
      </div>

      <h2 className="mt-10 text-lg font-bold text-black dark:text-white">By city</h2>
      <div className="mt-3">
        <CityRatesTable dataKey="silver" referenceGrams={1000} weights={CITY_WEIGHTS} />
      </div>

      <h2 className="mt-10 text-lg font-bold text-black dark:text-white">Last 10 days</h2>
      <div className="mt-3">
        <RateHistoryTable metal="silver" unit="kg" />
      </div>

      <h2 className="mt-10 text-lg font-bold text-black dark:text-white">Historical price of silver</h2>
      <div className="mt-3">
        <MonthlyRateHistory metal="silver" unit="kg" />
      </div>

      <h2 className="mt-10 text-lg font-bold text-black dark:text-white">About silver rates</h2>
      <div className="mt-3">
        <MetalInfoSection metal="silver" />
      </div>

      <p className="mt-6 text-xs text-gray-400">
        This tracks the international spot price converted to INR, with India&apos;s 15% import
        duty included — it still won&apos;t exactly match Indian retail or MCX silver rates, which
        also factor in GST and dealer premiums on top of this. Use the calculator above to add GST
        and your own making-charge estimate.
      </p>
    </div>
  );
}
