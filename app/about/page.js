export const metadata = {
  title: "About",
  description: "What The Financial Buddy is and who it's for.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-navy dark:text-white sm:text-4xl">
        About The Financial Buddy — Practical Money News, Explained Simply
      </h1>

      <div className="prose-financial mt-8 rounded-xl border border-gray-200 p-6 text-gray-700 dark:border-gray-800 dark:text-gray-300 sm:p-8">
        <p>
          The Financial Buddy is an independent news and information website
          that helps people understand the stories and numbers shaping
          everyday life. We cover personal finance, business, markets,
          politics, technology, AI, and sports in simple, easy-to-understand
          language.
        </p>
        <p>
          We&apos;re not a bank, brokerage, investment advisor, or political
          organization. Everything published on this website is for
          informational purposes only. We don&apos;t provide personalized
          financial advice, and nothing on this site should be considered a
          recommendation to buy, sell, or invest in any product or service.
          Our job is to explain what&apos;s happening so you can make your
          own decisions.
        </p>
        <p>
          We care more about getting the facts right than being the first to
          publish them. Every article is reviewed before it goes live, and if
          we make a mistake, we&apos;ll correct it as quickly as possible.
        </p>
        <p>
          Some pages on our website contain affiliate links. If you buy
          something through these links, we may earn a small commission at no
          extra cost to you. This helps support our work, but it never
          influences what we write or how we review a topic.
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 p-6 dark:border-gray-800 sm:p-8">
        <p className="text-gray-700 dark:text-gray-300">
          If you have a question, found an error, or want to share a story idea, we&apos;d love
          to hear from you. You can reach the newsroom by emailing
        </p>
        <a
          href="mailto:info@thefinancialbuddy.com"
          className="mt-3 inline-flex items-center gap-2 text-lg font-semibold text-brand hover:underline"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m3 7 9 6 9-6" />
          </svg>
          info@thefinancialbuddy.com
        </a>
      </div>
    </div>
  );
}
