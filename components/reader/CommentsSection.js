"use client";

import { useEffect, useState } from "react";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

export default function CommentsSection({ slug }) {
  const [comments, setComments] = useState(null);
  const [signedIn, setSignedIn] = useState(false);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/reader/comments?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => setComments(data.comments || []))
      .catch(() => setComments([]));

    fetch("/api/reader/session")
      .then((res) => res.json())
      .then((data) => setSignedIn(data.signedIn))
      .catch(() => {});
  }, [slug]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reader/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't post your comment.");
      setComments(data.comments);
      setBody("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
      <h2 className="text-lg font-bold text-navy dark:text-white">
        Comments {comments ? `(${comments.length})` : ""}
      </h2>

      {signedIn ? (
        <form onSubmit={handleSubmit} className="mt-4">
          <textarea
            required
            rows={3}
            maxLength={2000}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your thoughts…"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#1a1a1a] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
          {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-light disabled:opacity-50"
          >
            {submitting ? "Posting…" : "Post comment"}
          </button>
        </form>
      ) : (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          <a
            href={`/account/login?next=${encodeURIComponent(`/blog/${slug}`)}`}
            className="font-medium text-brand hover:underline"
          >
            Sign in
          </a>{" "}
          to join the discussion.
        </p>
      )}

      <div className="mt-6 space-y-5">
        {comments && comments.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No comments yet — be the first to share your thoughts.
          </p>
        )}
        {comments?.map((c) => (
          <div key={c.id} className="border-b border-gray-100 pb-4 dark:border-gray-800/60">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-navy dark:text-white">{c.authorName}</span>
              <span className="text-xs text-gray-400">{formatDate(c.createdAt)}</span>
            </div>
            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
              {c.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
