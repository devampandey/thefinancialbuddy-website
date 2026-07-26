export const metadata = {
  title: "About",
  description: "What The Financial Buddy is and who it's for.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy">About The Financial Buddy</h1>
      <div className="prose-financial mt-6 text-gray-700">
        <p>
          The Financial Buddy exists to make everyday money decisions easier —
          budgeting, paying off debt, and building savings — without jargon or
          a sales pitch attached to every article.
        </p>
        <p>
          Every calculator on this site is built to be used first and read
          about second. Every guide is written to answer one specific question
          you can act on today.
        </p>
        <p>
          [Replace this paragraph with your own background/credentials —
          Google and readers both weigh this heavily for financial content,
          so be specific about relevant experience.]
        </p>
      </div>
    </div>
  );
}
