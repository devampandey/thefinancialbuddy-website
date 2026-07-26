import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-gray-600">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} The Financial Buddy. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-brand">
              Privacy &amp; Disclosures
            </Link>
            <Link href="/contact" className="hover:text-brand">
              Contact
            </Link>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-xs text-gray-400">
          The Financial Buddy provides general educational content and is not
          a substitute for personalized financial, tax, or legal advice. Some
          links on this site are affiliate links, meaning we may earn a
          commission at no extra cost to you if you make a purchase through
          them.
        </p>
      </div>
    </footer>
  );
}
