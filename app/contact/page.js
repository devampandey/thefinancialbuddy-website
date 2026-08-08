export const metadata = {
  title: "Contact",
  description: "Get in touch with The Financial Buddy.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-black dark:text-white">Contact</h1>
      <p className="mt-6 text-gray-700 dark:text-gray-300">
        Questions, corrections, or partnership inquiries — reach out any time.
      </p>
      <a
        href="mailto:info@thefinancialbuddy.com"
        className="mt-4 inline-block text-lg font-semibold text-brand hover:underline"
      >
        info@thefinancialbuddy.com
      </a>
    </div>
  );
}
