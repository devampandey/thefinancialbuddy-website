export const metadata = {
  title: "Privacy & Disclosures",
  description: "Privacy policy and affiliate disclosure for The Financial Buddy.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy dark:text-white">Privacy &amp; Disclosures</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Last updated: July 31, 2026</p>

      <div className="prose-financial mt-6 text-gray-700 dark:text-gray-300">
        <h2>Overview</h2>
        <p>
          The Financial Buddy ("we," "us," or "our") publishes news, personal
          finance content, and free calculators at thefinancialbuddy.com. This
          page explains what information we collect, how it's used, and the
          choices you have.
        </p>

        <h2>Information We Collect</h2>
        <p>We collect a few different kinds of information:</p>
        <ul>
          <li>
            <strong>Account information.</strong> If you create a reader
            account to bookmark articles or leave comments, we store your
            name, email address, and a securely hashed password. We never
            store passwords in plain text.
          </li>
          <li>
            <strong>Content you submit.</strong> Comments you post on articles
            are stored and displayed publicly alongside your account name.
          </li>
          <li>
            <strong>Usage data.</strong> Like most websites, we automatically
            collect standard technical information such as your browser type,
            device type, pages visited, and referring pages through analytics
            tools (see below).
          </li>
        </ul>

        <h2>Cookies and Similar Technologies</h2>
        <p>
          We use cookies for two purposes: to keep you signed in to your
          reader or staff account, and to support the analytics and
          advertising described below. You can control or delete cookies
          through your browser settings, though disabling them may prevent
          sign-in and other features from working correctly.
        </p>

        <h2>Advertising and Google Cookies</h2>
        <p>
          This site may display ads served by Google and other third-party
          vendors. Third-party vendors, including Google, use cookies to
          serve ads based on a user's prior visits to this website or other
          websites. Google's use of advertising cookies enables it and its
          partners to serve ads to you based on your visit to this site
          and/or other sites on the internet.
        </p>
        <p>
          You may opt out of personalized advertising by visiting Google's{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ads Settings
          </a>
          . You can also opt out of a number of third-party vendors' use of
          cookies for personalized advertising by visiting{" "}
          <a
            href="https://www.aboutads.info/choices/"
            target="_blank"
            rel="noopener noreferrer"
          >
            aboutads.info/choices
          </a>
          .
        </p>

        <h2>Analytics</h2>
        <p>
          We use Vercel Analytics and, where enabled, Google Analytics to
          understand how visitors use this site — for example, which
          articles are read most and how people navigate between pages. This
          data is aggregated and is not used to personally identify you.
        </p>

        <h2>Affiliate Disclosure</h2>
        <p>
          Some links on The Financial Buddy are affiliate links. If you click
          through and make a purchase or sign up, we may earn a commission at
          no additional cost to you. We only recommend products we believe
          are genuinely useful, and our opinions are our own.
        </p>

        <h2>Not Financial Advice</h2>
        <p>
          Content on this site is for general educational purposes only and
          does not constitute personalized financial, tax, legal, or
          investment advice. Consult a qualified professional before making
          financial decisions specific to your situation.
        </p>

        <h2>Children's Privacy</h2>
        <p>
          The Financial Buddy is not directed at children under 13, and we do
          not knowingly collect personal information from children under 13.
          If you believe a child has provided us with personal information,
          contact us and we will remove it.
        </p>

        <h2>Your Choices</h2>
        <p>
          You can review or delete your account information, or ask us to
          delete comments you've posted, at any time by contacting us at{" "}
          <a href="mailto:info@thefinancialbuddy.com">
            info@thefinancialbuddy.com
          </a>
          .
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this policy from time to time as the site changes.
          The "Last updated" date at the top of this page reflects the most
          recent revision.
        </p>

        <h2>Contact Us</h2>
        <p>
          Questions about this policy? Reach us at{" "}
          <a href="mailto:info@thefinancialbuddy.com">
            info@thefinancialbuddy.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
