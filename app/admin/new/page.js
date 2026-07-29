"use client";

import { useRouter } from "next/navigation";
import ArticleEditorForm from "@/components/admin/ArticleEditorForm";

export default function NewArticlePage() {
  const router = useRouter();

  async function handleCreate(values) {
    const res = await fetch("/api/admin/drafts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong.");
    router.push("/admin");
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium text-brand">New article</p>
      <h1 className="mt-1 text-3xl font-bold text-navy dark:text-white">Write an article</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Submitted articles go to the review queue — they won&apos;t appear on the live site
        until an editor approves them.
      </p>

      <div className="mt-8">
        <ArticleEditorForm
          onSubmit={handleCreate}
          submitLabel="Submit for review"
          submittingLabel="Submitting…"
        />
      </div>
    </div>
  );
}
