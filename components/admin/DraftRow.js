"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DraftRow({ draft, canApprove }) {
  const router = useRouter();
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");

  async function discard() {
    if (!confirm(`Discard "${draft.title}"? This can't be undone.`)) return;
    setBusy("discard");
    setError("");
    try {
      const res = await fetch(`/api/admin/drafts/${draft.slug}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to discard.");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setBusy(null);
    }
  }

  async function approve() {
    setBusy("approve");
    setError("");
    try {
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: draft.slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to publish.");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setBusy(null);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-brand dark:bg-gray-800">
              {draft.category}
            </span>
            {draft.author && <span>By {draft.author}</span>}
            {draft.submittedAt && <span>Submitted {draft.submittedAt}</span>}
          </div>
          <h3 className="mt-2 text-lg font-semibold text-navy dark:text-white">{draft.title}</h3>
          {draft.description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{draft.description}</p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            href={`/admin/drafts/${draft.slug}/edit`}
            className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Edit
          </Link>
          {canApprove && (
            <button
              type="button"
              onClick={approve}
              disabled={!!busy}
              className="rounded-lg bg-brand px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-light disabled:opacity-50"
            >
              {busy === "approve" ? "Publishing…" : "Approve & Publish"}
            </button>
          )}
          <button
            type="button"
            onClick={discard}
            disabled={!!busy}
            className="rounded-lg border border-red-300 px-4 py-1.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            {busy === "discard" ? "Discarding…" : "Discard"}
          </button>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
