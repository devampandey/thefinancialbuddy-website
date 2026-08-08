import { listDrafts } from "@/lib/drafts";
import DraftRow from "@/components/admin/DraftRow";

export default async function ReviewQueuePage() {
  const drafts = await listDrafts().catch(() => []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-medium text-brand">Admin</p>
      <h1 className="mt-1 text-3xl font-bold text-black dark:text-white">Review queue</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        {drafts.length === 0
          ? "Nothing waiting for review right now."
          : `${drafts.length} article${drafts.length === 1 ? "" : "s"} waiting for review.`}
      </p>

      <div className="mt-8 space-y-4">
        {drafts.map((draft) => (
          <DraftRow key={draft.slug} draft={draft} canApprove />
        ))}
      </div>
    </div>
  );
}
