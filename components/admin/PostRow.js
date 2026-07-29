"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PostRow({ post }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (
      !confirm(`Delete "${post.title}"? This removes it from the live site and can't be undone.`)
    ) {
      return;
    }
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/posts/${post.slug}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete.");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-brand dark:bg-gray-800">
              {post.category}
            </span>
            {post.author && <span>By {post.author}</span>}
            {post.date && <span>{post.date}</span>}
          </div>
          <h3 className="mt-2 text-lg font-semibold text-navy dark:text-white">{post.title}</h3>
          {post.description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{post.description}</p>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          <Link
            href={`/admin/posts/${post.slug}/edit`}
            className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm font-semibold text-navy transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg border border-red-300 px-4 py-1.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
