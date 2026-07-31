export const metadata = {
  title: "About",
  description: "What The Financial Buddy is and who it's for.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy dark:text-white">About The Financial Buddy</h1>
      <div className="prose-financial mt-6 text-gray-700 dark:text-gray-300">
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
        <p>
          If you have a question, found an error, or want to share a story
          idea, we&apos;d love to hear from you. Just head to our{" "}
          <a href="/contact">Contact page</a> and send us a message.
        </p>
      </div>
    </div>
  );
}
