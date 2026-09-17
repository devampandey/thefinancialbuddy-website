import { SITE_URL } from "@/lib/articleMeta";

export const metadata = {
  title: "Editorial Policy",
  description: "How The Financial Buddy sources, writes, reviews, and corrects its articles.",
  alternates: { canonical: `${SITE_URL}/editorial-policy` },
};

export default function EditorialPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-black dark:text-white sm:text-4xl">
        Editorial Policy
      </h1>

      <div className="prose-financial mt-8 rounded-xl border border-gray-200 p-6 text-gray-700 dark:border-gray-800 dark:text-gray-300 sm:p-8">
        <h2>How we source a story</h2>
        <p>
          Every news article on The Financial Buddy is checked against multiple independent,
          credible sources before it&apos;s written. We look for a clear publish or update
          timestamp on each source rather than relying on how current a headline sounds, and we
          require the underlying facts to be corroborated by more than one outlet — a single,
          uncorroborated report isn&apos;t enough for us to publish on its own.
        </p>

        <h2>How we write it</h2>
        <p>
          Once a story clears that bar, our writers summarize and synthesize the facts in their
          own words. We don&apos;t copy sentences or passages from source material, and we don&apos;t
          republish scraped or lightly-reworded content from other outlets. Every article on this
          site is an original write-up of publicly reported facts, not a reproduction of any single
          source&apos;s reporting.
        </p>

        <h2>Review before publishing</h2>
        <p>
          Every article is reviewed by a person before it goes live — nothing is published
          automatically without a human checking it first. We care more about getting the facts
          right than being first to publish.
        </p>

        <h2>Corrections</h2>
        <p>
          If we get something wrong, we correct it as soon as we know. If you spot an error,
          please email us at{" "}
          <a href="mailto:info@thefinancialbuddy.com" className="text-brand hover:underline">
            info@thefinancialbuddy.com
          </a>{" "}
          with a link to the article and a description of the issue, and we&apos;ll look into it
          promptly.
        </p>

        <h2>What this site is not</h2>
        <p>
          The Financial Buddy is an independent news and information site, not a bank, brokerage,
          or investment advisor. Nothing published here is personalized financial advice or a
          recommendation to buy, sell, or invest in anything — see our{" "}
          <a href="/about" className="text-brand hover:underline">
            About page
          </a>{" "}
          for more on who we are.
        </p>
      </div>
    </div>
  );
}
