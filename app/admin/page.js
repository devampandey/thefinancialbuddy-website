import Link from "next/link";
import { getSession } from "@/lib/session";
import { listDrafts } from "@/lib/drafts";
import DraftRow from "@/components/admin/DraftRow";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function AdminDashboard() {
  const session = await getSession();
  const allDrafts = await listDrafts().catch(() => []);
  const mine = session ? allDrafts.filter((d) => d.author === session.name) : [];

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-brand">Staff dashboard</p>
          <h1 className="mt-1 text-3xl font-bold text-black dark:text-white">
            Hi {session?.name || "there"}
          </h1>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/admin/new"
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-light"
        >
          + Write new article
        </Link>
        {session?.role === "admin" && (
          <>
            <Link
              href="/admin/review"
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
            >
              Review queue ({allDrafts.length} pending)
            </Link>
            <Link
              href="/admin/posts"
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
            >
              Manage articles
            </Link>
          </>
        )}
      </div>

      <h2 className="mt-12 text-lg font-semibold text-black dark:text-white">Your submissions</h2>
      <div className="mt-4 space-y-4">
        {mine.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nothing here yet — submit your first article and it&apos;ll show up here while it
            waits for review.
          </p>
        )}
        {mine.map((draft) => (
          <DraftRow key={draft.slug} draft={draft} canApprove={false} />
        ))}
      </div>
    </div>
  );
}
