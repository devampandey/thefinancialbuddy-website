import Link from "next/link";
import { getPostsByCategory } from "@/lib/blog";

export const metadata = {
  title: "Chai & Charts",
  description:
    "The Financial Buddy's weekly markets and news digest — read online or download the PDF issue.",
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

// Chai & Charts issues are published like any other post (category:
// "Newsletter"), just surfaced here instead of mixed into the general News
// feed, with an extra "Download PDF" action alongside the usual "Read"
// link when an issue has one attached.
export default function ChaiChartsPage() {
  const issues = getPostsByCategory("Newsletter");

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy dark:text-white">Chai &amp; Charts</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        The Financial Buddy&rsquo;s weekly markets and news digest — every Saturday.
      </p>

      <div className="mt-8">
        {issues.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 px-5 py-8 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
            The first issue is coming soon — check back this Saturday.
          </p>
        ) : (
          <div className="divide-y divide-gray-200 border-t border-gray-200 dark:divide-gray-800 dark:border-gray-800">
            {issues.map((issue) => (
              <div key={issue.slug} className="w-full min-w-0 py-5">
                <Link href={`/blog/${issue.slug}`} className="group block min-w-0">
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
                    href={`/blog/${issue.slug}`}
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
