import RateCard from "@/components/RateCard";

export const metadata = {
  title: "Silver Rate Today",
  description: "Live silver price in India, per kilogram — updated regularly.",
};

export default function SilverRatePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy dark:text-white">Silver Rate Today</h1>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        Live international silver price, converted to Indian Rupees per kilogram.
      </p>

      <div className="mt-8">
        <RateCard dataKey="silver" unit="per kg" />
      </div>

      <p className="mt-6 text-xs text-gray-400">
        This tracks the international spot price converted to INR — it won&apos;t exactly match
        Indian retail or MCX silver rates, which include import duty, GST, and dealer premiums on
        top of the raw international price.
      </p>
    </div>
  );
}
