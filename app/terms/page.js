import { SITE_URL } from "@/lib/articleMeta";

export const metadata = {
  title: "Terms of Use & Disclaimer",
  description:
    "Terms of use and disclaimer for The Financial Buddy: informational content only, no financial advice, and how we handle accuracy, links and copyright.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-black dark:text-white sm:text-4xl">
        Terms of Use &amp; Disclaimer
      </h1>
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Last updated: October 2026</p>

      <div className="prose-financial mt-8 rounded-xl border border-gray-200 p-6 text-gray-700 dark:border-gray-800 dark:text-gray-300 sm:p-8">
        <h2>Acceptance of these terms</h2>
        <p>
          By using The Financial Buddy (thefinancialbuddy.com), you agree to these terms. If you
          do not agree, please do not use the site.
        </p>

        <h2>Information only, not financial advice</h2>
        <p>
          Everything published here, including news, analysis, guides, calculators and market
          data, is for general information and education. It is not personalised investment,
          tax, legal or financial advice, and it is not a recommendation to buy, sell or hold any
          security, commodity or other asset. The Financial Buddy is not a SEBI-registered
          investment advisor, broker or research analyst. Please speak to a qualified
          professional before making financial decisions.
        </p>

        <h2>Accuracy of content</h2>
        <p>
          We work to report facts accurately and to correct errors quickly (see our{" "}
          <a href="/editorial-policy" className="text-brand hover:underline">
            editorial policy
          </a>
          ), but we cannot guarantee that every article, price or figure is complete, current or
          error-free. Market data, gold and silver rates, and calculator results are indicative
          and may be delayed or differ from the rates you are quoted. Past performance does not
          indicate future results.
        </p>

        <h2>Calculators and tools</h2>
        <p>
          Our calculators give estimates based on the numbers you enter and the assumptions
          shown on each page. They are illustrations, not offers, quotes or guarantees. Check
          actual terms with your lender, bank or advisor before relying on any result.
        </p>

        <h2>Opinions and analysis</h2>
        <p>
          Articles in our Insights section express the editorial team&apos;s analysis and
          conclusions based on public information. They are opinions, labelled as such, and
          should not be read as statements of fact about any person or organisation.
        </p>

        <h2>Copyright and acceptable use</h2>
        <p>
          The original text, design and graphics on this site belong to The Financial Buddy. You
          may quote short extracts with a clear credit and a link back to the article. You may
          not copy, scrape or republish our content at scale, or use the site in a way that
          harms its operation or other users.
        </p>

        <h2>Third-party links and advertising</h2>
        <p>
          We may link to other websites and may display advertisements served by third parties,
          including Google. We do not control those sites or ads and are not responsible for
          their content or practices. Our{" "}
          <a href="/privacy" className="text-brand hover:underline">
            Privacy &amp; Disclosures
          </a>{" "}
          page explains how advertising and cookies work on this site. Advertising never
          influences what we report.
        </p>

        <h2>User accounts and comments</h2>
        <p>
          If you create an account or post a comment, you are responsible for what you submit.
          We may remove comments or accounts that are abusive, unlawful, misleading or spam.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, The Financial Buddy and its writers are not
          liable for any loss or damage arising from your use of, or reliance on, the site or its
          content.
        </p>

        <h2>Changes and contact</h2>
        <p>
          We may update these terms from time to time; the date above shows the latest revision.
          Questions can be sent to{" "}
          <a href="mailto:info@thefinancialbuddy.com" className="text-brand hover:underline">
            info@thefinancialbuddy.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
