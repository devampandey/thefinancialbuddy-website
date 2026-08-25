import Link from "next/link";
import { getPostsByCategory } from "@/lib/blog";
import { getPostUrl } from "@/lib/categories";
import { SITE_URL } from "@/lib/articleMeta";

export const metadata = {
  title: "Market Pulse",
  description:
    "The Financial Buddy's monthly markets digest — global markets, currency, commodities, and Indian equities tied together into one narrative, published on the first of every month.",
  alternates: { canonical: `${SITE_URL}/market-pulse` },
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

// Market Pulse issues are published like any other post (category:
// "MarketPulse"), just surfaced here instead of mixed into the general News
// feed — same pattern as Chai & Charts, including the optional PDF download
// alongside the usual "Read" link when an issue has one attached.
export default function MarketPulsePage() {
  const issues = getPostsByCategory("MarketPulse");

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-black dark:text-white">Market Pulse</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        The Financial Buddy&rsquo;s monthly markets digest — one issue, one throughline, on the
        first of every month.
      </p>

      <div className="mt-8">
        {issues.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 px-5 py-8 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
            The first issue is coming soon — check back at the start of next month.
          </p>
        ) : (
          <div className="divide-y divide-gray-200 border-t border-gray-200 dark:divide-gray-800 dark:border-gray-800">
            {issues.map((issue) => (
              <div key={issue.slug} className="w-full min-w-0 py-5">
                <Link href={getPostUrl(issue)} className="group block min-w-0">
                  <span className="break-words text-lg font-semibold text-navy group-hover:underline dark:text-white">
                    {issue.title}
                  </span>
                  {issue.description && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {issue.description}
                    </p>
                  )}
                  <span className="mt-1 block text-xs text-gray-400 dark:text-gray-500">
                    {formatDate(issue.date)}
                  </span>
                </Link>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Link
                    href={getPostUrl(issue)}
                    className="text-sm font-semibold text-brand hover:underline"
                  >
                    Read issue
                  </Link>
                  {issue.pdf && (
                    <a
                      href={issue.pdf}
                      download
                      className="inline-flex items-center gap-1.5 rounded-lg border border-navy px-3 py-1.5 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-navy"
                    >
                      Download PDF
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
