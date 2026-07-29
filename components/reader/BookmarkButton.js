"use client";

import { useEffect, useState } from "react";

export default function BookmarkButton({ slug, title }) {
  const [signedIn, setSignedIn] = useState(false);
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const sessionRes = await fetch("/api/reader/session");
        const sessionData = await sessionRes.json();
        if (cancelled) return;
        setSignedIn(sessionData.signedIn);
        if (!sessionData.signedIn) {
          setReady(true);
          return;
        }
        const bookmarksRes = await fetch("/api/reader/bookmarks");
        const bookmarksData = await bookmarksRes.json();
        if (cancelled) return;
        setSaved((bookmarksData.bookmarks || []).some((b) => b.slug === slug));
        setReady(true);
      } catch {
        if (!cancelled) setReady(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function toggle() {
    if (!signedIn) {
      window.location.href = `/account/login?next=${encodeURIComponent(`/blog/${slug}`)}`;
      return;
    }
    const next = !saved;
    setSaved(next);
    await fetch("/api/reader/bookmarks", {
      method: next ? "POST" : "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, title }),
    });
  }

  if (!ready) return null;

  return (
    <button
      onClick={toggle}
      aria-pressed={saved}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
        saved
          ? "border-brand bg-brand/10 text-brand"
          : "border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinejoin="round" d="M6 3.5h12v18l-6-4.2-6 4.2v-18z" />
      </svg>
      {saved ? "Saved" : "Save"}
    </button>
  );
}
