export const metadata = {
  title: "Privacy & Disclosures",
  description: "Privacy policy and affiliate disclosure for The Financial Buddy.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy">Privacy &amp; Disclosures</h1>

      <div className="prose-financial mt-6 text-gray-700">
        <h2>Affiliate Disclosure</h2>
        <p>
          Some links on The Financial Buddy are affiliate links. If you click
          through and make a purchase or sign up, we may earn a commission at
          no additional cost to you. We only recommend products we believe are
          genuinely useful, and our opinions are our own.
        </p>

        <h2>Not Financial Advice</h2>
        <p>
          Content on this site is for general educational purposes only and
          does not constitute personalized financial, tax, legal, or
          investment advice. Consult a qualified professional before making
          financial decisions specific to your situation.
        </p>

        <h2>Data We Collect</h2>
        <p>
          [Placeholder — replace with your actual privacy policy. At minimum,
          disclose use of analytics (e.g., Google Analytics), any cookies set
          by ad networks once active, and how users can contact you with
          privacy questions. Consider using a generator like Termly or
          consulting a lawyer once you have real traffic and ad partners.]
        </p>
      </div>
    </div>
  );
}
