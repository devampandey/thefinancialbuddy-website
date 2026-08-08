"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SavedArticlesPage() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/reader/bookmarks")
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/account/login?next=/account/saved");
          return;
        }
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Couldn't load saved articles.");
        setBookmarks(data.bookmarks);
      })
      .catch((err) => setError(err.message));
  }, [router]);

  async function handleRemove(slug) {
    setBookmarks((prev) => prev.filter((b) => b.slug !== slug));
    await fetch("/api/reader/bookmarks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium text-brand">Your account</p>
      <h1 className="mt-1 text-3xl font-bold text-black dark:text-white">Saved articles</h1>

      {error && <p className="mt-6 text-sm text-red-600 dark:text-red-400">{error}</p>}

      {bookmarks && bookmarks.length === 0 && (
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Nothing saved yet — look for the bookmark button on any article.
        </p>
      )}

      <div className="mt-8 divide-y divide-gray-200 dark:divide-gray-800">
        {bookmarks?.map((b) => (
          <div key={b.slug} className="flex items-center justify-between gap-4 py-4">
            <Link
              href={`/blog/${b.slug}`}
              className="font-semibold text-navy hover:underline dark:text-white"
            >
              {b.title}
            </Link>
            <button
              onClick={() => handleRemove(b.slug)}
              className="shrink-0 text-sm font-medium text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
