"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArticleEditorForm from "@/components/admin/ArticleEditorForm";

export default function EditPostPage({ params }) {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/posts/${params.slug}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Couldn't load this article.");
        if (!cancelled) setPost(data);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  async function handleSave(values) {
    const res = await fetch(`/api/admin/posts/${params.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong.");
    router.push("/admin/posts");
  }

  async function handleDelete() {
    if (!confirm("Delete this article permanently? This can't be undone.")) return;
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch(`/api/admin/posts/${params.slug}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete.");
      router.push("/admin/posts");
    } catch (err) {
      setDeleteError(err.message);
      setDeleting(false);
    }
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm text-red-600 dark:text-red-400">{loadError}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-brand">Edit article</p>
          <h1 className="mt-1 text-3xl font-bold text-black dark:text-white">{post.title}</h1>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
        >
          {deleting ? "Deleting…" : "Delete article"}
        </button>
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Changes save directly to the live site — no review step for edits.
      </p>
      {deleteError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{deleteError}</p>}

      <div className="mt-8">
        <ArticleEditorForm
          initialTitle={post.title}
          initialCategory={post.category}
          initialDescription={post.description}
          initialImageUrl={post.image}
          initialContent={post.content}
          onSubmit={handleSave}
          submitLabel="Save changes"
          submittingLabel="Saving…"
        />
      </div>
    </div>
  );
}
