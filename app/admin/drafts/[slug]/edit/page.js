"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArticleEditorForm from "@/components/admin/ArticleEditorForm";

// Lets an editor (or the original writer) tweak a pending draft — add a
// cover image, fix wording, change the category — before it goes out via
// Approve & Publish. Saving here does not publish anything; it just rewrites
// the draft file in place, same as editing a live article rewrites that file
// in place.
export default function EditDraftPage({ params }) {
  const router = useRouter();
  const [draft, setDraft] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/drafts/${params.slug}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Couldn't load this draft.");
        if (!cancelled) setDraft(data);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  async function handleSave(values) {
    const res = await fetch(`/api/admin/drafts/${params.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong.");
    // This page is reachable both from the admin review queue and from a
    // writer's own dashboard — router.back() returns to whichever one they
    // actually came from instead of assuming the admin-only route.
    router.back();
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm text-red-600 dark:text-red-400">{loadError}</p>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium text-brand">Edit draft</p>
      <h1 className="mt-1 text-3xl font-bold text-navy dark:text-white">{draft.title}</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Still a draft — saving here updates the pending submission, it doesn&apos;t publish it.
      </p>

      <div className="mt-8">
        <ArticleEditorForm
          initialTitle={draft.title}
          initialCategory={draft.category}
          initialDescription={draft.description}
          initialImageUrl={draft.image}
          initialContent={draft.content}
          onSubmit={handleSave}
          submitLabel="Save draft"
          submittingLabel="Saving…"
        />
      </div>
    </div>
  );
}
